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
// Noir capsule: warm-cream ink for washed-black garments.
// Ivory capsule: matte-black ink for bone garments.
export const PRINT_FILES = {
  noir: '/images/merch/print-files/fears-noir-print.png',
  ivory: '/images/merch/print-files/fears-ivory-print.png',
  classic: '/images/merch/print-files/fears-classic-print.png',
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
  note?: string
}

export const PRINTFUL_MAP: Record<string, PrintfulMap> = {
  'fears-hoodie': {
    catalogProductId: 294,
    fileKey: 'classic',
    color: 'Black',
    sizes: { S: 9227, M: 9228, L: 9229, XL: 9230, '2XL': 9231 },
    note: 'Bella+Canvas 3719 pullover hoodie',
  },
  'fears-tee': {
    catalogProductId: 71,
    fileKey: 'classic',
    color: 'Black',
    sizes: { S: 4016, M: 4017, L: 4018, XL: 4019, '2XL': 4020, '3XL': 5295 },
    note: 'Bella+Canvas 3001 staple tee',
  },
  'fears-noir-hoodie': {
    catalogProductId: 892,
    fileKey: 'noir',
    color: 'Black',
    sizes: { S: 22958, M: 22960, L: 22962, XL: 22964, '2XL': 22966, '3XL': 22968 },
    note: 'Bella+Canvas 4719 oversized heavyweight hoodie — cream FEARS print on black',
  },
  'fears-noir-tee': {
    catalogProductId: 1592,
    fileKey: 'noir',
    color: 'Black',
    sizes: { S: 50106, M: 50086, L: 50117, XL: 50107, '2XL': 50079, '3XL': 50132 },
    note: 'Bella+Canvas 3010 oversized boxy tee — cream FEARS print on black',
  },
  'fears-ivory-crop': {
    catalogProductId: 317,
    fileKey: 'ivory',
    color: 'Storm',
    sizes: { S: 9648, M: 9649, L: 9650, XL: 9651, '2XL': 9652 },
    note: "Bella+Canvas 7502 women's cropped hoodie, Storm (light gray — no bone colorway in catalog)",
  },
  'fears-ivory-tee': {
    catalogProductId: 862,
    fileKey: 'ivory',
    color: 'Ivory',
    sizes: { S: 22585, M: 22590, L: 22595, XL: 22600, '2XL': 22605 },
    note: "Comfort Colors 3023CL women's heavyweight boxy tee, Ivory — black arched FEARS",
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
    const res = await fetch(`${PRINTFUL_API}/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
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