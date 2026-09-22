/**
 * Live merch data — merges merch.ts with the Printful store catalog.
 * Public GET; contains no secrets (prices, names, sizes only).
 */

import { NextResponse } from 'next/server'
import { getLiveMerchProducts } from '@/lib/liveMerch'

export const revalidate = 60

export async function GET() {
  const products = await getLiveMerchProducts()
  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.livePrice ?? p.price,
      compareAt: p.compareAt,
      stock: p.stock,
      availableSizes: p.availableSizes ?? [],
      outOfStockSizes: p.outOfStockSizes ?? [],
    })),
    source: 'printful+merch',
  })
}