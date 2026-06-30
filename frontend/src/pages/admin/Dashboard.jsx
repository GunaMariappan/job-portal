import { useState, useEffect } from 'react'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [statsRes, usersRes, jobsRes, appsRes, reportsRes] = await Promise.all([
        api.get('/auth/admin-stats/'),
        api.get('/auth/admin-users/'),
        api.get('/jobs/admin-jobs/'),
        api.get('/applications/admin-applications/'),
        api.get('/applications/admin-reports/'),
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data.results || usersRes.data)
      setJobs(jobsRes.data.results || jobsRes.data)
      setApplications(appsRes.data.results || appsRes.data)
      setReports(reportsRes.data.results || reportsRes.data)
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUser = async (userId, isActive) => {
    try {
      await api.patch(`/auth/admin-users/${userId}/`, { is_active: !isActive })
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !isActive } : u))
      toast.success(`User ${isActive ? 'deactivated' : 'activated'}!`)
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Delete this job?')) return
    try {
      await api.delete(`/jobs/${jobId}/`)
      setJobs(jobs.filter(j => j.id !== jobId))
      toast.success('Job deleted!')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user permanently?')) return
    try {
      await api.delete(`/auth/admin-users/${userId}/`)
      setUsers(users.filter(u => u.id !== userId))
      toast.success('User deleted!')
    } catch {
      toast.error('Failed to delete user')
    }
  }

  // ✅ Report Actions
  const handleReportStatus = async (reportId, status) => {
    try {
      await api.patch(`/applications/admin-reports/${reportId}/`, { status })
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r))
      toast.success(`Report marked as ${status}!`)
    } catch {
      toast.error('Failed to update report')
    }
  }

  const handleDeleteReportedJob = async (reportId) => {
    if (!window.confirm('Delete this job and report permanently?')) return
    try {
      await api.delete(`/applications/admin-reports/${reportId}/`)
      setReports(reports.filter(r => r.id !== reportId))
      toast.success('Job and report deleted! 🗑️')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const statusColor = (status) => {
    if (status === 'accepted') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    if (status === 'reviewing') return 'bg-blue-100 text-blue-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  const reportStatusColor = (status) => {
    if (status === 'resolved') return 'bg-green-100 text-green-700'
    if (status === 'dismissed') return 'bg-gray-100 text-gray-600'
    if (status === 'reviewed') return 'bg-blue-100 text-blue-700'
    return 'bg-red-100 text-red-700'
  }

  const roleColor = (role) => {
    if (role === 'admin') return 'bg-red-100 text-red-700'
    if (role === 'recruiter') return 'bg-purple-100 text-purple-700'
    return 'bg-indigo-100 text-indigo-700'
  }

  const reasonLabel = (reason) => {
    const map = {
      fake_job: '🚫 Fake Job',
      inappropriate: '⚠️ Inappropriate',
      spam: '📧 Spam',
      wrong_salary: '💰 Wrong Salary',
      other: '📝 Other',
    }
    return map[reason] || reason
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white mb-8">
        <h1 className="text-2xl font-bold">⚙️ Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage users, jobs, applications and reports.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Users', value: stats.total_users || users.length, icon: '👥', color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Jobs', value: stats.total_jobs || jobs.length, icon: '💼', color: 'bg-purple-50 text-purple-600' },
          { label: 'Applications', value: stats.total_applications || applications.length, icon: '📨', color: 'bg-orange-50 text-orange-600' },
          { label: 'Recruiters', value: stats.total_recruiters || users.filter(u => u.role === 'recruiter').length, icon: '🏢', color: 'bg-green-50 text-green-600' },
          { label: 'Reports', value: reports.filter(r => r.status === 'pending').length, icon: '🚩', color: 'bg-red-50 text-red-600' },
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

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { key: 'overview', label: '📊 Overview' },
          { key: 'users', label: '👥 Users' },
          { key: 'jobs', label: '💼 Jobs' },
          { key: 'applications', label: '📨 Applications' },
          { key: 'reports', label: `🚩 Reports ${reports.filter(r => r.status === 'pending').length > 0 ? `(${reports.filter(r => r.status === 'pending').length})` : ''}` },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-200 ${
              activeTab === tab.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Recent Users</h2>
            <div className="space-y-3">
              {users.slice(0, 5).map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {user.full_name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{user.full_name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Recent Jobs</h2>
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{job.title}</div>
                    <div className="text-xs text-gray-400">{job.company_name} • {job.location}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {job.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">User Distribution</h2>
            <div className="space-y-3">
              {[
                { role: 'Candidates', count: users.filter(u => u.role === 'candidate').length, color: 'bg-indigo-500' },
                { role: 'Recruiters', count: users.filter(u => u.role === 'recruiter').length, color: 'bg-purple-500' },
                { role: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.role}</span>
                    <span className="font-semibold text-gray-800">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`}
                      style={{ width: `${users.length ? (item.count / users.length) * 100 : 0}%` }}>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reports Alert */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">🚩 Pending Reports</h2>
            {reports.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-gray-500 text-sm">No pending reports!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.filter(r => r.status === 'pending').slice(0, 4).map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{report.job_details?.title}</div>
                      <div className="text-xs text-red-500">{reasonLabel(report.reason)}</div>
                    </div>
                    <button onClick={() => setActiveTab('reports')}
                      className="text-xs text-red-600 font-medium hover:underline">
                      Review →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">All Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${roleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-xs">
                      {new Date(user.date_joined).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleUser(user.id, user.is_active)}
                          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                            user.is_active
                              ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}>
                          {user.is_active ? '🔒 Deactivate' : '✅ Activate'}
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">All Jobs ({jobs.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Job Title</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-800 text-sm">{job.title}</td>
                    <td className="py-4 px-4 text-gray-500 text-sm">{job.company_name}</td>
                    <td className="py-4 px-4 text-gray-500 text-sm">📍 {job.location}</td>
                    <td className="py-4 px-4">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        {job.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button onClick={() => handleDeleteJob(job.id)}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">All Applications ({applications.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Candidate</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Job</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Company</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800 text-sm">
                        {app.candidate_details?.full_name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-400">{app.candidate_details?.email}</div>
                    </td>
                    <td className="py-4 px-4 text-gray-700 text-sm font-medium">
                      {app.job_details?.title || 'N/A'}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-sm">
                      {app.job_details?.company_name || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-400 text-xs">
                      {new Date(app.applied_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ✅ Reports Tab */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">
            🚩 Job Reports ({reports.length})
            {reports.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                {reports.filter(r => r.status === 'pending').length} Pending
              </span>
            )}
          </h2>

          {reports.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reports!</h3>
              <p className="text-gray-500">Platform is clean — no job reports yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id}
                  className={`border rounded-xl p-5 transition-all duration-200 ${
                    report.status === 'pending'
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-100 bg-white'
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">

                      {/* Job Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-800">
                          {report.job_details?.title || 'Job Deleted'}
                        </span>
                        <span className="text-gray-400 text-sm">•</span>
                        <span className="text-gray-500 text-sm">
                          {report.job_details?.company_name}
                        </span>
                      </div>

                      {/* Reason */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-medium">
                          {reasonLabel(report.reason)}
                        </span>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${reportStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>

                      {/* Reporter */}
                      <div className="text-xs text-gray-400">
                        Reported by: <span className="font-medium text-gray-600">{report.candidate_name}</span>
                        {' '}• {new Date(report.reported_at).toLocaleDateString('en-IN')}
                      </div>

                      {/* Description */}
                      {report.description && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium mb-1">Details:</p>
                          <p className="text-sm text-gray-600">{report.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    {report.status === 'pending' && (
                      <button onClick={() => handleReportStatus(report.id, 'reviewed')}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                        🔍 Mark Reviewed
                      </button>
                    )}
                    {report.status !== 'resolved' && (
                      <button onClick={() => handleReportStatus(report.id, 'resolved')}
                        className="bg-green-50 text-green-600 hover:bg-green-100 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                        ✅ Resolve
                      </button>
                    )}
                    {report.status !== 'dismissed' && (
                      <button onClick={() => handleReportStatus(report.id, 'dismissed')}
                        className="bg-gray-50 text-gray-600 hover:bg-gray-100 text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
                        ❌ Dismiss
                      </button>
                    )}
                    <button onClick={() => handleDeleteReportedJob(report.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ml-auto">
                      🗑️ Delete Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard