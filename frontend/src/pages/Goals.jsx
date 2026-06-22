import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import api from '../api/axios.js'

const GOAL_TYPES = ['Retirement', 'House Purchase', 'Child Education', 'Emergency Fund', 'Vacation', 'Custom Goal']

const GOAL_TYPE_COLORS = {
  'Retirement':       'bg-purple-900/40 text-purple-300 border-purple-700',
  'House Purchase':   'bg-blue-900/40 text-blue-300 border-blue-700',
  'Child Education':  'bg-yellow-900/40 text-yellow-300 border-yellow-700',
  'Emergency Fund':   'bg-red-900/40 text-red-300 border-red-700',
  'Vacation':         'bg-green-900/40 text-green-300 border-green-700',
  'Custom Goal':      'bg-gray-700 text-gray-300 border-gray-600',
}

const EMPTY_FORM = { goal_name: '', goal_type: 'Retirement', target_amount: '', target_date: '' }

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Goals() {
  const [goals, setGoals]         = useState([])
  const [form, setForm]           = useState(EMPTY_FORM)
  const [editId, setEditId]       = useState(null)
  const [editForm, setEditForm]   = useState({})
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage]     = useState({ type: '', text: '' })

  const loadGoals = async () => {
    try {
      const res = await api.get('/goals/')
      setGoals(res.data)
    } catch {
      setMessage({ type: 'error', text: 'Failed to load goals.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGoals() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage({ type: '', text: '' })
    try {
      await api.post('/goals/', {
        ...form,
        target_amount: parseFloat(form.target_amount)
      })
      setForm(EMPTY_FORM)
      setMessage({ type: 'success', text: 'Goal added successfully!' })
      loadGoals()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to add goal.' })
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (goal) => {
    setEditId(goal.id)
    setEditForm({
      goal_name:     goal.goal_name,
      goal_type:     goal.goal_type,
      target_amount: goal.target_amount,
      target_date:   goal.target_date
    })
  }

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleUpdate = async (id) => {
    try {
      await api.put(`/goals/${id}`, {
        ...editForm,
        target_amount: parseFloat(editForm.target_amount)
      })
      setEditId(null)
      setMessage({ type: 'success', text: 'Goal updated!' })
      loadGoals()
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Update failed.' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return
    try {
      await api.delete(`/goals/${id}`)
      setMessage({ type: 'success', text: 'Goal deleted.' })
      loadGoals()
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete goal.' })
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Financial Goals</h1>
          <p className="text-gray-400 mt-1">Plan and track your financial milestones</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Add Goal Form ── */}
          <div className="card h-fit">
            <h2 className="text-lg font-bold text-white mb-5">Add New Goal</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label">Goal Name</label>
                <input
                  type="text" name="goal_name"
                  value={form.goal_name} onChange={handleChange}
                  placeholder="e.g. Buy a House" className="input-field" required
                />
              </div>
              <div>
                <label className="label">Goal Type</label>
                <select name="goal_type" value={form.goal_type} onChange={handleChange} className="input-field">
                  {GOAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Target Amount (₹)</label>
                <input
                  type="number" name="target_amount"
                  value={form.target_amount} onChange={handleChange}
                  placeholder="5000000" min="1" className="input-field" required
                />
              </div>
              <div>
                <label className="label">Target Date</label>
                <input
                  type="date" name="target_date"
                  value={form.target_date} onChange={handleChange}
                  className="input-field" required
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Adding...' : '+ Add Goal'}
              </button>
            </form>
          </div>

          {/* ── Goals List ── */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              </div>
            ) : goals.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-gray-400">No goals yet. Add your first goal!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="card">
                    {editId === goal.id ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">Goal Name</label>
                            <input type="text" name="goal_name" value={editForm.goal_name}
                              onChange={handleEditChange} className="input-field" />
                          </div>
                          <div>
                            <label className="label">Goal Type</label>
                            <select name="goal_type" value={editForm.goal_type}
                              onChange={handleEditChange} className="input-field">
                              {GOAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">Target Amount (₹)</label>
                            <input type="number" name="target_amount" value={editForm.target_amount}
                              onChange={handleEditChange} className="input-field" />
                          </div>
                          <div>
                            <label className="label">Target Date</label>
                            <input type="date" name="target_date" value={editForm.target_date}
                              onChange={handleEditChange} className="input-field" />
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => handleUpdate(goal.id)} className="btn-primary">Save</button>
                          <button onClick={() => setEditId(null)} className="btn-secondary">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{goal.goal_name}</h3>
                            <span className={`badge border ${GOAL_TYPE_COLORS[goal.goal_type] || 'bg-gray-700 text-gray-300'}`}>
                              {goal.goal_type}
                            </span>
                          </div>
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span className="text-gray-400">Target Amount </span>
                              <span className="text-indigo-300 font-semibold">{fmt(goal.target_amount)}</span>
                            </div>
                            <div>
                              <span className="text-gray-400">Target Date </span>
                              <span className="text-white">{goal.target_date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => startEdit(goal)}
                            className="text-indigo-400 hover:text-indigo-300 text-sm px-3 py-1.5 rounded-lg border border-indigo-700 hover:bg-indigo-900/30 transition">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(goal.id)}
                            className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-lg border border-red-700 hover:bg-red-900/30 transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
