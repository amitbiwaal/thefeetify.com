import Link from 'next/link'
import { ContactReference, LegalPage } from '@/components/site/LegalPage'
import { pageMeta } from '@/lib/seo'

const TITLE = 'Privacy Policy'
const DESCRIPTION =
  'How thefeetify.com handles personal information: what we collect, why, how long we keep it, and the choices you have.'
const PATH = '/privacy-policy'

export const metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      lead="We collect as little as possible. This page explains what information thefeetify.com handles, why, and what you can do about it."
    >
      <h2>Who we are</h2>
      <p>
        This policy applies to thefeetify.com (&quot;Feetify&quot;, &quot;we&quot;, &quot;us&quot;). The site publishes
        information for adults about selling feet pics online. You can read every page without creating an account, and
        we do not ask visitors to register.
      </p>

      <h2>Information we collect</h2>
      <h3>Messages you send us</h3>
      <p>
        When you use the form on our <Link href="/contact">contact page</Link>, we receive the name, email address,
        subject, and message you enter. We use this only to read and answer your message. Please do not include
        passwords, payment details, identity documents, or photos.
      </p>
      <h3>Technical data</h3>
      <p>
        Like every website, our hosting provider automatically processes basic technical data when you load a page:
        your IP address, browser type, the page requested, and the date and time. This is used to deliver the site,
        keep it secure, and diagnose faults. We briefly use your IP address to limit repeated contact form submissions;
        it is not saved with your message.
      </p>

      <h2>Cookies</h2>
      <p>
        The public pages of this site do not set advertising or tracking cookies. The only cookie we set is a strictly
        necessary sign-in cookie for site administrators, which ordinary visitors never receive. If we introduce
        analytics or other cookies in future, we will update this policy first.
      </p>

      <h2>Affiliate links and third-party sites</h2>
      <p>
        Our &quot;Start Selling&quot; buttons and some article links are affiliate links to FeetFinder. When you click
        one, you leave our site and the destination site may set its own cookies and record that you arrived through
        our referral. Anything you do or share there — including creating an account, verifying your age, or entering
        payment details — is governed by that site&apos;s own privacy policy and terms, not this one. We never receive
        your account details, identity documents, or payment information from those sites. See our{' '}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link> for more.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>To reply to messages and handle corrections or privacy requests.</li>
        <li>To operate, secure, and maintain the website.</li>
        <li>To prevent spam and abuse of the contact form.</li>
        <li>To meet legal obligations where they apply.</li>
      </ul>
      <p>We do not sell personal information, and we do not use it for advertising profiles.</p>

      <h2>Who we share it with</h2>
      <p>
        We use service providers to run the site, such as our hosting and storage provider, which process data on our
        behalf. We may also disclose information when the law requires it or when it is necessary to protect our rights
        or the safety of others. We do not share contact form messages with affiliate partners.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Contact messages are kept for as long as needed to deal with your request and are then deleted, usually within
        12 months. Technical logs are retained by our hosting provider according to its own retention schedule.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        Depending on where you live, you may have the right to ask for a copy of the personal information we hold about
        you, to have it corrected or deleted, or to object to how it is used. To make a request, reach us through{' '}
        <ContactReference />. We will respond within a reasonable time and may need to confirm your identity first.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over an encrypted connection (HTTPS), and access to stored messages is restricted to site
        administrators. No method of transmission or storage is completely secure, so please avoid sending sensitive
        information through the contact form.
      </p>

      <h2>Age restriction</h2>
      <p>
        This site is intended only for adults aged 18 or over (or the age of majority where you live). We do not
        knowingly collect information from anyone under 18. If you believe a minor has sent us personal information,
        contact us and we will delete it.
      </p>

      <h2>International visitors</h2>
      <p>
        Our service providers may process data in countries other than your own. By using the site and contacting us,
        you understand that your information may be processed outside your country of residence.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the site changes. The date at the top shows when it was last revised. Significant
        changes will be reflected here before they take effect.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy or about your information? Get in touch through <ContactReference />.
      </p>
    </LegalPage>
  )
}
