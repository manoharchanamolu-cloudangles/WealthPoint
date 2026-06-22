import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar.jsx'
import api from '../api/axios.js'

const OCCUPATIONS = ['Software Engineer', 'Doctor', 'Lawyer', 'Business Owner', 'Teacher', 'Accountant', 'Other']

export default function Profile() {
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    occupation: '',
    annual_income: '',
    monthly_savings: ''
  })
  const [exists, setExists]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [message, setMessage]   = useState({ type: '', text: '' })

  useEffect(() => {
    api.get('/profile/')
      .then((res) => {
        setForm({
          full_name:       res.data.full_name,
          age:             res.data.age,
          occupation:      res.data.occupation,
          annual_income:   res.data.annual_income,
          monthly_savings: res.data.monthly_savings
        })
        setExists(true)
      })
      .catch(() => setExists(false))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setMessage({ type: '', text: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    try {
      const payload = {
        ...form,
        age:             parseInt(form.age),
        annual_income:   parseFloat(form.annual_income),
        monthly_savings: parseFloat(form.monthly_savings)
      }
      if (exists) {
        await api.put('/profile/', payload)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        await api.post('/profile/', payload)
        setExists(true)
        setMessage({ type: 'success', text: 'Profile saved successfully!' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to save profile.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your personal and financial information</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="max-w-xl">
            <div className="card">
              <h2 className="text-lg font-bold text-white mb-6">
                {exists ? 'Update Profile' : 'Complete Your Profile'}
              </h2>

              {message.text && (
                <div className={`rounded-lg px-4 py-3 mb-4 text-sm ${
                  message.type === 'success'
                    ? 'bg-green-900/40 border border-green-600 text-green-300'
                    : 'bg-red-900/40 border border-red-600 text-red-300'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text" name="full_name"
                    value={form.full_name} onChange={handleChange}
                    placeholder="John Doe" className="input-field" required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Age</label>
                    <input
                      type="number" name="age"
                      value={form.age} onChange={handleChange}
                      placeholder="30" min="18" max="100"
                      className="input-field" required
                    />
                  </div>
                  <div>
                    <label className="label">Occupation</label>
                    <input
                      type="text" name="occupation"
                      value={form.occupation} onChange={handleChange}
                      placeholder="Software Engineer"
                      className="input-field" required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Annual Income (₹)</label>
                  <input
                    type="number" name="annual_income"
                    value={form.annual_income} onChange={handleChange}
                    placeholder="1200000" min="0"
                    className="input-field" required
                  />
                </div>

                <div>
                  <label className="label">Monthly Savings (₹)</label>
                  <input
                    type="number" name="monthly_savings"
                    value={form.monthly_savings} onChange={handleChange}
                    placeholder="20000" min="0"
                    className="input-field" required
                  />
                </div>

                <button type="submit" disabled={saving} className="btn-primary w-full">
                  {saving ? 'Saving...' : exists ? 'Update Profile' : 'Save Profile'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
