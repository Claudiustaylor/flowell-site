/**
 * Printful fulfillment integration — SERVER ONLY.
 *
 * PRINTFUL_API_KEY has no NEXT_PUBLIC_ prefix so it never reaches the browser.
 * Dashboard: Printful → Account Settings → Advanced → API → Enable API access
 * → generate a key → paste into Vercel env as PRINTFUL_API_KEY.
 *
 * Architecture: orders flow Stripe webhook → buildPrintfulOrder() → POST /v2/orders
 * with catalog_variant_id + placements pointing at print files hosted on this site.
 * No sync products need to be created in the Printful dashboard — one-off orders
 * against the public catalog with our hosted print files.
 *
 * API shape (v2 beta): https://developers.printful.com/docs/v2-beta/
 *  POST /v2/orders  { recipient, order_items: [{ source: 'catalog',
 *    catalog_variant_id, quantity, placements: [{ placement: 'front',
 *    technique: 'dtg', layers: [{ type: 'file', url }] }] }] }
 */

const PRINTFUL_API = 'https://api.printful.com/v2'

// ─── Print files (hosted on this site, HTTPS, stable URLs) ────────────
// Noir capsule: tonal charcoal ink for washed-black garments.
// Ivory capsule: matte-black ink for bone garments.
export const PRINT_FILES = {
  noir: '/images/merch/print-files/fears-noir-tonal-print-v3.png',
  ivory: '/images/merch/print-files/fears-ivory-print-v2.png',
  classic: '/images/merch/print-files/fears-classic-print-v2.png',
} as const

/**
 * Product → Printful catalog variant map.
 *
 * catalog_variant_id values are the real Printful catalog variant IDs for the
 * closest blank to each product. They are PUBLIC data (the catalog is a public
 * API resource), not secrets. Updated when the catalog changes.
 *
 * Size → variant mapping: each product row below maps a merch product to the
 * Printful product family; the order builder resolves the size the customer
 * picked to the variant ID for that size + color.
 */
type PrintfulMap = {
  catalogProductId: number // Printful catalog product family (for reference/refresh)
  fileKey: keyof typeof PRINT_FILES
  color: string // Printful color name actually ordered
  sizes: Record<string, number> // merch size → catalog_variant_id
  extraPlacements?: { placement: 'back' | 'sleeve_left'; file: string }[] // printed in addition to the front
  note?: string
}

export const PRINTFUL_MAP: Record<string, PrintfulMap> = {
  'fears-hoodie': {
    catalogProductId: 294,
    fileKey: 'classic',
    color: 'Black',
    sizes: { S: 9227, M: 9228, L: 9229, XL: 9230, '2XL': 9231 },
    extraPlacements: [{ placement: 'sleeve_left', file: '/images/merch/print-files/fears-classic-sleeve-bolt-v2.png' }],
    note: 'Bella+Canvas 3719 pullover hoodie',
  },
  'fears-tee': {
    catalogProductId: 71,
    fileKey: 'classic',
    color: 'Black',
    sizes: { S: 4016, M: 4017, L: 4018, XL: 4019, '2XL': 4020, '3XL': 5295 },
    extraPlacements: [{ placement: 'back', file: '/images/merch/print-files/fears-classic-back-tracklist-v2.png' }],
    note: 'Bella+Canvas 3001 staple tee',
  },
  'fears-noir-hoodie': {
    catalogProductId: 892,
    fileKey: 'noir',
    color: 'Vintage Black',
    sizes: { S: 22993, M: 22994, L: 22995, XL: 22996, '2XL': 22997, '3XL': 22998 },
    extraPlacements: [{ placement: 'back', file: '/images/merch/print-files/fears-noir-hoodie-back-bolt-v2.png' }],
    note: 'Bella+Canvas 4719 oversized heavyweight hoodie, Vintage Black — tonal FEARS print',
  },
  'fears-noir-tee': {
    catalogProductId: 713,
    fileKey: 'noir',
    color: 'Faded Black',
    sizes: { S: 17569, M: 17574, L: 17579, XL: 17584, '2XL': 17589, '3XL': 17594 },
    extraPlacements: [{ placement: 'back', file: '/images/merch/print-files/fears-noir-tee-back-bolt-v3.png' }],
    note: 'AS Colour 5082 oversized faded tee, Faded Black — tonal FEARS print',
  },
  'fears-ivory-crop': {
    catalogProductId: 317,
    fileKey: 'ivory',
    color: 'Storm',
    sizes: { S: 9648, M: 9649, L: 9650, XL: 9651, '2XL': 9652 },
    extraPlacements: [{ placement: 'back', file: '/images/merch/print-files/fears-ivory-crop-back-bolt-v2.png' }],
    note: "Bella+Canvas 7502 women's cropped hoodie, Storm (light gray — no bone colorway in catalog)",
  },
  'fears-ivory-tee': {
    catalogProductId: 360,
    fileKey: 'ivory',
    color: 'Natural',
    sizes: { S: 46501, M: 46502, L: 46503, XL: 46504, '2XL': 46505 },
    extraPlacements: [{ placement: 'back', file: '/images/merch/print-files/fears-ivory-back-bolt-v2.png' }],
    note: "Bella+Canvas 6400 women's relaxed tee, Natural — black arched FEARS",
  },
}

