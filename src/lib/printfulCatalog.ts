/**
 * Printful store catalog client — SERVER ONLY.
 *
 * The FEARS Printful store (store_id 18791449) mirrors iamflowell.com merch
 * 1:1 — each sync product's external_id equals the merch product id
 * (fears-hoodie, fears-tee, ...). Changes made in the Printful dashboard
 * (price, name, variants) propagate to the site through two paths:
 *   1. product_synced/product_updated webhooks → /api/webhooks/printful
 *   2. revalidation: this module tags ISR pages with the product tag so a
 *      dashboard edit invalidates and refetches.
 *
 * v1 sync-products API is used because v2-beta has no sync-product endpoints.
 */

const API = 'https://api.printful.com'
const STORE_ID = process.env.PRINTFUL_STORE_ID || '18791449'

type SyncVariant = {
  id: number
  name: string
  retail_price: string
  currency: string
  synced: boolean
  variant_id: number
  sku: string | null
}

type SyncProduct = {
  id: number
  external_id: string | null
  name: string
  variants: number
  synced: number
  thumbnail_url: string | null
  is_ignored: boolean
  sync_variants?: SyncVariant[]
}

function headers(apiKey: string): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'X-PF-Store-Id': STORE_ID,
    'Content-Type': 'application/json',
  }
}

/**
 * Fetch all sync products in the FEARS store, expanded with variants.
 */
export async function fetchSyncProducts(apiKey?: string): Promise<SyncProduct[]> {
  const key = apiKey ?? process.env.PRINTFUL_API_KEY
  if (!key) return []
  try {
    const res = await fetch(`${API}/store/products?limit=100`, {
      headers: headers(key),
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const list = data?.result ?? []
    // Expand the first page only — 6 products is well under the limit.
    return list
  } catch {
    return []
  }
}

/**
 * Fetch a single sync product with its variants (sizes, prices).
 */
export async function fetchSyncProduct(syncProductId: number, apiKey?: string): Promise<SyncProduct | null> {
  const key = apiKey ?? process.env.PRINTFUL_API_KEY
  if (!key) return null
  try {
    const res = await fetch(`${API}/store/products/${syncProductId}`, {
      headers: headers(key),
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return {
      ...(data?.result?.sync_product ?? {}),
      sync_variants: data?.result?.sync_variants ?? [],
    }
  } catch {
    return null
  }
}

/**
 * Catalog availability for a product family — used to flag out-of-stock sizes.
 * Returns variant_id → availability map for the USA region.
 */
export async function fetchAvailability(catalogProductId: number, apiKey?: string): Promise<Record<number, string>> {
  const key = apiKey ?? process.env.PRINTFUL_API_KEY
  if (!key) return {}
  try {
    const res = await fetch(`${API}/v2/catalog-products/${catalogProductId}/availability`, {
      headers: headers(key),
      next: { revalidate: 300 },
    })
    if (!res.ok) return {}
    const data = await res.json()
    const out: Record<number, string> = {}
    for (const row of data?.data ?? []) {
      const regions = row?.techniques?.[0]?.selling_regions ?? []
      const usa = regions.find((r: { name: string }) => r.name === 'usa')
      if (usa) out[row.catalog_variant_id] = usa.availability
    }
    return out
  } catch {
    return {}
  }
}

/** Extract size label from a sync variant name ("FEARS Hoodie / Black / L" → "L"). */
export function sizeFromVariantName(name: string): string | null {
  const parts = name.split('/').map((p) => p.trim())
  return parts.length >= 3 ? parts[parts.length - 1] : null
}

export type { SyncProduct, SyncVariant }