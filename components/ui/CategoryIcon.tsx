import Link from 'next/link'

interface CategoryIconProps {
  icon: string
  label: string
  href: string
}

export function CategoryIcon({ icon, label, href }: CategoryIconProps) {
  return (
    <Link
      href={href}
      className="group cursor-pointer bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-3 transition-all hover:shadow-lg hover:border-primary/30"
    >
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <span className="font-bold text-slate-900">{label}</span>
    </Link>
  )
}
