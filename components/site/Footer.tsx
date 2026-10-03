import Image from 'next/image'
import Link from 'next/link'
import { FOOTER_LINKS, SITE } from '@/lib/site'

const COLUMNS = [
  { title: 'Explore', links: FOOTER_LINKS.explore },
  { title: 'Seller Guide', links: FOOTER_LINKS.guide },
  { title: 'Legal', links: FOOTER_LINKS.legal },
]

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link className="footer-logo" href="/" aria-label={`${SITE.name} home`}>
              <Image src={SITE.logo} width={430} height={132} alt="Feetify — feet pics, your way" />
            </Link>
            <p>Guides and resources for adults who want to sell feet pics online safely, privately, and on their own terms.</p>
          </div>
          <nav className="footer-cols" aria-label="Footer">
            {COLUMNS.map((column) => (
              <div className="footer-col" key={column.title}>
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="disc">
          <span className="age">18+ Adults Only</span>
          <p>
            <strong>About Feetify:</strong> Feetify (thefeetify.com) is a platform and resource for adults who want to
            sell feet pics online safely. This page is for general informational purposes and is intended for users
            aged 18 and over. It contains affiliate links, which means we may earn a commission at no extra cost to you
            if you sign up or make a purchase through them.
          </p>
          <p>
            All product names, logos, and trademarks referenced, including <strong>FeetFinder</strong>, are the property
            of their respective owners and are used for identification and comparison purposes only. Feetify is an
            independent service and is <strong>not affiliated with FeetFinder</strong>.
          </p>
          <p>
            This content does not constitute financial, legal, or professional advice. Earnings are not guaranteed and
            vary by individual. You must be at least 18 years old (or the age of majority in your jurisdiction) to
            create or sell adult-oriented content. Testimonials shown are illustrative examples and not verified
            individual results. Always review the terms, policies, and local laws that apply to you before getting
            started.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Feetify · thefeetify.com
          </p>
        </div>
      </div>
    </footer>
  )
}