// ─── Order builder ───────────────────────────────────────────────────

type StripeLineItem = {
  productId: string
  qty: number
  size?: string
}

type PrintfulRecipient = {
  name: string
  address1: string
  address2?: string
  city: string
  state_code: string
  country_code: string
  zip: string
  phone?: string
  email?: string
}

/**
 * Build the body for POST /v2/orders. Returns null when the order has no
 * fulfillable (apparel) items — e.g. a pure vinyl purchase — so the caller
 * can fall back to a manual-fulfillment notification.
 */
export function buildPrintfulOrder(opts: {
  externalId: string
  recipient: PrintfulRecipient
  lines: StripeLineItem[]
  origin: string
}): { external_id: string; recipient: PrintfulRecipient; order_items: unknown[] } | null {
  const items: unknown[] = []
  for (const line of opts.lines) {
    const map = PRINTFUL_MAP[line.productId]
    if (!map) continue
    const size = (line.size ?? 'M').toUpperCase()
    const variantId = map.sizes[size] ?? map.sizes['M']
    const fileUrl = `${opts.origin}${PRINT_FILES[map.fileKey]}`

    items.push({
      source: 'catalog',
      catalog_variant_id: variantId,
      quantity: line.qty,
      placements: [
        {
          placement: 'front',
          technique: 'dtg',
          layers: [{ type: 'file', url: fileUrl }],
        },
        ...(map.extraPlacements ?? []).map((extra) => ({
          placement: extra.placement,
          technique: 'dtg',
          layers: [{ type: 'file', url: `${opts.origin}${extra.file}` }],
        })),
      ],
    })
  }
  if (items.length === 0) return null
  return {
    external_id: opts.externalId,
    recipient: opts.recipient,
    order_items: items,
  }
}

/**
 * Create the fulfillment order in Printful. Non-throwing: fulfillment failures
 * must never fail the webhook; the order email always goes out first.
 */
export async function sendToPrintful(orderBody: unknown): Promise<
  { ok: true; orderId?: number; status?: string } | { ok: false; error: string }
> {
  const apiKey = process.env.PRINTFUL_API_KEY
  if (!apiKey) {
    return { ok: false, error: 'PRINTFUL_API_KEY not set — order needs manual fulfillment' }
  }
  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }
    if (process.env.PRINTFUL_STORE_ID) headers['X-PF-Store-Id'] = process.env.PRINTFUL_STORE_ID
    const res = await fetch(`${PRINTFUL_API}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderBody),
      signal: AbortSignal.timeout(20000),
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      const detail = JSON.stringify(data).slice(0, 400)
      return { ok: false, error: `Printful ${res.status}: ${detail}` }
    }
    const order = data?.data ?? data
    return { ok: true, orderId: order?.id, status: order?.status }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `Printful request failed: ${msg}` }
  }
}