import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const RecruiterDashboard = () => {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({ total_jobs: 0, total_applications: 0, pending: 0, accepted: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        api.get('/jobs/my-jobs/'),
        api.get('/applications/recruiter-stats/'),
      ])
      setJobs(jobsRes.data.results || jobsRes.data)
      setStats(statsRes.data)
    } catch {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await api.delete(`/jobs/${jobId}/`)
      setJobs(jobs.filter(j => j.id !== jobId))
      toast.success('Job deleted successfully!')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const handleToggleStatus = async (job) => {
    try {
      await api.patch(`/jobs/${job.id}/`, { is_active: !job.is_active })
      setJobs(jobs.map(j => j.id === job.id ? { ...j, is_active: !j.is_active } : j))
      toast.success(`Job ${job.is_active ? 'deactivated' : 'activated'}!`)
    } catch {
      toast.error('Failed to update job status')
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome, {user?.full_name}! 🏢
        </h1>
        <p className="text-purple-200">Manage your job postings and find the best candidates.</p>
        <div className="mt-4">
          <Link to="/recruiter/post-job"
            className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-5 py-2 rounded-lg text-sm transition-colors duration-200 inline-block">
            + Post New Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: stats.total_jobs || jobs.length, icon: '💼', color: 'bg-blue-50 text-blue-600' },
          { label: 'Applications', value: stats.total_applications || 0, icon: '📨', color: 'bg-purple-50 text-purple-600' },
          { label: 'Pending', value: stats.pending || 0, icon: '⏳', color: 'bg-orange-50 text-orange-600' },
          { label: 'Accepted', value: stats.accepted || 0, icon: '✅', color: 'bg-green-50 text-green-600' },
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

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-800">My Job Postings</h2>
          <Link to="/recruiter/post-job"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
            + Post Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">💼</div>
            <p className="text-gray-500 mb-4">No jobs posted yet.</p>
            <Link to="/recruiter/post-job"
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Job Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Applicants</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-800 text-sm">{job.title}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{job.category}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm">📍 {job.location}</td>
                    <td className="py-4 px-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                        {job.job_type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button onClick={() => handleToggleStatus(job)}
                        className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                          job.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        {job.is_active ? '● Active' : '○ Inactive'}
                      </button>
                    </td>
                    <td className="py-4 px-4">
                      <Link to={`/recruiter/applicants/${job.id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        {job.application_count || 0} applicants →
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link to={`/recruiter/edit-job/${job.id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                          ✏️ Edit
                        </Link>
                        <button onClick={() => handleDelete(job.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard