import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — FLOWELL',
  description: 'Privacy Policy for iamflowell.com',
}

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 pb-24 px-6 max-w-4xl mx-auto">
      <div className="mb-12">
        <p className="section-label">Legal</p>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">PRIVACY POLICY</h1>
        <p className="text-sm text-white/55">Last updated: June 18, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none">
        <div className="space-y-8 text-sm md:text-base text-white/60 leading-relaxed">

        <div>
          <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
          <p>This Privacy Policy governs the collection, use, disclosure, and protection of personal information and non-personal data collected by Flowell ("Flowell," "we," "us," or "our") through our website located at <a href="https://iamflowell.com" className="text-[#f1c40f] hover:underline">iamflowell.com</a> (the "Site") and the services offered thereon (collectively, the "Services"). Flowell is operated by an independent producer based in the State of Maryland, United States.</p>
          <p className="mt-3">By accessing, browsing, or using the Site or Services, you expressly consent to the data practices described in this Privacy Policy. If you do not agree with this Policy, you must not access or use the Site or Services.</p>
          <p className="mt-3">This Policy is designed to comply with all applicable United States federal and state privacy laws, including but not limited to the California Consumer Privacy Act ("CCPA"), as amended by the California Privacy Rights Act ("CPRA"), the Children's Online Privacy Protection Act ("COPPA"), and all state-level consumer privacy statutes. It is also structured to align with the European Union General Data Protection Regulation ("GDPR") (Regulation 2016/679) and the United Kingdom Data Protection Act 2018 for international visitors.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">2.1 Information You Provide Directly</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Contact Information:</strong> Name, email address, and any message content you submit through our contact forms or direct email to <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a>.</li>
            <li><strong>Purchase Information:</strong> When you purchase beats, packs, or services, your transaction is processed by Stripe, Inc. We receive transaction confirmations from Stripe that may include your name, email, billing address, and transaction amount. We do not collect, store, or process credit card numbers, CVV codes, or full payment card data — all such data is handled exclusively by Stripe in accordance with PCI-DSS Level 1 compliance.</li>
            <li><strong>Account Information:</strong> If you create an account for the Flowell Club or community features, we collect your chosen username, email address, and password (stored as a cryptographic hash, never in plaintext).</li>
          </ul>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">2.2 Information Collected Automatically</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Device and Usage Data:</strong> IP address, browser type and version, operating system, device type, referring URL, pages visited, time spent on pages, click paths, and timestamps.</li>
            <li><strong>Cookies and Local Storage:</strong> Session cookies for site functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings.</li>
            <li><strong>Audio Playback Data:</strong> When you preview beats, we log which beats were played, duration of playback, and whether playback completed, solely for analytics and improving our catalog presentation.</li>
          </ul>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">2.3 Information From Third Parties</h3>
          <p>We may receive aggregated, non-identifying analytics data from third-party services including Stripe (payment processor), Google Analytics or equivalent analytics platforms, and social media platforms whose widgets or embeds appear on the Site.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Delivery:</strong> To process and fulfill your orders, deliver digital products, and provide customer support.</li>
            <li><strong>Communication:</strong> To respond to your inquiries, send transactional emails (receipts, license confirmations), and provide critical service notifications.</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal process, or government requests; to enforce our Terms of Service, Privacy Policy, and licensing agreements; and to protect the rights, property, safety, and security of Flowell, our users, or third parties.</li>
            <li><strong>Security and Fraud Prevention:</strong> To monitor for and prevent fraudulent transactions, unauthorized access, abuse, and other malicious activity.</li>
            <li><strong>Analytics and Improvement:</strong> To analyze usage trends, measure the effectiveness of our content, and improve the Site, Services, and product offerings.</li>
            <li><strong>Marketing (Opt-In Only):</strong> With your express opt-in consent, to send you promotional emails about new beats, packs, or services. You may unsubscribe at any time using the link in any marketing email or by contacting <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a>.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">4. Legal Bases for Processing (GDPR)</h2>
          <p>For users in the European Economic Area, the United Kingdom, and Switzerland, we process personal data under the following lawful bases:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Contract Performance (Art. 6(1)(b)):</strong> Processing necessary to fulfill purchase orders, deliver licensed products, and provide the Services you requested.</li>
            <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Processing required to comply with legal obligations such as tax record retention and law enforcement responses.</li>
            <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> Processing for fraud prevention, site security, analytics, and enforcing our intellectual property rights, balanced against your privacy rights.</li>
            <li><strong>Consent (Art. 6(1)(a)):</strong> Processing for marketing communications and non-essential cookies, based on your explicit, withdrawable consent.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">5. Cookie Policy</h2>
          <p>We use the following categories of cookies:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Essential Cookies:</strong> Required for the Site to function (session management, shopping cart, security). These cannot be disabled.</li>
            <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with the Site. May be disabled without affecting functionality.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings such as volume preferences or display preferences.</li>
            <li><strong>Marketing Cookies:</strong> Used only with your consent to deliver relevant content across platforms.</li>
          </ul>
          <p className="mt-3">Most browsers allow you to refuse or accept cookies. Disabling essential cookies may impair Site functionality. You can manage cookies through your browser settings or by contacting us.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">6. Data Sharing and Disclosure</h2>
          <p>We do not sell, rent, or trade your personal information to third parties. We share data only under the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Payment Processors:</strong> Transaction data is shared with Stripe, Inc. for payment processing. Stripe's handling of your data is governed by Stripe's Privacy Policy and PCI-DSS compliance.</li>
            <li><strong>Service Providers:</strong> We may engage third-party vendors (hosting, analytics, email delivery) who have access to limited personal data solely to perform services on our behalf. All such vendors are bound by contractual obligations of confidentiality and data protection.</li>
            <li><strong>Legal Compliance:</strong> We may disclose information when required by law, subpoena, court order, or government request, or when we believe in good faith that disclosure is necessary to protect our rights, enforce our Terms, investigate fraud, or protect safety.</li>
            <li><strong>Business Transfer:</strong> In the event of a merger, acquisition, asset sale, or similar transaction, information may be transferred. We will notify you via email or prominent notice on the Site before such transfer occurs.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">7. Data Retention</h2>
          <p>We retain personal data only as long as necessary to fulfill the purposes described in this Policy or as required by applicable law:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li><strong>Transaction Records:</strong> Retained for a minimum of seven (7) years to comply with tax and financial record-keeping requirements under U.S. federal law and Maryland state law.</li>
            <li><strong>License Records:</strong> Retained indefinitely to evidence and enforce music licensing agreements and intellectual property rights.</li>
            <li><strong>Contact Form Submissions:</strong> Retained for up to three (3) years for customer support and legal reference.</li>
            <li><strong>Account Data:</strong> Retained for the life of your account plus seven (7) years for legal compliance. You may request deletion at any time.</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized within ninety (90) days of collection.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">8. Your Privacy Rights</h2>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">8.1 California Consumer Rights (CCPA/CPRA)</h3>
          <p>California residents have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Know what personal information is collected about them (Right to Know)</li>
            <li>Know whether their personal information is sold or shared (Right to Know)</li>
            <li>Opt out of the sale or sharing of personal information (Right to Opt-Out)</li>
            <li>Request deletion of their personal information (Right to Delete)</li>
            <li>Correct inaccurate personal information (Right to Correct)</li>
            <li>Not receive discriminatory treatment for exercising privacy rights</li>
          </ul>
          <p className="mt-3">To exercise these rights, submit a request to <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a>. We will verify your identity before processing. We will respond within forty-five (45) days, extendable by an additional forty-five (45) days with notice.</p>
          <p className="mt-3"><strong>We do not sell personal information.</strong> "Sale" as defined by CCPA includes any exchange for monetary or other valuable consideration. We do not engage in this practice.</p>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">8.2 Other U.S. State Rights</h3>
          <p>Residents of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), and other states with comprehensive privacy laws have substantially similar rights, including access, deletion, correction, and opt-out of targeted advertising and profiling. Submit requests to <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a>.</p>

          <h3 className="text-base font-bold text-white/80 mt-6 mb-2">8.3 GDPR/UK Data Protection Rights</h3>
          <p>EEA, UK, and Swiss residents have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Access their personal data (Right of Access)</li>
            <li>Rectify inaccurate data (Right to Rectification)</li>
            <li>Request erasure of their data (Right to Erasure / "Right to Be Forgotten")</li>
            <li>Restrict processing (Right to Restriction)</li>
            <li>Receive a portable copy of their data (Right to Data Portability)</li>
            <li>Object to processing (Right to Object)</li>
            <li>Withdraw consent at any time (Right to Withdraw Consent)</li>
            <li>Lodge a complaint with their supervisory authority</li>
          </ul>
          <p className="mt-3">Submit requests to <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a>. We will respond within thirty (30) days, extendable by sixty (60) additional days for complex requests with notice.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">9. Children's Privacy (COPPA)</h2>
          <p>The Site and Services are not directed to, and we do not knowingly collect personal information from, children under thirteen (13) years of age. If you believe we have collected information from a child under 13, contact us immediately at <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a> and we will delete such information expeditiously. Parents or guardians may also contact us to review, request deletion of, or refuse further collection of their child's information.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">10. Data Security</h2>
          <p>We implement industry-standard technical, administrative, and physical security measures designed to protect personal data from unauthorized access, use, alteration, disclosure, or destruction, including:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>TLS/SSL encryption for all data in transit</li>
            <li>Secure hosting on Vercel's platform with SOC 2 Type II and ISO 27001 compliance</li>
            <li>Payment data handled exclusively by Stripe (PCI-DSS Level 1 compliant)</li>
            <li>Regular security reviews and access controls limiting data access to authorized personnel only</li>
            <li>Password hashing using industry-standard cryptographic algorithms</li>
          </ul>
          <p className="mt-3">No method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">11. International Data Transfers</h2>
          <p>Flowell is based in the United States. If you access the Site from outside the United States, your personal data will be transferred to and processed in the United States. For transfers from the EEA, UK, or Switzerland, we rely on appropriate safeguards including the EU-U.S. Data Privacy Framework, the UK Extension to the Data Privacy Framework, and the Swiss-U.S. Data Privacy Framework, or Standard Contractual Clauses (SCCs) where applicable. By using the Site, you consent to the transfer of your data to the United States.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">12. Third-Party Links and Services</h2>
          <p>The Site contains links to third-party websites and embeds third-party services (Stripe, YouTube, Spotify, Instagram, TikTok, Traktrain, BeatStars). We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites or services you interact with.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">13. Do Not Track Signals</h2>
          <p>We currently do not respond to "Do Not Track" (DNT) browser signals as no uniform industry standard for DNT has been established. We will update this Policy if and when such a standard is adopted.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">14. Intellectual Property Notice</h2>
          <p>Flowell is a registered trademark (USPTO Serial No. 97/492,523). All content on the Site, including but not limited to beats, compositions, sound recordings, pack contents, cover art, logos, text, and code, is the exclusive intellectual property of Flowell and is protected under United States and international copyright, trademark, and intellectual property laws. Unauthorized use, reproduction, distribution, or exploitation of any content without a valid license is strictly prohibited and may result in civil and criminal liability. See our <a href="/terms/" className="text-[#f1c40f] hover:underline">Terms of Service</a> for licensing terms.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">15. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. Material changes will be communicated by posting a prominent notice on the Site and, where appropriate, via email. The "Last updated" date at the top of this Policy indicates the effective date. Continued use of the Site after changes constitutes acceptance of the revised Policy.</p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-3">16. Contact Information</h2>
          <p>For any questions, requests, or concerns regarding this Privacy Policy or our data practices, contact:</p>
          <div className="mt-3 p-4 border border-white/10 bg-white/[0.02]">
            <p className="font-bold text-white">Flowell</p>
            <p>Email: <a href="mailto:flowellbeats@gmail.com" className="text-[#f1c40f] hover:underline">flowellbeats@gmail.com</a></p>
            <p>Location: State of Maryland, United States</p>
          </div>
          <p className="mt-3">For GDPR matters, our representative for EEA/UK/Swiss residents can be reached at the same email. For legal inquiries regarding intellectual property enforcement, please direct correspondence to the email above with "Legal — IP Enforcement" in the subject line.</p>
        </div>

        </div>
      </div>
    </div>
  )
}