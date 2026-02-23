import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'לוח בקרה - קנייה-ברורה',
    template: '%s | לוח בקרה',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-gray-100" dir="rtl">
        {children}
      </body>
    </html>
  )
}
