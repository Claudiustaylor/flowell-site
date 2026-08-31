"use client";

import { Zap, ShoppingBag, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const licenseTiers = [
  {
    name: "MP3 Lease",
    price: "$30",
    features: [
      "Untagged MP3",
      "Up to 10,000 streams",
      "Non-exclusive license",
      "No commercial use",
    ],
    cta: "Buy via Stripe",
    ctaLink: "https://buy.stripe.com/00w7sK23Dfbp4o58pRgA805",
    featured: false,
  },
  {
    name: "WAV Premium",
    price: "$75",
    features: [
      "WAV + MP3 files",
      "Up to 100,000 streams",
      "Non-exclusive license",
      "Commercial use allowed",
    ],
    cta: "Buy via Stripe",
    ctaLink: "https://buy.stripe.com/5kQ00i9w56ET4o521tgA806",
    featured: false,
  },
  {
    name: "STEM Premium",
    price: "$150",
    features: [
      "Stems + WAV + MP3",
      "Unlimited streams",
      "Non-exclusive license",
      "Full commercial rights",
    ],
    cta: "Buy via Stripe",
    ctaLink: "https://buy.stripe.com/3cIeVcbEdfbpaMt9tVgA807",
    featured: true,
  },
  {
    name: "Exclusive",
    price: "$500+",
    features: [
      "Full ownership transfer",
      "Track removed from store",
      "Unlimited usage rights",
      "Contact for custom pricing",
    ],
    cta: "Contact for Price",
    ctaLink: "/contact",
    featured: false,
  },
];

const products = [
  {
    name: "Flowell Mini Pack Vol. 1",
    price: "$19",
    desc: "25 loops + 25 one-shots + 10 MIDI. Perfect for testing the sound.",
    link: "https://buy.stripe.com/00wdR8cIhe7lg6NgWngA802",
    featured: false,
  },
  {
    name: "Flowell Signature Kit",
    price: "$49",
    desc: "100 one-shots + 60 loops + 20 presets + 5 project files. The full arsenal.",
    link: "https://buy.stripe.com/bJe9AS6jT7IX4o59tVgA803",
    featured: true,
  },
  {
    name: "Flowell Club",
    price: "$50",
    desc: "One-time community access. Monthly pack + cook-up sessions + project files + Discord.",
    link: "https://buy.stripe.com/dRm9AS6jT5APdYF35xgA804",
    featured: false,
  },
];

export default function ShopPage() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <div className="section-label">Store</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop</h1>
        <p className="text-white/70 max-w-lg mx-auto">
          Lease beats, buy packs, and join the club. All purchases support
          independent production.
        </p>
      </div>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Zap className="w-5 h-5 text-flowell-yellow" />
          Producer Packs
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-lg border transition-all duration-300 ${
                product.featured
                  ? "border-flowell-yellow bg-flowell-yellow/5"
                  : "border-white/10 bg-flowell-dark hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium tracking-wider uppercase text-flowell-yellow">
                  {product.featured ? "Best Seller" : "Digital Product"}
                </div>
                {product.featured && <Zap className="w-4 h-4 text-flowell-yellow" />}
              </div>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <div className="text-2xl font-bold text-flowell-yellow mb-4">
                {product.price}
              </div>
              <p className="text-sm text-white/70 mb-6">{product.desc}</p>
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  product.featured ? "btn-primary w-full" : "btn-secondary w-full"
                }
              >
                <ShoppingBag className="w-4 h-4" />
                Get It Now
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Zap className="w-5 h-5 text-flowell-yellow" />
          Beat Licensing
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {licenseTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-lg border transition-all duration-300 ${
                tier.featured
                  ? "border-flowell-yellow bg-flowell-yellow/5"
                  : "border-white/10 bg-flowell-dark hover:border-white/20"
              }`}
            >
              <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold text-flowell-yellow mb-6">
                {tier.price}
                <span className="text-sm text-white/60 font-normal"> USD</span>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                    <Zap className="w-3 h-3 text-flowell-yellow mt-1 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaLink}
                target={tier.ctaLink.startsWith("http") ? "_blank" : undefined}
                rel={tier.ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                className={
                  tier.featured ? "btn-primary w-full" : "btn-secondary w-full"
                }
              >
                {tier.ctaLink.startsWith("http") && (
                  <ExternalLink className="w-4 h-4" />
                )}
                {tier.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Browse More Beats CTA */}
      <section className="mb-20">
        <div className="relative overflow-hidden rounded-lg border border-[#f1c40f]/30 bg-gradient-to-r from-[#f1c40f]/10 via-black to-black p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(241,196,15,0.06)_0%,_transparent_70%)]" />
          <div className="relative">
            <Zap className="w-10 h-10 text-[#f1c40f] mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-black italic tracking-tighter mb-4">
              BROWSE MORE BEATS
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Stream every beat, lease instantly, and download your files in seconds.
            </p>
            <a
              href="https://traktrain.com/flowellbeats"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <ExternalLink className="w-4 h-4" />
              Explore Full Catalog
            </a>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Zap className="w-5 h-5 text-flowell-yellow" />
          Production Services
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              service: "Mixing",
              price: "$150 – $300",
              desc: "Professional mix per track. Balanced levels, EQ, compression, and spatial processing. Stems delivery. 2 revision rounds.",
            },
            {
              service: "Mastering",
              price: "$75 – $150",
              desc: "Final polish per track. Loudness optimization, stereo widening, and format delivery for all platforms. 2 revision rounds.",
            },
            {
              service: "Mixing & Mastering",
              price: "$200 – $450",
              desc: "Full mix and master package. From raw stems to release-ready. Includes all formats + unlimited revisions within scope.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.service}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-lg border border-white/10 bg-flowell-dark hover:border-flowell-yellow/30 transition-all"
            >
              <h3 className="text-lg font-bold mb-1">{s.service}</h3>
              <div className="text-flowell-yellow font-bold mb-4">{s.price}</div>
              <p className="text-sm text-white/70 mb-6">{s.desc}</p>
              <a href="/contact" className="btn-secondary w-full text-sm">
                Book Now
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
