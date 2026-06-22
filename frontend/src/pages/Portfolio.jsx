import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import api from '../api/axios.js'

const ASSET_TYPES = ['Mutual Fund', 'Stock', 'ETF', 'Gold', 'Fixed Deposit', 'Others']

const ASSET_COLORS = {
  'Mutual Fund':    'bg-purple-900/40 text-purple-300',
  'Stock':          'bg-blue-900/40 text-blue-300',
  'ETF':            'bg-cyan-900/40 text-cyan-300',
  'Gold':           'bg-yellow-900/40 text-yellow-300',
  'Fixed Deposit':  'bg-green-900/40 text-green-300',
  'Others':         'bg-gray-700 text-gray-300',
}

const EMPTY_FORM = { fund_name: '', asset_type: 'Mutual Fund', investment_amount: '', current_value: '' }

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Portfolio() {
  const [portfolio, setPortfolio]     = useState([])
  const [form, setForm]               = useState(EMPTY_FORM)
  const [editId, setEditId]           = useState(null)
  const [editForm, setEditForm]       = useState({})
  const [loading, setLoading]         = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [message, setMessage]         = useState({ type: '', text: '' })

  const loadPortfolio = async () => {
    try {
      const res = await api.get('/portfolio/')
      setPortfolio(res.data)
    } catch {
      setMessage({ type: 'error', text: 'Failed to load portfolio.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadPortfolio() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      await api.post('/portfolio/', {
        ...form,
        investment_amount: parseFloat(form.investment_amount),
        current_value:     parseFloat(form.current_value)
      })
      setForm(EMPTY_FORM)
      setMessage({ type: 'success', text: 'Investment added successfully!' })
      loadPortfolio()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to add investment.' })
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (item) => {
    setEditId(item.id)
    setEditForm({
      fund_name:         item.fund_name,
      asset_type:        item.asset_type,
      investment_amount: item.investment_amount,
      current_value:     item.current_value
    })
  }

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleUpdate = async (id) => {
    try {
      await api.put(`/portfolio/${id}`, {
        ...editForm,
        investment_amount: parseFloat(editForm.investment_amount),
        current_value:     parseFloat(editForm.current_value)
      })
      setEditId(null)
      setMessage({ type: 'success', text: 'Investment updated!' })
      loadPortfolio()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Update failed.' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this investment?')) return
    try {
      await api.delete(`/portfolio/${id}`)
      setMessage({ type: 'success', text: 'Investment deleted.' })
      loadPortfolio()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete investment.' })
    }
  }

  const totalInvested     = portfolio.reduce((s, i) => s + i.investment_amount, 0)
  const totalCurrentValue = portfolio.reduce((s, i) => s + i.current_value, 0)
  const totalGainLoss     = totalCurrentValue - totalInvested
  const gainPct           = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : '0.00'

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-400 mt-1">Track and manage your investments</p>
        </div>

        {message.text && (
          <div className={`rounded-lg px-4 py-3 mb-6 text-sm ${
            message.type === 'success'
              ? 'bg-green-900/40 border border-green-600 text-green-300'
              : 'bg-red-900/40 border border-red-600 text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        {/* ── Summary Strip ── */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card border-l-4 border-yellow-500 py-4">
              <p className="text-gray-400 text-sm">Total Invested</p>
              <p className="text-white text-xl font-bold">{fmt(totalInvested)}</p>
            </div>
            <div className="card border-l-4 border-blue-500 py-4">
              <p className="text-gray-400 text-sm">Current Value</p>
              <p className="text-white text-xl font-bold">{fmt(totalCurrentValue)}</p>
            </div>
            <div className={`card border-l-4 py-4 ${totalGainLoss >= 0 ? 'border-green-500' : 'border-red-500'}`}>
              <p className="text-gray-400 text-sm">Gain / Loss</p>
              <p className={`text-xl font-bold ${totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalGainLoss >= 0 ? '+' : ''}{fmt(totalGainLoss)}
                <span className="text-sm font-normal ml-1">({gainPct}%)</span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Add Form ── */}
          <div className="card h-fit">
            <h2 className="text-lg font-bold text-white mb-5">Add Investment</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label">Fund / Stock Name</label>
                <input type="text" name="fund_name"
                  value={form.fund_name} onChange={handleChange}
                  placeholder="e.g. HDFC Nifty 50" className="input-field" required />
              </div>
              <div>
                <label className="label">Asset Type</label>
                <select name="asset_type" value={form.asset_type} onChange={handleChange} className="input-field">
                  {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Investment Amount (₹)</label>
                <input type="number" name="investment_amount"
                  value={form.investment_amount} onChange={handleChange}
                  placeholder="100000" min="1" className="input-field" required />
              </div>
              <div>
                <label className="label">Current Value (₹)</label>
                <input type="number" name="current_value"
                  value={form.current_value} onChange={handleChange}
                  placeholder="120000" min="0" className="input-field" required />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Adding...' : '+ Add Investment'}
              </button>
            </form>
          </div>

          {/* ── Investments List ── */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              </div>
            ) : portfolio.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">📈</p>
                <p className="text-gray-400">No investments yet. Add your first!</p>
              </div>
            ) : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700 bg-gray-800/50">
                      <th className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-3">Fund / Stock</th>
                      <th className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-3">Type</th>
                      <th className="text-right text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-3">Invested</th>
                      <th className="text-right text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-3">Current</th>
                      <th className="text-right text-gray-400 text-xs font-semibold uppercase tracking-wider px-4 py-3">P&L</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((item) => {
                      const gainLoss = item.current_value - item.investment_amount
                      const pct      = ((gainLoss / item.investment_amount) * 100).toFixed(1)
                      return (
                        <tr key={item.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition">
                          {editId === item.id ? (
                            <td colSpan="6" className="px-4 py-4">
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <label className="label">Fund Name</label>
                                  <input type="text" name="fund_name" value={editForm.fund_name}
                                    onChange={handleEditChange} className="input-field" />
                                </div>
                                <div>
                                  <label className="label">Asset Type</label>
                                  <select name="asset_type" value={editForm.asset_type}
                                    onChange={handleEditChange} className="input-field">
                                    {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label className="label">Invested (₹)</label>
                                  <input type="number" name="investment_amount" value={editForm.investment_amount}
                                    onChange={handleEditChange} className="input-field" />
                                </div>
                                <div>
                                  <label className="label">Current Value (₹)</label>
                                  <input type="number" name="current_value" value={editForm.current_value}
                                    onChange={handleEditChange} className="input-field" />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdate(item.id)} className="btn-primary">Save</button>
                                <button onClick={() => setEditId(null)} className="btn-secondary">Cancel</button>
                              </div>
                            </td>
                          ) : (
                            <>
                              <td className="px-4 py-4 text-white text-sm font-medium">{item.fund_name}</td>
                              <td className="px-4 py-4">
                                <span className={`badge ${ASSET_COLORS[item.asset_type] || 'bg-gray-700 text-gray-300'}`}>
                                  {item.asset_type}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right text-sm text-gray-300">{fmt(item.investment_amount)}</td>
                              <td className="px-4 py-4 text-right text-sm text-white font-medium">{fmt(item.current_value)}</td>
                              <td className="px-4 py-4 text-right text-sm">
                                <span className={gainLoss >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                                  {gainLoss >= 0 ? '+' : ''}{fmt(gainLoss)}<br />
                                  <span className="text-xs font-normal">({pct}%)</span>
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-1 justify-end">
                                  <button onClick={() => startEdit(item)}
                                    className="text-indigo-400 hover:text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-700 hover:bg-indigo-900/30 transition">
                                    Edit
                                  </button>
                                  <button onClick={() => handleDelete(item.id)}
                                    className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded border border-red-700 hover:bg-red-900/30 transition">
                                    Del
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
