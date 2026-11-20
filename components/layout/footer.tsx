import Link from "next/link"

import { storeConfig } from "@/config/store.config"

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

const socialLinks = [
  { href: storeConfig.social.facebook, label: "Facebook" },
  { href: storeConfig.social.instagram, label: "Instagram" },
  { href: storeConfig.social.youtube, label: "YouTube" },
].filter((item) => item.href.trim().length > 0)

/**
 * Shared storefront footer for configured store identity, contact details, and public links.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-sm">
          <Link
            href="/"
            className="font-semibold tracking-tight text-foreground"
          >
            {storeConfig.name}
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            {storeConfig.description}
          </p>

          {(storeConfig.contact.email ||
            storeConfig.contact.phone ||
            storeConfig.contact.address) && (
            <address className="mt-4 space-y-1 text-sm text-muted-foreground not-italic">
              {storeConfig.contact.email && (
                <p>
                  <a
                    href={`mailto:${storeConfig.contact.email}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {storeConfig.contact.email}
                  </a>
                </p>
              )}
              {storeConfig.contact.phone && (
                <p>
                  <a
                    href={`tel:${storeConfig.contact.phone}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {storeConfig.contact.phone}
                  </a>
                </p>
              )}
              {storeConfig.contact.address && (
                <p>{storeConfig.contact.address}</p>
              )}
            </address>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3"
          >
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {socialLinks.length > 0 && (
            <nav
              aria-label="Social media"
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} {storeConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
