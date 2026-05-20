import { Routes, Route } from 'react-router-dom'
import { useState, createContext, useContext } from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import BuyTicket from './pages/BuyTicket.jsx'
import MyTickets from './pages/MyTickets.jsx'
import ResellTicket from './pages/ResellTicket.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

// ── Toast context ─────────────────────────────────────────────────────────────
export const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

export default function App() {
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  return (
    <ToastContext.Provider value={showToast}>
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
        <Navbar />

        {/* Global Toast */}
        {toast && (
          <div
            className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl animate-fade-in
              ${toast.type === 'success'
                ? 'bg-emerald-500 text-black'
                : 'bg-red-500 text-white'}`}
          >
            {toast.type === 'success' ? '✓ ' : '✕ '}{toast.msg}
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/buy/:matchId/:zone" element={<BuyTicket />} />
            <Route path="/my-tickets"    element={<MyTickets />} />
            <Route path="/resell/:ticketId"   element={<ResellTicket />} />
            <Route path="/admin"         element={<AdminDashboard />} />
          </Routes>
        </main>

        <footer className="border-t border-gray-800 mt-20 py-8 text-center text-gray-600 text-sm">
          <span className="font-condensed font-bold text-gray-500">
            FAIR<span className="text-orange-500">TICKET</span>
          </span>
          <span className="mx-3">·</span>AI-Powered Anti-Scalping Platform
          <span className="mx-3">·</span>by ameur khadraoui
        </footer>
      </div>
    </ToastContext.Provider>
  )
}
