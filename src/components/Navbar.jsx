import { Link, useLocation } from 'react-router-dom'
import { getTickets } from '../utils/storage.js'

const NAV_LINKS = [
  { to: '/',           label: 'Matches' },
  { to: '/my-tickets', label: 'My Tickets' },
  { to: '/admin',      label: 'Admin' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const ticketCount = getTickets().length

  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center
                          font-condensed font-black text-black text-lg select-none">
            F
          </div>
          <span className="font-condensed font-black text-xl tracking-wide">
            FAIR<span className="text-orange-500">TICKET</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-1 sm:gap-4">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={`relative text-sm font-semibold px-2 py-1 transition-colors duration-150
                  ${active ? 'text-orange-500' : 'text-gray-400 hover:text-gray-100'}`}
              >
                {label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                )}
                {/* Ticket count badge */}
                {label === 'My Tickets' && ticketCount > 0 && (
                  <span className="ml-1.5 bg-orange-500 text-black text-[10px] font-black
                                   w-4 h-4 rounded-full inline-flex items-center justify-center">
                    {ticketCount > 9 ? '9+' : ticketCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
