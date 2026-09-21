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
  catalogProductIds: number[] // Printful catalog product families
  fileKey: keyof typeof PRINT_FILES
  color: string // Printful color name
  sizes: Record<string, number> // merch size → catalog_variant_id
  note?: string
}

export const PRINTFUL_MAP: Record<string, PrintfulMap> = {
  'fears-hoodie': {
    catalogProductIds: [294],
    fileKey: 'classic',
    color: 'Black',
    sizes: { S: 9218, M: 9219, L: 9220, XL: 9221, '2XL': 9222, '3XL': 9223 },
    note: 'Bella+Canvas 3719 heavyweight pullover hoodie',
  },
  'fears-tee': {
    catalogProductIds: [71],
    fileKey: 'classic',
    color: 'Black',
    sizes: { S: 9575, M: 9576, L: 9577, XL: 9578, '2XL': 9579 },
    note: 'Bella+Canvas 3001 tee',
  },
  'fears-noir-hoodie': {
    catalogProductIds: [294],
    fileKey: 'noir',
    color: 'Black',
    sizes: { S: 9218, M: 9219, L: 9220, XL: 9221, '2XL': 9222, '3XL': 9223 },
    note: 'Bella+Canvas 3719 — cream FEARS print on washed black',
  },
  'fears-noir-tee': {
    catalogProductIds: [71],
    fileKey: 'noir',
    color: 'Black',
    sizes: { S: 9575, M: 9576, L: 9577, XL: 9578, '2XL': 9579 },
    note: 'Bella+Canvas 3001 — cream FEARS print on faded black',
  },
  'fears-ivory-crop': {
    catalogProductIds: [294],
    fileKey: 'ivory',
    color: 'White',
    sizes: { S: 9210, M: 9211, L: 9212, XL: 9213, '2XL': 9214 },
    note: 'Bella+Canvas 3719 white — black arched FEARS print (cropped styling is cut/sew, POD closest match)',
  },
  'fears-ivory-tee': {
    catalogProductIds: [71],
    fileKey: 'ivory',
    color: 'White',
    sizes: { S: 9570, M: 9571, L: 9572, XL: 9573, '2XL': 9574 },
    note: 'Bella+Canvas 3001 white — black arched FEARS (fitted styling)',
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