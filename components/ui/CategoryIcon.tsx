import Link from 'next/link'

interface CategoryIconProps {
  icon: string
  label: string
  href: string
}

export function CategoryIcon({ icon, label, href }: CategoryIconProps) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
        <span className="material-symbols-outlined text-2xl text-primary-600">{icon}</span>
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
        {label}
      </span>
    </Link>
  )
}
