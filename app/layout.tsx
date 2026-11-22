import { Geist_Mono, Inter } from "next/font/google"

import "@/app/globals.css"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <QueryProvider>
          <ThemeProvider>
            {children}
            <ScrollToTop />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
