import Image from "next/image"
import Link from "next/link"
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react"
import type { SVGProps } from "react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { storeConfig } from "@/config/store.config"

type FooterLink = {
  href: string
  label: string
}

type ContactItem = {
  href?: string
  label: string
  icon: LucideIcon
}

const footerGroups: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { href: "/products", label: "Shop all" },
      { href: "/categories", label: "Categories" },
      { href: "/brands", label: "Brands" },
      { href: "/about", label: "Our story" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { href: "/contact", label: "Contact us" },
      { href: "/cart", label: "Shopping bag" },
      { href: "/account", label: "My account" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/privacy-policy", label: "Privacy policy" },
      { href: "/terms", label: "Terms & conditions" },
    ],
  },
]

type IconProps = SVGProps<SVGSVGElement>

function iconProps(props: IconProps): IconProps {
  return {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  }
}

function FacebookIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function YoutubeIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

const socialLinks = [
  { href: storeConfig.social.facebook, label: "Facebook", icon: FacebookIcon },
  {
    href: storeConfig.social.instagram,
    label: "Instagram",
    icon: InstagramIcon,
  },
  { href: storeConfig.social.youtube, label: "YouTube", icon: YoutubeIcon },
]

const headingClass =
  "mb-4 text-[12px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-foreground"
const linkClass =
  "text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none"

export function Footer() {
  const contactItems: ContactItem[] = []

  if (storeConfig.contact.email) {
    contactItems.push({
      href: `mailto:${storeConfig.contact.email}`,
      label: storeConfig.contact.email,
      icon: Mail,
    })
  }
  if (storeConfig.contact.phone) {
    contactItems.push({
      href: `tel:${storeConfig.contact.phone}`,
      label: storeConfig.contact.phone,
      icon: Phone,
    })
  }
  if (storeConfig.contact.address) {
    contactItems.push({
      label: storeConfig.contact.address,
      icon: MapPin,
    })
  }

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-10 sm:py-12 md:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.6fr)] md:items-end md:gap-12">
          <div className="max-w-xl">
            <Link
              href="/"
              aria-label={`${storeConfig.name} home`}
              className="inline-flex items-center outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              {storeConfig.logo ? (
                <Image
                  src={storeConfig.logo}
                  alt={storeConfig.name}
                  width={160}
                  height={44}
                  className="h-10 w-auto max-w-40 object-contain"
                />
              ) : (
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  {storeConfig.name}
                </span>
              )}
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              {storeConfig.description}
            </p>
          </div>

          <div className="md:justify-self-end">
            <p className={headingClass}>Follow along</p>
            <ul className="flex items-center gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  {href?.trim() ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={label}
                      title={label}
                      className="flex size-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <Icon className="size-4" />
                    </a>
                  ) : (
                    <span
                      aria-label={`${label} link not configured`}
                      title={`${label} link not configured`}
                      className="flex size-10 cursor-not-allowed items-center justify-center border border-border/60 text-muted-foreground/40"
                    >
                      <Icon className="size-4" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-x-4 gap-y-9 py-10 sm:gap-x-8 sm:py-12 md:grid-cols-4">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className={headingClass}>{group.title}</h2>
              <ul className="space-y-1 sm:space-y-2">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <h2 className={headingClass}>Get in touch</h2>
            {contactItems.length > 0 ? (
              <ul className="space-y-1 sm:space-y-2">
                {contactItems.map(({ href, label, icon: Icon }) => (
                  <li key={label}>
                    {href ? (
                      <a
                        href={href}
                        className={`${linkClass} flex min-w-0 items-start gap-2.5`}
                      >
                        <Icon
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0"
                        />
                        <span className="min-w-0 wrap-break-word">{label}</span>
                      </a>
                    ) : (
                      <p className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                        <Icon
                          aria-hidden="true"
                          className="mt-0.5 size-4 shrink-0"
                        />
                        <span className="min-w-0 wrap-break-word">{label}</span>
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Have a question?{" "}
                <Link href="/contact" className={linkClass}>
                  Contact our team
                </Link>
              </p>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex flex-col-reverse gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            © {new Date().getFullYear()} {storeConfig.name}. All rights
            reserved.
          </p>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto self-end px-0 text-muted-foreground hover:bg-transparent hover:text-foreground sm:self-auto"
          >
            <a
              href="#top"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"
            >
              Back to top
              <ArrowUp className="ml-1 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </footer>
  )
}
