import Link from 'next/link'
import React from 'react'

const FastActionBox = ({
  href,
  title,
  description,
  icon,
  color = 'green',
}: {
  href: string
  title: string
  description: string
  icon?: React.ReactNode
  color?: 'amber' | 'brand' | 'blue' | 'green'
}) => {
  const colors = {
    amber:
      'bg-amber-400 dark:bg-scale-100 group-hover:bg-amber-500 dark:group-hover:bg-amber-300 text-amber-900',
    blue: 'bg-blue-400 dark:bg-scale-100 group-hover:bg-blue-500 dark:group-hover:bg-blue-300 text-blue-900',
    brand:
      'bg-brand-400 dark:bg-scale-100 group-hover:bg-brand-500 dark:group-hover:bg-brand-300 text-brand-900',
    green:
      'bg-green-400 dark:bg-scale-100 group-hover:bg-green-500 dark:group-hover:bg-green-300 text-green-900',
  }

  const content = (
    <div className="px-5 py-4 border rounded cursor-pointer group border-slate-400 bg-slate-600 hover:bg-slate-500 dark:border-slate-600">
      <div className="flex flex-col gap-3">
        <div
          className={`${colors[color]}
            flex h-8 w-8
            items-center justify-center rounded-md
            transition-all
            group-hover:scale-110
            `}
        >
          {icon}
        </div>
        <div>
          <h5 className="mb-2 text-base text-scale-1200">{title}</h5>
          <p className="text-sm p">{description}</p>
        </div>
      </div>
      <div className="rounded-[6px] bg-zinc-900 p-4 text-center text-white group-hover:scale-105">
        Create a Fund
      </div>
    </div>
  )

  return <Link href={href}>{content}</Link>
}

export default FastActionBox
