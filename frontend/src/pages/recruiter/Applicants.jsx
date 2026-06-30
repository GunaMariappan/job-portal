import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../Components/Spinner'
import toast from 'react-hot-toast'

const Applicants = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedApp, setSelectedApp] = useState(null)

  useEffect(() => {
    fetchApplicants()
  }, [id])

  const fetchApplicants = async () => {
    try {
      const [jobRes, appRes] = await Promise.all([
        api.get(`/jobs/${id}/`),
        api.get(`/applications/job-applications/${id}/`),
      ])
      setJob(jobRes.data)
      setApplications(appRes.data.results || appRes.data)
    } catch {
      toast.error('Failed to load applicants')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/`, { status })
      setApplications(applications.map(a =>
        a.id === appId ? { ...a, status } : a
      ))
      toast.success(`Application ${status}!`)
    } catch {
      toast.error('Failed to update status')
    }
  }

  const statusColor = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    if (status === 'reviewing') return 'bg-blue-100 text-blue-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter(a => a.status === filter)

  if (loading) return <Spinner />

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Header */}
      <button onClick={() => navigate('/recruiter/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
        ← Back to Dashboard
      </button>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold">{job?.title}</h1>
        <p className="text-purple-200 mt-1">{job?.company_name} • {job?.location}</p>
        <div className="mt-3 flex gap-4 text-sm">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            📨 {applications.length} Total Applicants
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            ✅ {applications.filter(a => a.status === 'accepted').length} Accepted
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map(status => (
          <button key={status} onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors duration-200 ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}>
            {status === 'all' ? `All (${applications.length})` : `${status} (${applications.filter(a => a.status === status).length})`}
          </button>
        ))}
      </div>

      {/* Applicants List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applicants Found</h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'No one has applied yet.' : `No ${filter} applications.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const candidate = app.candidate_details || app.candidate
            return (
              <div key={app.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold text-lg">
                        {candidate?.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{candidate?.full_name}</h3>
                      <p className="text-gray-500 text-sm">{candidate?.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {candidate?.profile?.location && (
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            📍 {candidate.profile.location}
                          </span>
                        )}
                        {candidate?.profile?.experience_years && (
                          <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                            💼 {candidate.profile.experience_years} yrs exp
                          </span>
                        )}
                        {candidate?.profile?.skills && (
                          <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full">
                            🛠️ {candidate.profile.skills.split(',').slice(0, 2).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                {/* Cover Letter */}
                {app.cover_letter && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-500 mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{app.cover_letter}</p>
                    {app.cover_letter.length > 150 && (
                      <button onClick={() => setSelectedApp(app)}
                        className="text-indigo-600 text-xs mt-1 hover:underline">
                        Read more →
                      </button>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <span className="text-gray-400 text-xs">
                    Applied {new Date(app.applied_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                  <div className="flex gap-2">
                    {candidate?.profile?.resume && (
                      <a href={candidate.profile.resume} target="_blank" rel="noreferrer"
                        className="text-indigo-600 border border-indigo-200 hover:bg-indigo-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        📄 Resume
                      </a>
                    )}
                    {app.status !== 'reviewing' && (
                      <button onClick={() => handleStatusChange(app.id, 'reviewing')}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        🔍 Review
                      </button>
                    )}
                    {app.status !== 'accepted' && (
                      <button onClick={() => handleStatusChange(app.id, 'accepted')}
                        className="bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        ✅ Accept
                      </button>
                    )}
                    {app.status !== 'rejected' && (
                      <button onClick={() => handleStatusChange(app.id, 'rejected')}
                        className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                        ❌ Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Cover Letter Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Cover Letter</h2>
                <p className="text-gray-500 text-sm">{selectedApp.candidate_details?.full_name}</p>
              </div>
              <button onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed max-h-80 overflow-y-auto">
              {selectedApp.cover_letter}
            </div>
            <button onClick={() => setSelectedApp(null)}
              className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Applicants