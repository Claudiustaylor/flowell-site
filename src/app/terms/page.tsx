import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — FLOWELL',
  description: 'Terms of Service and Music Licensing Agreement for iamflowell.com',
}

export default function TermsOfService() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <p className="section-label">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">TERMS OF SERVICE</h1>
        <p className="text-sm text-white/30">Last updated: June 18, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="space-y-8 text-sm md:text-base text-white/60 leading-relaxed">

        {/* SECTION 1 — ACCEPTANCE */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
          <p>These Terms of Service, together with the Privacy Policy, Music License Agreement, and any additional terms disclosed during checkout (collectively, the "Agreement"), constitute a legally binding contract between you ("User," "Licensee," or "you") and Flowell ("Licensor," "we," "us," or "our") governing your access to and use of the website located at <a href="https://iamflowell.com" className="text-[#f1c40f] hover:underline">iamflowell.com</a> (the "Site") and all content, products, and services offered thereon (collectively, the "Services").</p>
          <p className="mt-3">BY ACCESSING, BROWSING, REGISTERING ON, OR OTHERWISE USING THE SITE OR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS AGREEMENT IN ITS ENTIRETY. IF YOU DO NOT AGREE, DO NOT ACCESS OR USE THE SITE OR SERVICES. IF YOU ARE ENTERING INTO THIS AGREEMENT ON BEHALF OF A BUSINESS ENTITY, YOU REPRESENT AND WARRANT THAT YOU HAVE THE AUTHORITY TO BIND THAT ENTITY.</p>
          <p className="mt-3">This Agreement is governed by the laws of the State of Maryland, United States, without regard to conflict-of-law principles. The producer operating Flowell is based in Maryland. Flowell is a registered trademark (USPTO Serial No. 97/492,523).</p>
        </div>

        {/* SECTION 2 — DEFINITIONS */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">2. Definitions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>"Beat"</strong> means a musical composition, instrumental track, sound recording, or audio work created by Flowell and made available for licensing through the Site.</li>
            <li><strong>"Pack"</strong> or <strong>"Producer Pack"</strong> means a collection of audio samples, loops, one-shots, MIDI files, project files, and/or presets sold as a digital bundle.</li>
            <li><strong>"License"</strong> means the limited, non-exclusive, revocable permission granted by Flowell to use a Beat or Pack under specific terms set forth in this Agreement and the applicable license tier.</li>
            <li><strong>"Non-Exclusive License"</strong> means a license that is not exclusive to you; Flowell may license the same Beat or Pack to other users.</li>
            <li><strong>"Exclusive Rights"</strong> means the transfer of all licensing rights in a Beat to a single Licensee, subject only to Flowell's retained ownership of the underlying composition for royalty purposes.</li>
            <li><strong>"Derivative Work"</strong> means a new work based on or derived from a Beat or Pack, including a song incorporating a Beat.</li>
            <li><strong>"Streaming"</strong> means distribution of audio content to end users via platforms including but not limited to Spotify, Apple Music, YouTube Music, Tidal, Amazon Music, Deezer, SoundCloud, Audiomack, and similar services.</li>
            <li><strong>"Monetized Content"</strong> means content that generates revenue, including ad-monetized YouTube videos, content ID claims, paid streaming distributions, and commercial releases.</li>
          </ul>
        </div>

        {/* SECTION 3 — MUSIC LICENSE AGREEMENT */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">3. Music License Agreement — Beat Licensing</h2>
          <p className="text-base font-bold text-white/80 mb-4">CRITICAL: The $49 purchase price on the Site grants a <em className="text-[#f1c40f]">Basic Non-Exclusive Lease License</em> only. This is NOT a transfer of ownership or copyright. Higher-tier licenses with expanded rights are available as described below. No license tier grants ownership of the underlying copyright.</p>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">3.1 License Tiers</h3>
          <p>The following license tiers are available. Each purchase is governed by the tier purchased. The default $49 purchase price on the Site corresponds to the Basic Lease tier. Expanded tiers may be purchased by contacting <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a>.</p>

          {/* TIER 1 — BASIC LEASE */}
          <div className="mt-6 p-5 border border-white/10 bg-white/[0.02]">
            <h4 className="text-lg font-bold text-[#f1c40f] mb-2">TIER 1 — BASIC LEASE ($49)</h4>
            <p className="text-sm mb-3">Non-exclusive lease license for one (1) Beat. Grants the following rights:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Distribution: Up to 5,000 combined digital streams across all platforms (Spotify, Apple Music, YouTube Music, etc.)</li>
              <li>Physical copies: Up to 500 units (CDs, vinyl, USB drives, etc.)</li>
              <li>Music videos: One (1) music video on YouTube or comparable platform (non-monetized, ad revenue not permitted)</li>
              <li>Performances: Up to 5 non-ticketed live performances</li>
              <li>Radio: Up to 2 independent radio stations (non-commercial)</li>
              <li>Deliverables: Untagged MP3 (320kbps) + Tagged preview</li>
              <li>License term: Two (2) years from date of purchase</li>
              <li>Derivative works permitted: Yes (one song using the Beat)</li>
              <li>Credit required: "Produced by Flowell"</li>
              <li>Exclusivity: Non-exclusive — Flowell retains the right to license the same Beat to others</li>
            </ul>
          </div>

          {/* TIER 2 — PREMIUM LEASE */}
          <div className="mt-4 p-5 border border-white/10 bg-white/[0.02]">
            <h4 className="text-lg font-bold text-[#f1c40f] mb-2">TIER 2 — PREMIUM LEASE ($149)</h4>
            <p className="text-sm mb-3">Extended non-exclusive lease license for one (1) Beat. Grants the following rights:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Distribution: Up to 50,000 combined digital streams</li>
              <li>Physical copies: Up to 2,500 units</li>
              <li>Music videos: Up to 3 music videos (monetized permitted with Content ID registration to Flowell)</li>
              <li>Performances: Up to 20 live performances (ticketed permitted)</li>
              <li>Radio: Up to 10 radio stations (commercial permitted)</li>
              <li>Deliverables: Untagged MP3 (320kbps) + Untagged WAV (24-bit) + Trackouts/Stems (up to 8 stems)</li>
              <li>License term: Five (5) years from date of purchase</li>
              <li>Derivative works permitted: Up to 3 songs using the Beat</li>
              <li>Credit required: "Produced by Flowell"</li>
              <li>Exclusivity: Non-exclusive</li>
            </ul>
          </div>

          {/* TIER 3 — UNLIMITED LEASE */}
          <div className="mt-4 p-5 border border-white/10 bg-white/[0.02]">
            <h4 className="text-lg font-bold text-[#f1c40f] mb-2">TIER 3 — UNLIMITED LEASE ($399)</h4>
            <p className="text-sm mb-3">Unlimited non-exclusive lease license for one (1) Beat. Grants the following rights:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Distribution: Unlimited digital streams across all platforms</li>
              <li>Physical copies: Unlimited units</li>
              <li>Music videos: Unlimited music videos (full monetization permitted)</li>
              <li>Performances: Unlimited live performances (including festivals and tours)</li>
              <li>Radio: Unlimited radio (commercial and non-commercial)</li>
              <li>Deliverables: Untagged MP3 (320kbps) + Untagged WAV (24-bit) + Trackouts/Stems (up to 16 stems) + MIDI file</li>
              <li>License term: Ten (10) years from date of purchase</li>
              <li>Derivative works permitted: Unlimited songs using the Beat</li>
              <li>Credit required: "Produced by Flowell"</li>
              <li>Exclusivity: Non-exclusive — Flowell may still license to others during the term</li>
            </ul>
          </div>

          {/* TIER 4 — EXCLUSIVE RIGHTS */}
          <div className="mt-4 p-5 border border-[#f1c40f]/30 bg-[#f1c40f]/[0.03]">
            <h4 className="text-lg font-bold text-[#f1c40f] mb-2">TIER 4 — EXCLUSIVE RIGHTS (Contact for Pricing)</h4>
            <p className="text-sm mb-3">Transfer of exclusive licensing rights for one (1) Beat. Contact <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a> to negotiate. Includes:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm">
              <li>Full exclusive rights to use, distribute, perform, and monetize the Beat in perpetuity</li>
              <li>Beat removed from sale on the Site and all third-party platforms</li>
              <li>All prior non-exclusive licenses remain valid until their term expires</li>
              <li>Deliverables: All available formats — Untagged MP3, WAV, Trackouts/Stems, MIDI, project files</li>
              <li>Derivative works: Unlimited</li>
              <li>Credit required: "Produced by Flowell"</li>
              <li>IMPORTANT: This is NOT a copyright assignment. Flowell retains ownership of the underlying musical composition for the purpose of collecting producer royalties, publishing splits, and PRO (ASCAP/BMI/SESAC) registration. The Licensee receives exclusive commercial rights but not ownership of the copyright itself.</li>
              <li>Exclusive pricing is per-Beat and negotiable. Minimum pricing starts at $2,500.</li>
            </ul>
          </div>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">3.2 General License Terms (All Tiers)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Ownership:</strong> Flowell retains 100% ownership of all copyrights, including the underlying musical composition, the sound recording, and any derivative master. No license tier transfers copyright ownership.</li>
            <li><strong>Registration:</strong> Flowell reserves the right to register Beats with Content ID systems, Performing Rights Organizations (PROs), and similar rights management services. Content ID claims on YouTube are permitted under Basic Lease (ad revenue directed to Flowell) and permitted to Licensee under Premium and higher tiers.</li>
            <li><strong>Prohibited Uses:</strong> You may NOT (a) resell, sublicense, or redistribute the Beat as a standalone product; (b) claim the Beat as your own original composition; (c) use the Beat in any content that promotes hate speech, violence, illegal activity, or sexual exploitation; (d) use the Beat for AI training, machine learning model input, or derivative AI-generated content without express written permission; (e) register the Beat with any Content ID or fingerprinting system as the rights holder.</li>
            <li><strong>Credit:</strong> All tiers require visible credit as "Produced by Flowell" on all distributions, video descriptions, liner notes, and metadata where space reasonably permits.</li>
            <li><strong>Revocation:</strong> Flowell may revoke any non-exclusive license for material breach of these terms, including exceeding usage caps, prohibited uses, or failure to provide credit. Upon revocation, all distribution must cease within thirty (30) days.</li>
            <li><strong>Refunds:</strong> Due to the digital nature of the products, all sales are final. Refunds are issued only for: (a) duplicate charges, (b) files that are corrupted and cannot be replaced within 72 hours of notification, or (c) where required by applicable consumer protection law.</li>
          </ul>
        </div>

        {/* SECTION 4 — PRODUCER PACKS */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">4. Producer Pack Licensing</h2>
          <p>Producer Packs (sample packs, loop kits, one-shot kits, MIDI kits, project file bundles) are licensed differently from Beats:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Non-Exclusive, Royalty-Free:</strong> Pack contents are licensed for use in your own original musical productions on a royalty-free, non-exclusive basis. You may use the sounds, loops, and one-shots in songs you create without additional payment to Flowell.</li>
            <li><strong>Re-distribution Prohibited:</strong> You may NOT resell, redistribute, repackage, or share the Pack or its individual contents as standalone samples, loops, or sounds. The Pack must be used as components within your own original compositions.</li>
            <li><strong>One (1) License Per Purchase:</strong> Each Pack purchase grants a license to one (1) individual or entity. Team or studio sharing requires additional licenses.</li>
            <li><strong>AI Training Prohibited:</strong> Pack contents may NOT be used to train, fine-tune, or provide input to any AI/ML model, generative audio system, or similar technology without express written permission from Flowell.</li>
            <li><strong>MIDI Files:</strong> MIDI files included in Packs may be used royalty-free in your original productions but may not be resold or redistributed as standalone MIDI files.</li>
            <li><strong>Project Files:</strong> DAW project files are provided for educational and reference purposes. You may study and adapt techniques but may not redistribute the project files or claim them as your own.</li>
            <li><strong>Flowell Club:</strong> The Flowell Club membership ($50 one-time payment) grants community access, monthly pack deliveries, and live session participation. Club content is governed by the same Pack licensing terms above. Membership may be terminated by Flowell for abuse, sharing, or violation of terms without refund.</li>
          </ul>
        </div>

        {/* SECTION 5 — SERVICES */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">5. Production Services — Mixing and Mastering</h2>
          <p>Flowell offers mixing and mastering services at the following price ranges:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Mixing:</strong> $150–$300 per track</li>
            <li><strong>Mastering:</strong> $75–$150 per track</li>
            <li><strong>Mixing & Mastering Package:</strong> $200–$450 per track</li>
          </ul>
          <p className="mt-3">All service engagements are governed by a separate service agreement to be agreed before work commences. The general terms below apply:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Payment:</strong> 50% deposit required before work begins. Balance due upon delivery of the final product. Files are released after full payment is received.</li>
            <li><strong>Revisions:</strong> Up to three (3) revision rounds are included. Additional revisions are billed at $50 per round.</li>
            <li><strong>Source Material:</strong> You must provide properly labeled, organized stems or session files. Flowell is not responsible for issues arising from poorly prepared source material.</li>
            <li><strong>Turnaround:</strong> Typically 5–10 business days per track, not guaranteed. Rush service available at 1.5x pricing.</li>
            <li><strong>Ownership:</strong> The mixed/mastered track remains your property. Flowell retains the right to reference the work in a portfolio unless otherwise agreed in writing.</li>
          </ul>
        </div>

        {/* SECTION 6 — INTELLECTUAL PROPERTY */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">6. Intellectual Property and Trademark</h2>
          <p>Flowell is a registered trademark (USPTO Serial No. 97/492,523). All content on the Site — including but not limited to Beats, Packs, compositions, sound recordings, cover art, logos, typography, code, page designs, and text — is the exclusive intellectual property of Flowell and is protected under U.S. Copyright Act (17 U.S.C. §101 et seq.), the Lanham Act (15 U.S.C. §1051 et seq.), the Digital Millennium Copyright Act ("DMCA"), the Berne Convention, and all applicable international intellectual property treaties and conventions.</p>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">6.1 Copyright Enforcement</h3>
          <p>Unauthorized use, reproduction, distribution, public performance, streaming, synchronization, or derivative use of any Flowell Beat, Pack, or content without a valid license is copyright infringement. Flowell actively monitors for infringement through Content ID, manual searches, and third-party monitoring services. Infringement will be pursued through:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>DMCA Takedown Notices:</strong> Issued to hosting providers, platforms (YouTube, Spotify, SoundCloud, Instagram, TikTok, etc.), ISPs, and search engines.</li>
            <li><strong>Content ID Claims:</strong> All Beats are eligible for YouTube Content ID registration. Unauthorized usage will result in ad revenue diversion to Flowell.</li>
            <li><strong>Civil Litigation:</strong> Infringement claims may be filed in state or federal court seeking statutory damages of up to $150,000 per work under 17 U.S.C. §504(c), attorney's fees, and injunctive relief.</li>
            <li><strong>Criminal Referral:</strong> Willful infringement for commercial advantage may be referred to the U.S. Department of Justice under 17 U.S.C. §506 and 18 U.S.C. §2319.</li>
          </ul>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">6.2 DMCA Notice</h3>
          <p>If you believe that content on the Site infringes your copyright, submit a DMCA takedown notice to <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a> with the subject line "DMCA Takedown Notice." The notice must include:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Identification of the copyrighted work claimed to be infringed</li>
            <li>Identification of the allegedly infringing material and its location on the Site</li>
            <li>Your contact information (name, address, email, phone)</li>
            <li>A statement that you have a good-faith belief that the use is not authorized</li>
            <li>A statement, under penalty of perjury, that you are the copyright owner or authorized to act</li>
            <li>Your physical or electronic signature</li>
          </ul>
          <p className="mt-3">Counter-notification procedures are available under 17 U.S.C. §512(g). Repeat infringers will be permanently banned from the Site.</p>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">6.3 Trademark Enforcement</h3>
          <p>Unauthorized use of the Flowell name, logo, lightning bolt mark, or any confusingly similar mark in connection with music production, beat sales, or related services constitutes trademark infringement under the Lanham Act. Flowell will pursue injunctions, treble damages, and attorney's fees against infringers.</p>
        </div>

        {/* SECTION 7 — USER CONDUCT */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">7. Acceptable Use Policy</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Use the Site in any manner that violates applicable local, state, national, or international law</li>
            <li>Attempt to gain unauthorized access to any portion of the Site, server, or network</li>
            <li>Scrape, crawl, or automatically extract data, audio files, or content from the Site</li>
            <li>Reverse engineer, decompile, or disassemble any portion of the Site or its code</li>
            <li>Introduce viruses, malware, or any malicious code to the Site</li>
            <li>Use the Site to transmit spam, unsolicited communications, or promotional material without consent</li>
            <li>Impersonate Flowell, any producer, or any other person or entity</li>
            <li>Share, transfer, or sub-license your account or purchased content to third parties</li>
            <li>Use purchased Beats or Pack content for AI/ML training without express written permission</li>
            <li>Register Beats with Content ID or any fingerprinting system as the rights holder</li>
            <li>Remove, alter, or obscure copyright notices, watermarks, or tags on audio files</li>
          </ul>
        </div>

        {/* SECTION 8 — PAYMENTS */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">8. Payment Terms</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Processor:</strong> All payments are processed by Stripe, Inc. We do not store your payment card information.</li>
            <li><strong>Currency:</strong> All prices are in U.S. Dollars (USD).</li>
            <li><strong>Digital Products:</strong> Beats and Packs are delivered as digital downloads immediately upon successful payment. Due to their digital nature, all sales are final unless explicitly stated otherwise in this Agreement.</li>
            <li><strong>Services:</strong> Mixing/mastering services require a 50% deposit. The balance is due before final file delivery.</li>
            <li><strong>Taxes:</strong> Prices do not include applicable taxes. You are responsible for any sales tax, VAT, GST, or similar taxes applicable to your purchase. Where required by law, taxes will be collected at checkout.</li>
            <li><strong>Chargebacks:</strong> Filing a chargeback without first contacting Flowell to resolve the issue is a breach of this Agreement. We reserve the right to dispute chargebacks, revoke licenses, and pursue collection of the original amount plus applicable fees.</li>
          </ul>
        </div>

        {/* SECTION 9 — DISCLAIMERS */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">9. Disclaimers</h2>
          <p>THE SITE AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. FLOWELL DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND TITLE. FLOWELL DOES NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR THAT PURCHASED FILES WILL BE COMPATIBLE WITH YOUR EQUIPMENT.</p>
          <p className="mt-3">Audio previews on the Site are compressed for streaming and may not represent the full quality of the delivered files. Deliverable file formats and quality are specified in the applicable license tier.</p>
        </div>

        {/* SECTION 10 — LIMITATION OF LIABILITY */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">10. Limitation of Liability</h2>
          <p>TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL FLOWELL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE OR SERVICES, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STATUTE, OR OTHERWISE, EVEN IF FLOWELL HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
          <p className="mt-3">FLOWELL'S TOTAL CUMULATIVE LIABILITY FOR ALL CLAIMS ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT ACTUALLY PAID BY YOU TO FLOWELL IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR (B) FIFTY U.S. DOLLARS ($50.00).</p>
          <p className="mt-3">Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you to the extent prohibited by law.</p>
        </div>

        {/* SECTION 11 — INDEMNIFICATION */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">11. Indemnification</h2>
          <p>YOU AGREE TO INDEMNIFY, DEFEND, AND HOLD HARMLESS FLOWELL AND ITS PRODUCERS, AFFILIATES, AGENTS, AND SERVICE PROVIDERS FROM AND AGAINST ANY AND ALL CLAIMS, DAMAGES, LOSSES, LIABILITIES, COSTS, AND EXPENSES (INCLUDING REASONABLE ATTORNEY'S FEES) ARISING OUT OF OR RELATING TO:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Your use of the Site or Services;</li>
            <li>Your violation of this Agreement;</li>
            <li>Your violation of any third-party rights, including intellectual property rights;</li>
            <li>Content you create using Flowell Beats or Packs, including any claim that such content infringes the rights of a third party;</li>
            <li>Your breach of the license terms applicable to your purchase, including exceeding usage caps or engaging in prohibited uses;</li>
            <li>Any fraudulent, negligent, or wrongful act by you.</li>
          </ul>
          <p className="mt-3">Flowell reserves the right to assume the exclusive defense of any claim for which we are entitled to indemnification, at your expense. You may not settle any claim without our prior written consent.</p>
        </div>

        {/* SECTION 12 — ARBITRATION */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">12. Dispute Resolution and Arbitration</h2>
          <h3 className="text-base font-bold text-white/80 mt-4 mb-2">12.1 Binding Arbitration</h3>
          <p>EXCEPT FOR CLAIMS THAT MAY BE PROPERLY RESOLVED IN SMALL CLAIMS COURT, ANY DISPUTE, CLAIM, OR CONTROVERSY ARISING OUT OF OR RELATING TO THIS AGREEMENT, THE SITE, OR THE SERVICES, INCLUDING THE SCOPE, ENFORCEABILITY, OR INTERPRETATION OF THIS ARBITRATION CLAUSE, SHALL BE RESOLVED BY FINAL AND BINDING ARBITRATION IN THE STATE OF MARYLAND, ADMINISTERED BY THE AMERICAN ARBITRATION ASSOCIATION ("AAA") UNDER ITS COMMERCIAL ARBITRATION RULES THEN IN EFFECT. THE ARBITRATOR'S AWARD SHALL BE FINAL AND JUDGMENT MAY BE ENTERED IN ANY COURT OF COMPETENT JURISDICTION.</p>

          <h3 className="text-base font-bold text-white/80 mt-4 mb-2">12.2 Class Action Waiver</h3>
          <p>YOU AND FLOWELL AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, REPRESENTATIVE, OR PRIVATE ATTORNEY GENERAL ACTION. THE ARBITRATOR MAY NOT CONSOLIDATE OR JOIN MORE THAN ONE PERSON'S OR PARTY'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A CONSOLIDATED, REPRESENTATIVE, OR CLASS PROCEEDING.</p>

          <h3 className="text-base font-bold text-white/80 mt-4 mb-2">12.3 Exception — Intellectual Property Enforcement</h3>
          <p>Notwithstanding the arbitration provision above, Flowell may bring claims for intellectual property infringement (including copyright, trademark, and DMCA violations) in any court of competent jurisdiction, including the U.S. District Court for the District of Maryland or any state court in Maryland, and seek injunctive relief, damages, and attorney's fees without first submitting to arbitration. This exception is necessary to protect time-sensitive intellectual property rights.</p>

          <h3 className="text-base font-bold text-white/80 mt-4 mb-2">12.4 Pre-Dispute Negotiation</h3>
          <p>Before filing arbitration, the parties shall attempt in good faith to resolve the dispute within thirty (30) days of written notice. If unresolved, either party may proceed to arbitration.</p>
        </div>

        {/* SECTION 13 — GOVERNING LAW */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">13. Governing Law and Venue</h2>
          <p>This Agreement is governed by the laws of the State of Maryland, United States, without regard to its conflict-of-law provisions. For matters not subject to arbitration, the exclusive venue for any action shall be the state or federal courts located in the State of Maryland. You consent to personal jurisdiction in Maryland.</p>
          <p className="mt-3">For international users, the United Nations Convention on Contracts for the International Sale of Goods (CISG) is expressly excluded. The Berne Convention for the Protection of Literary and Artistic Works, the WIPO Copyright Treaty, and all applicable bilateral and multilateral intellectual property treaties apply to the licensing of Beats and Packs.</p>
        </div>

        {/* SECTION 14 — TERMINATION */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">14. Termination</h2>
          <p>Flowell may suspend or terminate your access to the Site and Services, and revoke any licenses, at any time for cause, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Violation of this Agreement or any license terms</li>
            <li>Fraudulent activity or chargeback abuse</li>
            <li>Copyright or trademark infringement (yours or against Flowell)</li>
            <li>Unauthorized sharing, reselling, or redistribution of purchased content</li>
            <li>Any activity that exposes Flowell to legal liability</li>
          </ul>
          <p className="mt-3">Upon termination for cause, all licenses granted to you shall immediately cease, and you must destroy all copies of purchased content within thirty (30) days. Sections 6 (Intellectual Property), 9 (Disclaimers), 10 (Limitation of Liability), 11 (Indemnification), and 12 (Dispute Resolution) shall survive termination.</p>
        </div>

        {/* SECTION 15 — MODIFICATIONS */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">15. Modifications to This Agreement</h2>
          <p>Flowell reserves the right to modify this Agreement at any time. Material changes will be posted on the Site with an updated "Last updated" date. For existing license holders, the license terms in effect at the time of purchase remain binding for the duration of that license term. Continued use of the Site after changes constitutes acceptance of the revised Agreement for future transactions.</p>
        </div>

        {/* SECTION 16 — ASSIGNMENT */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">16. Assignment</h2>
          <p>You may not assign or transfer this Agreement or any rights hereunder without Flowell's prior written consent. Flowell may assign this Agreement in connection with a merger, acquisition, or sale of assets. Any attempted assignment in violation of this Section is void.</p>
        </div>

        {/* SECTION 17 — SEVERABILITY */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">17. Severability</h2>
          <p>If any provision of this Agreement is held to be invalid, illegal, or unenforceable by a court or arbitrator of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if modification is not possible, severed from this Agreement. The remaining provisions shall continue in full force and effect.</p>
        </div>

        {/* SECTION 18 — ENTIRE AGREEMENT */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">18. Entire Agreement</h2>
          <p>This Agreement, together with the Privacy Policy and any license terms presented at checkout, constitutes the entire agreement between you and Flowell regarding the Site and Services and supersedes all prior agreements, representations, and understandings, whether written or oral. No waiver of any provision shall be deemed a continuing waiver.</p>
        </div>

        {/* SECTION 19 — ELECTRONIC SIGNATURE */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">19. Electronic Signature and Consent</h2>
          <p>By completing a purchase on the Site or by using the Services, you acknowledge that you are providing an electronic signature that has the same legal force and effect as a handwritten signature. You consent to receive all communications regarding this Agreement, your license, and your purchases electronically, including via email.</p>
        </div>

        {/* SECTION 20 — CONTACT */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">20. Contact and Legal Notices</h2>
          <p>For any questions, legal notices, or licensing inquiries, contact:</p>
          <div className="mt-3 p-4 border border-white/10 bg-white/[0.02]">
            <p className="font-bold text-white">Flowell</p>
            <p>Email: <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a></p>
            <p>Location: State of Maryland, United States</p>
            <p>Trademark: USPTO Serial No. 97/492,523</p>
          </div>
          <p className="mt-3">For DMCA notices, use subject line "DMCA Takedown Notice." For IP enforcement matters, use "Legal — IP Enforcement." For licensing inquiries including exclusive rights, use "Licensing Inquiry."</p>
        </div>

        </div>
      </div>
    </div>
  )
}