/**
 * Server-side enrichment of merch products with live Printful store data.
 *
 * Design contract: merch.ts owns ALL copy, images and layout data. Printful
 * only overrides prices, product names and size availability — so a Printful
 * dashboard change is universal (prices/names/stock) but the site's design,
 * copy and imagery are never thrown off by Printful's defaults.
 *
 * Mapping: merch product id === Printful sync product external_id.
 */

import { MERCH_PRODUCTS, type MerchProduct } from './merch'
import { fetchSyncProducts, fetchSyncProduct, sizeFromVariantName, type SyncProduct } from './printfulCatalog'

export type LiveMerchProduct = MerchProduct & {
  /** Live Printful retail price (USD) — overrides merch.ts when present. */
  livePrice?: number
  /** Sizes Printful currently lists for this product. */
  availableSizes?: string[]
  /** Size labels Printful reports out of stock for. */
  outOfStockSizes?: string[]
}

/** Catalog product family per merch id (for availability checks). */
const CATALOG_FAMILY: Record<string, number> = {
  'fears-hoodie': 294,
  'fears-tee': 71,
  'fears-noir-hoodie': 892,
  'fears-noir-tee': 1592,
  'fears-ivory-crop': 317,
  'fears-ivory-tee': 862,
}

/**
 * Merge merch.ts products with their Printful sync counterparts.
 * Server-side only; safe when PRINTFUL_API_KEY is unset (returns base data).
 */
export async function getLiveMerchProducts(): Promise<LiveMerchProduct[]> {
  const syncs = await fetchSyncProducts()
  if (syncs.length === 0) return MERCH_PRODUCTS

  const byExternal = new Map<string, SyncProduct>()
  for (const s of syncs) {
    if (s.external_id) byExternal.set(s.external_id, s)
  }

  const out: LiveMerchProduct[] = []
  for (const p of MERCH_PRODUCTS) {
    const summary = byExternal.get(p.id)
    if (!summary) {
      out.push(p)
      continue
    }

    // The list endpoint doesn't expand variants — fetch the full product.
    const sync = (await fetchSyncProduct(summary.id)) ?? summary
    const variants = sync.sync_variants ?? []
    if (variants.length === 0) {
      out.push({ ...p, name: sync.name || p.name })
      continue
    }

    const livePrice = parsePrice(variants[0].retail_price)
    const availableSizes = variants
      .map((v) => sizeFromVariantName(v.name))
      .filter(Boolean) as string[]

    // Out-of-stock: variant exists but is unsynced/disabled
    const outOfStockSizes = variants
      .filter((v) => !v.synced)
      .map((v) => sizeFromVariantName(v.name))
      .filter(Boolean) as string[]

    out.push({
      ...p,
      livePrice: livePrice !== null ? livePrice : p.price,
      name: sync.name || p.name, // dashboard renames propagate
      availableSizes,
      outOfStockSizes,
    })
  }
  return out
}

function parsePrice(s: string): number | null {
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

export { CATALOG_FAMILY }