import Link from 'next/link'
import { ContactReference, LegalPage } from '@/components/site/LegalPage'
import { pageMeta } from '@/lib/seo'

const TITLE = 'Terms of Use'
const DESCRIPTION =
  'The terms that apply when you use thefeetify.com, including age requirements, acceptable use, and limits on what our content should be relied on for.'
const PATH = '/terms'

export const metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })

export default function TermsPage() {
  return (
    <LegalPage
      title={TITLE}
      description={DESCRIPTION}
      path={PATH}
      lead="By using thefeetify.com you agree to these terms. Please read them — they are short and written in plain English."
    >
      <h2>1. About these terms</h2>
      <p>
        These terms govern your use of thefeetify.com (&quot;Feetify&quot;, &quot;the site&quot;, &quot;we&quot;,
        &quot;us&quot;). If you do not agree with them, please do not use the site.
      </p>

      <h2>2. Adults only</h2>
      <p>
        The site discusses selling adult-oriented content and is intended only for people aged 18 or over, or the age
        of majority in your jurisdiction if that is higher. By using the site you confirm that you meet this
        requirement and that viewing this kind of material is lawful where you are.
      </p>

      <h2>3. Information, not advice</h2>
      <p>
        Everything on the site is general information. It is not financial, legal, tax, or professional advice, and it
        is not a substitute for advice from a qualified professional who knows your circumstances. Laws on selling
        adult-oriented content, age verification, and tax reporting vary between countries and regions. You are
        responsible for checking and following the rules that apply to you.
      </p>

      <h2>4. No guarantee of earnings</h2>
      <p>
        Selling content online does not guarantee any income. Figures, examples, and seller quotes on the site are
        illustrative only and are not a promise or prediction of what you will earn. Results depend on many factors
        outside our control.
      </p>

      <h2>5. Third-party platforms and affiliate links</h2>
      <p>
        The site links to third-party websites, including through affiliate links, and we may earn a commission when
        you sign up or buy through them (see our <Link href="/affiliate-disclosure">affiliate disclosure</Link>). We do
        not operate, control, or accept responsibility for third-party platforms, their fees, their policies, or how
        they handle your account, content, payments, or data. Your dealings with any such platform are solely between
        you and that platform and are subject to its own terms.
      </p>
      <p>
        Fees, commission rates, and policies described on the site are based on publicly available information and can
        change at any time. Always confirm the current terms directly with the platform before relying on them.
      </p>

      <h2>6. Acceptable use</h2>
      <p>When using the site, you agree not to:</p>
      <ul>
        <li>use it if you are under 18;</li>
        <li>attempt to gain unauthorised access to any part of the site or its systems;</li>
        <li>interfere with the site&apos;s operation, or use automated means to overload it;</li>
        <li>send unlawful, abusive, or misleading content through the contact form;</li>
        <li>copy or republish substantial parts of the site without our permission.</li>
      </ul>

      <h2>7. Intellectual property</h2>
      <p>
        The text, design, and graphics on the site belong to us or our licensors and are protected by copyright and
        other laws. You may view pages and share links for personal, non-commercial use. All third-party product names,
        logos, and trademarks, including FeetFinder, are the property of their respective owners and are used for
        identification and comparison only. Feetify is an independent service and is not affiliated with FeetFinder.
      </p>
      <p>
        If you believe something on the site infringes your copyright, send the details through <ContactReference />{' '}
        and we will review it promptly.
      </p>

      <h2>8. Disclaimer of warranties</h2>
      <p>
        The site is provided &quot;as is&quot; and &quot;as available&quot;. We try to keep information accurate and
        current but do not warrant that it is complete, error-free, or up to date, or that the site will always be
        available.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential loss,
        or for any loss of income, data, or reputation, arising from your use of the site, your reliance on its
        content, or your dealings with any third-party platform. Nothing in these terms excludes liability that cannot
        be excluded by law.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update the site and these terms from time to time. The date at the top shows the latest revision. By
        continuing to use the site after changes are published, you accept the updated terms.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms? Reach us through <ContactReference />. Our{' '}
        <Link href="/privacy-policy">privacy policy</Link> explains how we handle personal information.
      </p>
    </LegalPage>
  )
}
