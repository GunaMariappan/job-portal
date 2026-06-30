import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../Components/Spinner'
import toast from 'react-hot-toast'

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSavedJobs()
  }, [])

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/applications/saved-jobs/')
      setSavedJobs(res.data.results || res.data)
    } catch {
      toast.error('Failed to load saved jobs')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (jobId) => {
    try {
      await api.delete(`/applications/saved-jobs/${jobId}/`)
      setSavedJobs(savedJobs.filter(s => (s.job?.id || s.job) !== jobId))
      toast.success('Job removed from saved!')
    } catch {
      toast.error('Failed to remove job')
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">⭐ Saved Jobs</h1>
        <p className="text-gray-500 mt-1">Jobs you bookmarked for later</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="text-6xl mb-4">⭐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Jobs Yet</h3>
          <p className="text-gray-500 mb-6">Browse jobs and save the ones you like!</p>
          <Link to="/candidate/jobs"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((saved, i) => {
            const job = saved.job_details || saved.job
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
                        <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full">
                          🎯 {job?.experience_level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(job?.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200 text-sm font-medium">
                    🗑️ Remove
                  </button>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                  <span className="text-gray-600 font-medium text-sm">
                    {job?.salary_min && job?.salary_max
                      ? `💰 ₹${job.salary_min}L - ₹${job.salary_max}L`
                      : 'Salary Not Disclosed'}
                  </span>
                  <Link
                    to={`/candidate/jobs/${job?.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-200">
                    View & Apply →
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

export default SavedJobs