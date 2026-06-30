import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import Spinner from '../../Components/Spinner'
import toast from 'react-hot-toast'

const CandidateDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    applied: 0,
    saved: 0,
    pending: 0,
    accepted: 0,
  })
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [appliedRes, savedRes] = await Promise.all([
        api.get('/applications/my-applications/'),
        api.get('/applications/saved-jobs/'),
      ])

      const applications = appliedRes.data.results || appliedRes.data
      const saved = savedRes.data.results || savedRes.data

      setStats({
        applied: applications.length,
        saved: saved.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length,
      })
      setRecentApplications(applications.slice(0, 5))
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.full_name}! 👋
        </h1>
        <p className="text-indigo-200">Track your job applications and find new opportunities.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/candidate/jobs"
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-5 py-2 rounded-lg text-sm transition-colors duration-200">
            Browse Jobs →
          </Link>
          <Link to="/candidate/profile"
            className="border border-white text-white hover:bg-white hover:text-indigo-600 font-semibold px-5 py-2 rounded-lg text-sm transition-colors duration-200">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applied', value: stats.applied, icon: '📨', color: 'bg-blue-50 text-blue-600' },
          { label: 'Saved Jobs', value: stats.saved, icon: '⭐', color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'bg-orange-50 text-orange-600' },
          { label: 'Accepted', value: stats.accepted, icon: '✅', color: 'bg-green-50 text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '🔍', label: 'Browse Jobs', desc: 'Find new opportunities', path: '/candidate/jobs', color: 'indigo' },
          { icon: '⭐', label: 'Saved Jobs', desc: 'Jobs you bookmarked', path: '/candidate/saved-jobs', color: 'yellow' },
          { icon: '📋', label: 'Applied Jobs', desc: 'Track your applications', path: '/candidate/applied-jobs', color: 'green' },
        ].map((action, i) => (
          <Link key={i} to={action.path}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all duration-200 flex items-center gap-4">
            <div className="text-3xl">{action.icon}</div>
            <div>
              <div className="font-semibold text-gray-800">{action.label}</div>
              <div className="text-gray-500 text-sm">{action.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-gray-800">Recent Applications</h2>
          <Link to="/candidate/applied-jobs"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No applications yet.</p>
            <Link to="/candidate/jobs"
              className="mt-3 inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApplications.map((app, i) => (
              <div key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <div className="font-semibold text-gray-800">{app.job?.title}</div>
                  <div className="text-gray-500 text-sm">{app.job?.company_name} • {app.job?.location}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateDashboard