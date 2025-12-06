import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spatium AI | Transform Floor Plans into 3D Rooms",
  description:
    "Revolutionary AI-powered interior design. Upload any floor plan and watch it transform into a fully-furnished 3D room in seconds.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0f1117",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
