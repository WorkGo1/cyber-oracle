import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { dateLabel } from '@/lib/date'

function TabIcon({ name, active }: { name: 'home' | 'history' | 'pool' | 'settings'; active: boolean }) {
  const common = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      {name === 'home' && (
        <g {...common} opacity={active ? 1 : 0.85}>
          <path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" fill={active ? 'currentColor' : 'none'} fillOpacity={0.25} />
          <path d="M18.5 15.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" />
        </g>
      )}
      {name === 'history' && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.2" />
          <path d="M12 7.5V12l3 2" />
        </g>
      )}
      {name === 'pool' && (
        <g {...common}>
          <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H9l-4.2 3.2c-.5.4-.8 0-.8-.5z" />
          <path d="M8.5 9h7M8.5 12.5h4.5" />
        </g>
      )}
      {name === 'settings' && (
        <g {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4L6 18M18 18l-1.6-1.6M7.6 7.6L6 6" />
        </g>
      )}
    </svg>
  )
}

const TABS = [
  { to: '/', name: 'home', label: '神婆' },
  { to: '/history', name: 'history', label: '记录' },
  { to: '/pool', name: 'pool', label: '树洞' },
  { to: '/settings', name: 'settings', label: '设置' },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const isScene = pathname.startsWith('/scene/')
  const isHome = pathname === '/'

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col">
      {!isScene && !isHome && (
        <header className="flex items-center justify-between px-5 pb-2 pt-[max(14px,env(safe-area-inset-top))]">
          <div>
            <h1 className="text-chrome font-display text-[22px] leading-none">赛博神婆</h1>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-t3">CYBER ORACLE v0.1</p>
          </div>
          <span className="hud-tag">{dateLabel()}</span>
        </header>
      )}
      <main className="flex-1 px-5 pb-[calc(72px+env(safe-area-inset-bottom))]">{children}</main>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[480px] items-stretch justify-around border-t border-line bg-bg/85 px-2 pt-1.5 backdrop-blur-lg"
        style={{ paddingBottom: 'calc(6px + env(safe-area-inset-bottom))' }}
        aria-label="主导航"
      >
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) =>
              `flex min-w-[64px] flex-col items-center gap-0.5 rounded-btn py-1 text-[10px] transition-colors ${
                isActive ? 'text-acid' : 'text-t3'
              }`
            }
          >
            <TabIcon name={t.name} active={false} />
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
