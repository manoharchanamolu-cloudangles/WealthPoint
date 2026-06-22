import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import api from '../api/axios.js'

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`card border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [profile, setProfile]     = useState(null)
  const [goals, setGoals]         = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, goalsRes, portfolioRes] = await Promise.allSettled([
          api.get('/profile/'),
          api.get('/goals/'),
          api.get('/portfolio/')
        ])
        if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data)
        if (goalsRes.status === 'fulfilled')   setGoals(goalsRes.value.data)
        if (portfolioRes.status === 'fulfilled') setPortfolio(portfolioRes.value.data)
      } catch (err) {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const totalInvested     = portfolio.reduce((s, i) => s + i.investment_amount, 0)
  const totalCurrentValue = portfolio.reduce((s, i) => s + i.current_value, 0)
  const totalGainLoss     = totalCurrentValue - totalInvested
  const gainPct           = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : 0

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  const goalTypeColors = {
    'Retirement':       'bg-purple-900/40 text-purple-300',
    'House Purchase':   'bg-blue-900/40 text-blue-300',
    'Child Education':  'bg-yellow-900/40 text-yellow-300',
    'Emergency Fund':   'bg-red-900/40 text-red-300',
    'Vacation':         'bg-green-900/40 text-green-300',
    'Custom Goal':      'bg-gray-700 text-gray-300',
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Your complete financial overview</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* ── Summary Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Goals"        value={goals.length}           icon="🎯" color="border-indigo-500" />
              <StatCard label="Total Investments"  value={portfolio.length}       icon="📊" color="border-blue-500"   />
              <StatCard label="Total Invested"     value={fmt(totalInvested)}     icon="💰" color="border-yellow-500" />
              <StatCard label="Current Value"      value={fmt(totalCurrentValue)} icon="📈" color="border-green-500"  />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Profile Section ── */}
              <div className="card">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>👤</span> Profile
                </h2>
                {profile ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Name</span>
                      <span className="text-white text-sm font-medium">{profile.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Age</span>
                      <span className="text-white text-sm font-medium">{profile.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Occupation</span>
                      <span className="text-white text-sm font-medium">{profile.occupation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Annual Income</span>
                      <span className="text-white text-sm font-medium">{fmt(profile.annual_income)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Monthly Savings</span>
                      <span className="text-white text-sm font-medium">{fmt(profile.monthly_savings)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No profile yet</p>
                    <a href="/profile" className="text-indigo-400 text-sm mt-2 block hover:underline">Complete your profile →</a>
                  </div>
                )}
              </div>

              {/* ── Goals Summary ── */}
              <div className="card">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎯</span> Goals <span className="ml-auto text-xs bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded-full">{goals.length} total</span>
                </h2>
                {goals.length > 0 ? (
                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {goals.map((g) => (
                      <div key={g.id} className="bg-gray-700/40 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-white text-sm font-medium">{g.goal_name}</p>
                          <span className={`badge text-xs ${goalTypeColors[g.goal_type] || 'bg-gray-700 text-gray-300'}`}>
                            {g.goal_type}
                          </span>
                        </div>
                        <p className="text-indigo-300 text-sm font-semibold mt-1">{fmt(g.target_amount)}</p>
                        <p className="text-gray-500 text-xs mt-0.5">Target: {g.target_date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No goals yet</p>
                    <a href="/goals" className="text-indigo-400 text-sm mt-2 block hover:underline">Create your first goal →</a>
                  </div>
                )}
              </div>

              {/* ── Portfolio Summary ── */}
              <div className="card">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>📈</span> Portfolio
                </h2>
                {portfolio.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Invested</span>
                        <span className="text-white font-medium">{fmt(totalInvested)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Current Value</span>
                        <span className="text-white font-medium">{fmt(totalCurrentValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-gray-700 pt-2 mt-2">
                        <span className="text-gray-400">Gain / Loss</span>
                        <span className={`font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {totalGainLoss >= 0 ? '+' : ''}{fmt(totalGainLoss)} ({gainPct}%)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {portfolio.map((p) => (
                        <div key={p.id} className="flex justify-between items-center bg-gray-700/40 rounded-lg px-3 py-2">
                          <div>
                            <p className="text-white text-xs font-medium">{p.fund_name}</p>
                            <p className="text-gray-500 text-xs">{p.asset_type}</p>
                          </div>
                          <span className={`text-xs font-semibold ${p.current_value >= p.investment_amount ? 'text-green-400' : 'text-red-400'}`}>
                            {fmt(p.current_value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">No investments yet</p>
                    <a href="/portfolio" className="text-indigo-400 text-sm mt-2 block hover:underline">Add your first investment →</a>
                  </div>
                )}
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  )
}
