const TICKETS_KEY = 'ft_tickets'

// ── Read ──────────────────────────────────────────────────────────────────────
export function getTickets() {
  try {
    const raw = localStorage.getItem(TICKETS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getTicket(id) {
  return getTickets().find((t) => t.id === id) ?? null
}

// ── Write ─────────────────────────────────────────────────────────────────────
export function saveTickets(tickets) {
  try {
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets))
  } catch (e) {
    console.error('localStorage write failed', e)
  }
}

export function addTicket(ticket) {
  saveTickets([...getTickets(), ticket])
}

export function updateTicket(id, patch) {
  saveTickets(getTickets().map((t) => (t.id === id ? { ...t, ...patch } : t)))
}

// ── Helpers ───────────────────────────────────────────────────────────────────
export function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export function formatPrice(n) {
  return new Intl.NumberFormat('fr-MA').format(n) + ' MAD'
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getMaxResalePrice(originalPrice) {
  return Math.round(originalPrice * 1.15)
}

/** Returns ms until QR activates (24h before match). Negative = already active. */
export function msUntilActivation(matchDateIso) {
  const activateAt = new Date(matchDateIso).getTime() - 24 * 60 * 60 * 1000
  return activateAt - Date.now()
}
