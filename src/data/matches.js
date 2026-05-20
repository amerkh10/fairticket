const now = Date.now()
const DAY = 24 * 60 * 60 * 1000

export const MATCHES = [
  {
    id: 'm1',
    home: 'Raja Casablanca',
    away: 'Wydad AC',
    homeFlag: '🟢',
    awayFlag: '🔴',
    venue: 'Stade Mohammed V, Casablanca',
    date: new Date(now + 3 * DAY).toISOString(),
    competition: 'Botola Pro',
    tag: 'Derby',
    tagColor: 'bg-orange-500',
    seats: {
      VIP:       { price: 450, total: 200,  sold: 178 },
      Tribune:   { price: 150, total: 800,  sold: 612 },
      Populaire: { price: 60,  total: 2000, sold: 1340 },
    },
  },
  {
    id: 'm2',
    home: 'AS FAR',
    away: 'MAS Fès',
    homeFlag: '🔵',
    awayFlag: '🟡',
    venue: 'Stade Moulay Abdallah, Rabat',
    date: new Date(now + 7 * DAY).toISOString(),
    competition: 'Botola Pro',
    tag: 'Botola Pro',
    tagColor: 'bg-blue-600',
    seats: {
      VIP:       { price: 300, total: 150,  sold: 80  },
      Tribune:   { price: 120, total: 600,  sold: 310 },
      Populaire: { price: 50,  total: 1500, sold: 680 },
    },
  },
  {
    id: 'm3',
    home: 'Morocco',
    away: 'Senegal',
    homeFlag: '🇲🇦',
    awayFlag: '🇸🇳',
    venue: 'Grand Stade de Casablanca',
    date: new Date(now + 14 * DAY).toISOString(),
    competition: 'AFCON Qualifier',
    tag: 'International',
    tagColor: 'bg-emerald-600',
    seats: {
      VIP:       { price: 800, total: 500,  sold: 487  },
      Tribune:   { price: 350, total: 2000, sold: 1876 },
      Populaire: { price: 120, total: 5000, sold: 3210 },
    },
  },
  {
    id: 'm4',
    home: 'Ittihad Tanger',
    away: 'RSB Berkane',
    homeFlag: '🔵',
    awayFlag: '🟠',
    venue: 'Stade Ibn Batouta, Tanger',
    date: new Date(now + 21 * DAY).toISOString(),
    competition: 'Coupe du Trône',
    tag: 'Cup SF',
    tagColor: 'bg-purple-600',
    seats: {
      VIP:       { price: 500, total: 300,  sold: 201  },
      Tribune:   { price: 200, total: 1000, sold: 643  },
      Populaire: { price: 80,  total: 3000, sold: 1890 },
    },
  },
]

export const getMatch = (id) => MATCHES.find((m) => m.id === id) ?? null

export const getMinPrice = (match) =>
  Math.min(...Object.values(match.seats).map((s) => s.price))

export const getTotalSeats = (match) =>
  Object.values(match.seats).reduce((a, s) => a + s.total, 0)

export const getTotalSold = (match) =>
  Object.values(match.seats).reduce((a, s) => a + s.sold, 0)

export const getAvailableSeats = (match) =>
  getTotalSeats(match) - getTotalSold(match)

export const getFillPct = (match) =>
  getTotalSold(match) / getTotalSeats(match)
