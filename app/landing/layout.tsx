import type React from "react"
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-full">{children}</div>
}
