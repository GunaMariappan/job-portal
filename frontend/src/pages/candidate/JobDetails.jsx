import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const REPORT_REASONS = [
  { value: 'fake_job', label: '🚫 Fake Job' },
  { value: 'inappropriate', label: '⚠️ Inappropriate Content' },
  { value: 'spam', label: '📧 Spam' },
  { value: 'wrong_salary', label: '💰 Wrong Salary Info' },
  { value: 'other', label: '📝 Other' },
]

const JobDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Report states
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportDescription, setReportDescription] = useState('')
  const [reporting, setReporting] = useState(false)
  const [reported, setReported] = useState(false)

  useEffect(() => {
    fetchJob()
    checkStatus()
  }, [id])

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}/`)
      setJob(res.data)
    } catch {
      toast.error('Failed to load job details')
      navigate('/candidate/jobs')
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    try {
      const [appliedRes, savedRes] = await Promise.all([
        api.get('/applications/my-applications/'),
        api.get('/applications/saved-jobs/'),
      ])
      const applications = appliedRes.data.results || appliedRes.data
      const savedJobs = savedRes.data.results || savedRes.data
      setApplied(applications.some(a => a.job?.id === parseInt(id) || a.job === parseInt(id)))
      setSaved(savedJobs.some(s => s.job?.id === parseInt(id) || s.job === parseInt(id)))
    } catch {}
  }

  const handleApply = async () => {
    if (applied) return
    setApplying(true)
    try {
      await api.post('/applications/', {
        job: id,
        cover_letter: coverLetter,
      })
      setApplied(true)
      setShowModal(false)
      toast.success('Application submitted successfully! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to apply. Try again.')
    } finally {
      setApplying(false)
    }
  }

  const handleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/applications/saved-jobs/${id}/`)
        setSaved(false)
        toast.success('Job removed from saved!')
      } else {
        await api.post('/applications/saved-jobs/', { job: id })
        setSaved(true)
        toast.success('Job saved! ⭐')
      }
    } catch {
      toast.error('Action failed. Try again.')
    }
  }

  const handleReport = async () => {
    if (!reportReason) {
      toast.error('Please select a reason!')
      return
    }
    setReporting(true)
    try {
      await api.post('/applications/report-job/', {
        job: id,
        reason: reportReason,
        description: reportDescription,
      })
      setReported(true)
      setShowReportModal(false)
      toast.success('Job reported successfully! Admin will review it. 🚩')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Already reported or failed!')
    } finally {
      setReporting(false)
    }
  }

  if (loading) return <Spinner />
  if (!job) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Back Button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
        ← Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center text-3xl">
                  🏢
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                  <p className="text-gray-500 mt-1">{job.company_name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                      📍 {job.location}
                    </span>
                    <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                      💼 {job.job_type}
                    </span>
                    <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                      🎯 {job.experience_level}
                    </span>
                    <span className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">
                      📂 {job.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* 🚩 Report Button */}
              <button
                onClick={() => reported ? null : setShowReportModal(true)}
                disabled={reported}
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                  reported
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 text-red-500 hover:bg-red-100'
                }`}>
                🚩 {reported ? 'Reported' : 'Report Job'}
              </button>
            </div>

            {/* Salary */}
            {(job.salary_min || job.salary_max) && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-semibold">
                  💰 ₹{job.salary_min}L - ₹{job.salary_max}L per annum
                </span>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📋 Job Description</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">✅ Requirements</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Skills */}
          {job.skills_required && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">🛠️ Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.split(',').map((skill, i) => (
                  <span key={i}
                    className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4">Apply for this Job</h3>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Posted</span>
                <span className="font-medium">{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Job Type</span>
                <span className="font-medium">{job.job_type}</span>
              </div>
              <div className="flex justify-between">
                <span>Experience</span>
                <span className="font-medium">{job.experience_level}</span>
              </div>
              <div className="flex justify-between">
                <span>Openings</span>
                <span className="font-medium">{job.vacancies || 1}</span>
              </div>
            </div>

            <button
              onClick={() => applied ? null : setShowModal(true)}
              disabled={applied}
              className={`w-full font-semibold py-3 rounded-xl transition-colors duration-200 mb-3 ${
                applied
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}>
              {applied ? '✅ Already Applied' : '🚀 Apply Now'}
            </button>

            <button
              onClick={handleSave}
              className={`w-full font-semibold py-3 rounded-xl border-2 transition-colors duration-200 ${
                saved
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                  : 'border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
              }`}>
              {saved ? '★ Saved' : '☆ Save Job'}
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Apply for {job.title}</h2>
            <p className="text-gray-500 text-sm mb-5">{job.company_name}</p>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a brief cover letter..."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleApply} disabled={applying}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {applying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🚩 Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">

            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">🚩 Report Job</h2>
                <p className="text-gray-500 text-sm mt-1">{job.title} — {job.company_name}</p>
              </div>
              <button onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            {/* Reason Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setReportReason(r.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      reportReason === r.value
                        ? 'border-red-400 bg-red-50 text-red-700'
                        : 'border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50'
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Explain why you're reporting this job..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button onClick={() => setShowReportModal(false)}
                className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors">
                Cancel
              </button>
              <button onClick={handleReport} disabled={reporting || !reportReason}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {reporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Reporting...
                  </>
                ) : '🚩 Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetails