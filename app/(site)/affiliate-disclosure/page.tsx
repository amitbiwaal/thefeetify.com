import Link from 'next/link'
import { ContactReference, LegalPage } from '@/components/site/LegalPage'
import { pageMeta } from '@/lib/seo'

const TITLE = 'Affiliate Disclosure'
const DESCRIPTION =
  'How thefeetify.com earns money: our call-to-action buttons are affiliate links to FeetFinder, and we may earn a commission when you sign up.'
const PATH = '/affiliate-disclosure'

export const metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      lead="This site is free to read and is funded by affiliate commissions. Here is exactly how that works."
    >
      <h2>The short version</h2>
      <p>
        Some links on thefeetify.com are affiliate links. In particular, every &quot;Start Selling&quot; and
        &quot;Create Your Profile&quot; button on this site, and some links inside our articles, lead to FeetFinder
        through a referral link. If you sign up or make a purchase after clicking one, we may earn a commission. It
        costs you nothing extra.
      </p>

      <h2>Our relationship with FeetFinder</h2>
      <p>
        Feetify is an independent service. We are not owned by, operated by, or endorsed by FeetFinder, and FeetFinder
        is not responsible for the content of this site. FeetFinder and all other product names, logos, and trademarks
        mentioned here belong to their respective owners and are used for identification and comparison purposes only.
      </p>
      <p>
        When you click an affiliate link you leave our site. Creating an account, verifying your age, listing content,
        and receiving payments all happen on the destination platform under its own terms and privacy policy.
      </p>

      <h2>How affiliate links are marked</h2>
      <p>
        Affiliate links on this site open in a new tab and carry the <code>rel=&quot;sponsored&quot;</code> attribute so
        that search engines can identify them as paid links. Articles that may contain affiliate links say so on the
        page.
      </p>

      <h2>What this means for our content</h2>
      <p>
        Commissions help keep the site running, and you should weigh what you read here with that in mind. Fees and
        policies we describe are based on publicly available information and can change, so always check the current
        terms on the platform itself before deciding where to sell.
      </p>

      <h2>Earnings and testimonials</h2>
      <p>
        Nothing on this site is a promise of income. Earnings from selling content are never guaranteed and vary widely
        between individuals. Seller quotes and example figures are illustrative and are not verified individual
        results.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Our content is general information for adults aged 18 or over. It is not financial, legal, or tax advice.
        Please review the laws and platform rules that apply to you. See our <Link href="/terms">terms of use</Link>{' '}
        for the full details.
      </p>

      <h2>Questions</h2>
      <p>
        If anything about how this site is funded is unclear, ask us through <ContactReference />.
      </p>
    </LegalPage>
  )
}
