import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../Components/Spinner'
import toast from 'react-hot-toast'

const AppliedJobs = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications/my-applications/')
      setApplications(res.data.results || res.data)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700 border border-green-200'
    if (status === 'rejected') return 'bg-red-100 text-red-700 border border-red-200'
    if (status === 'reviewing') return 'bg-blue-100 text-blue-700 border border-blue-200'
    return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
  }

  const statusIcon = (status) => {
    if (status === 'accepted') return '✅'
    if (status === 'rejected') return '❌'
    if (status === 'reviewing') return '🔍'
    return '⏳'
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter)

  if (loading) return <Spinner />

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📋 Applied Jobs</h1>
        <p className="text-gray-500 mt-1">Track all your job applications</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: applications.length, status: 'all', color: 'bg-gray-50 text-gray-700' },
          { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, status: 'pending', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Reviewing', value: applications.filter(a => a.status === 'reviewing').length, status: 'reviewing', color: 'bg-blue-50 text-blue-700' },
          { label: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, status: 'accepted', color: 'bg-green-50 text-green-700' },
        ].map((stat, i) => (
          <button key={i} onClick={() => setFilter(stat.status)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              filter === stat.status ? 'border-indigo-400 shadow-md' : 'border-transparent'
            } ${stat.color}`}>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm font-medium mt-1">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Found</h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all' ? "You haven't applied to any jobs yet." : `No ${filter} applications found.`}
          </p>
          {filter === 'all' && (
            <Link to="/candidate/jobs"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app, i) => {
            const job = app.job_details || app.job
            return (
              <div key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                      🏢
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{job?.title}</h3>
                      <p className="text-gray-500 text-sm">{job?.company_name}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full">
                          📍 {job?.location}
                        </span>
                        <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full">
                          💼 {job?.job_type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1 ${statusColor(app.status)}`}>
                    {statusIcon(app.status)} {app.status}
                  </span>
                </div>

                {/* Cover Letter Preview */}
                {app.cover_letter && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{app.cover_letter}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-gray-400 text-xs">
                    Applied on {new Date(app.applied_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <Link to={`/candidate/jobs/${job?.id}`}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors">
                    View Job →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AppliedJobs