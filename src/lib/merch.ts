/**
 * Merch store data — products, pricing, bundles.
 *
 * Industry-standard pricing for an independent artist merch line:
 * - Exclusive Record Pack (full stems/trackouts, one owner per beat):
 *   exclusive rights start at $2,500 in our ToS licensing tiers — the FEARS
 *   record pack is priced at the industry-standard exclusive floor.
 * - Vinyl: standard 180g first pressing indie pricing $35-45.
 * - Apparel: indie music merch standard $35-55.
 */

export type MerchProduct = {
  id: string
  name: string
  category: 'vinyl' | 'apparel' | 'bundle' | 'digital' | 'collectible'
  price: number
  compareAt?: number
  description: string
  details: string[]
  image?: string
  stock?: number
  badge?: 'new' | 'limited' | 'bestseller' | 'collector'
  crossSellIds?: string[]
  upsellIds?: string[]
}

export const MERCH_PRODUCTS: MerchProduct[] = [
  // ── Flagship: the exclusive record pack ─────────────────────────────
  {
    id: 'fears-record-pack',
    name: 'FEARS Exclusive Record Pack',
    category: 'digital',
    price: 2500,
    compareAt: 3200,
    description:
      'The full stems, trackouts and session files for the entire FEARS album. One owner. When it is gone, it is gone.',
    details: [
      'Complete trackouts for all 8 tracks',
      'WAV stems, 24-bit / 44.1kHz',
      'Full DAW session files',
      'Exclusive rights — transferred to one buyer',
      'Hand-signed transfer agreement',
    ],
    badge: 'limited',
    crossSellIds: ['fears-vinyl', 'fears-hoodie'],
    upsellIds: ['fears-vault-bundle'],
  },

  // ── Vinyl ───────────────────────────────────────────────────────────
  {
    id: 'fears-vinyl',
    name: 'FEARS on Vinyl',
    category: 'vinyl',
    price: 45,
    compareAt: 55,
    description:
      'The debut album pressed to 180g vinyl. Hand-numbered. First pressing only.',
    details: [
      '180g heavyweight vinyl',
      'Hand-numbered sleeve',
      'First pressing of 300',
      'Includes digital download card',
    ],
    stock: 274,
    badge: 'limited',
    crossSellIds: ['fears-hoodie', 'fears-record-pack'],
    upsellIds: ['fears-vault-bundle'],
  },

  // ── Apparel ─────────────────────────────────────────────────────────
  {
    id: 'fears-hoodie',
    name: 'FEARS Hoodie',
    category: 'apparel',
    price: 55,
    compareAt: 70,
    description:
      'Heavyweight 12oz black cotton hoodie. FEARS front chest print, gold lightning bolt on sleeve.',
    details: [
      '12oz heavyweight cotton',
      'Screen-printed front chest logo',
      'Gold lightning bolt sleeve hit',
      'Unisex fit — size up for oversized look',
    ],
    stock: 142,
    badge: 'new',
    crossSellIds: ['fears-tee', 'fears-vinyl'],
    upsellIds: ['fears-vault-bundle'],
  },
  {
    id: 'fears-tee',
    name: 'FEARS T-Shirt',
    category: 'apparel',
    price: 35,
    compareAt: 45,
    description:
      'Heavyweight black cotton tee. FEARS italic wordmark on front, the narrative line across the shoulders.',
    details: [
      '6oz heavyweight cotton',
      'FEARS wordmark front print',
      'The narrative line across the back',
      'Unisex fit',
    ],
    stock: 200,
    badge: 'bestseller',
    crossSellIds: ['fears-hoodie', 'fears-vinyl'],
    upsellIds: ['fears-hoodie'],
  },

  // ── Collectibles ────────────────────────────────────────────────────
  {
    id: 'fears-poster',
    name: 'FEARS Album Art Print',
    category: 'collectible',
    price: 30,
    compareAt: 40,
    description:
      'The FEARS cover, printed on 18x24 matte stock. Gold foil accents. Numbered run of 100.',
    details: [
      '18x24 inch matte stock',
      'Gold foil accents',
      'Numbered run of 100',
      'Ships rolled in protective tube',
    ],
    stock: 87,
    badge: 'collector',
    crossSellIds: ['fears-vinyl', 'fears-tee'],
    upsellIds: ['fears-vault-bundle'],
  },
  {
    id: 'fears-cassette',
    name: 'FEARS Cassette',
    category: 'collectible',
    price: 25,
    description:
      'The album on metallic gold cassette. Lo-fi warmth for the ones who collect formats.',
    details: [
      'Metallic gold shell cassette',
      'Full album both sides',
      'Hand-numbered J-card',
      'Run of 100',
    ],
    stock: 66,
    badge: 'collector',
    crossSellIds: ['fears-poster', 'fears-vinyl'],
    upsellIds: ['fears-vault-bundle'],
  },

  // ── Bundles (up-sell targets) ───────────────────────────────────────
  {
    id: 'fears-vault-bundle',
    name: 'FEARS Vault Bundle',
    category: 'bundle',
    price: 149,
    compareAt: 195,
    description:
      'Vinyl, hoodie, tee, poster and cassette. The complete FEARS physical collection at once. Save $46.',
    details: [
      'FEARS 180g vinyl (hand-numbered)',
      'FEARS hoodie + tee',
      '18x24 gold foil art print',
      'Gold cassette',
      'Save $46 vs buying individually',
    ],
    stock: 50,
    badge: 'bestseller',
    crossSellIds: ['fears-tee', 'fears-poster'],
    upsellIds: ['fears-record-pack'],
  },
]

export function getMerchProduct(id: string): MerchProduct | undefined {
  return MERCH_PRODUCTS.find((p) => p.id === id)
}

export const MERCH_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'vinyl', label: 'Vinyl' },
  { id: 'apparel', label: 'Apparel' },
  { id: 'collectible', label: 'Collectibles' },
  { id: 'bundle', label: 'Bundles' },
  { id: 'digital', label: 'Digital' },
]