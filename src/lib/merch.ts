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
    image: '/images/merch/fears-record-pack.jpg',
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
    image: '/images/merch/fears-vinyl.jpg',
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
    image: '/images/merch/fears-hoodie.jpg',
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
    image: '/images/merch/fears-tee.jpg',
  },

  // ── High-fashion capsule: FEARS Noir (washed black, tonal) ─────────
  {
    id: 'fears-noir-hoodie',
    name: 'FEARS Noir Hoodie',
    category: 'apparel',
    price: 85,
    compareAt: 110,
    description:
      'Oversized washed-black heavyweight hoodie from the FEARS Noir capsule. Tonal gothic FEARS across the chest, gold bolt at the hem — high-fashion streetwear cut.',
    details: [
      '14oz heavyweight cotton, vintage wash',
      'Oversized boxy fit, drop shoulders',
      'Tonal gothic FEARS chest embroidery',
      'Gold bolt hit at the hem',
      'Unisex — true to size for oversized drape',
    ],
    stock: 80,
    badge: 'new',
    crossSellIds: ['fears-noir-tee', 'fears-ivory-crop'],
    upsellIds: ['fears-hoodie', 'fears-vault-bundle'],
    image: '/images/merch/fears-noir-hoodie.jpg',
  },
  {
    id: 'fears-noir-tee',
    name: 'FEARS Noir Tee',
    category: 'apparel',
    price: 55,
    compareAt: 70,
    description:
      'Vintage-wash black boxy tee from the FEARS Noir capsule. Tonal gothic FEARS on the front, gold bolt on the back neck.',
    details: [
      'Heavyweight garment-dye cotton',
      'Boxy oversized fit, straight hem',
      'Tonal gothic FEARS front hit',
      'Gold bolt back-neck print',
      'Unisex',
    ],
    stock: 120,
    badge: 'new',
    crossSellIds: ['fears-noir-hoodie', 'fears-ivory-tee'],
    upsellIds: ['fears-tee', 'fears-hoodie'],
    image: '/images/merch/fears-noir-tee.jpg',
  },

  // ── High-fashion capsule: FEARS Ivory (women's, bone) ──────────────
  {
    id: 'fears-ivory-crop',
    name: 'FEARS Ivory Cropped Hoodie',
    category: 'apparel',
    price: 75,
    compareAt: 95,
    description:
      'Bone-cream cropped hoodie from the FEARS Ivory capsule. Gothic FEARS arched over the chest in black, gold bolt at the hem — soft, boxy, cropped right.',
    details: [
      'Soft brushed cotton fleece',
      'Cropped boxy fit, wide ribbed trims',
      'Gothic FEARS arched chest print',
      'Gold bolt hit at the hem',
      "Women's fit",
    ],
    stock: 90,
    badge: 'new',
    crossSellIds: ['fears-ivory-tee', 'fears-noir-hoodie'],
    upsellIds: ['fears-ivory-tee', 'fears-vault-bundle'],
    image: '/images/merch/fears-ivory-crop.jpg',
  },
  {
    id: 'fears-ivory-tee',
    name: 'FEARS Ivory Tee',
    category: 'apparel',
    price: 45,
    compareAt: 60,
    description:
      'Bone-cream fitted tee from the FEARS Ivory capsule. Gothic FEARS arched across the chest, gold bolt at the hem. Soft everyday drape.',
    details: [
      'Soft combed cotton jersey',
      'Feminine slim drape',
      'Gothic FEARS arched chest print',
      'Gold bolt hem hit',
      "Women's fit",
    ],
    stock: 140,
    badge: 'new',
    crossSellIds: ['fears-ivory-crop', 'fears-noir-tee'],
    upsellIds: ['fears-ivory-crop', 'fears-tee'],
    image: '/images/merch/fears-ivory-tee.jpg',
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
    image: '/images/merch/fears-poster.jpg',
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
    image: '/images/merch/fears-cassette.jpg',
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
    image: '/images/merch/fears-vault-bundle.jpg',
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