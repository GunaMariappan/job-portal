import { useState, useEffect } from 'react'
import api from '../../api/axios'
import JobCard from '../../components/JobCard'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'Technology', 'Healthcare', 'Finance', 'Design', 'Marketing', 'Engineering', 'Education']
const LOCATIONS = ['All', 'Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Remote']
const EXPERIENCE = ['All', 'Fresher', 'Junior', 'Mid', 'Senior', 'Lead']

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState([])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: 'All', location: 'All', experience: 'All' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchJobs()
    fetchSavedIds()
  }, [filters, page])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filters.category !== 'All') params.append('category', filters.category)
      if (filters.location !== 'All') params.append('location', filters.location)
      if (filters.experience !== 'All') params.append('experience_level', filters.experience)
      params.append('page', page)

      const res = await api.get(`/jobs/?${params.toString()}`)
      setJobs(res.data.results || res.data)
      setTotalPages(Math.ceil((res.data.count || res.data.length) / 10))
    } catch {
      toast.error('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchSavedIds = async () => {
    try {
      const res = await api.get('/applications/saved-jobs/')
      const saved = res.data.results || res.data
      setSavedIds(saved.map(s => s.job?.id || s.job))
    } catch {}
  }

  const handleSave = async (jobId) => {
    try {
      if (savedIds.includes(jobId)) {
        await api.delete(`/applications/saved-jobs/${jobId}/`)
        setSavedIds(savedIds.filter(id => id !== jobId))
        toast.success('Job removed from saved!')
      } else {
        await api.post('/applications/saved-jobs/', { job: jobId })
        setSavedIds([...savedIds, jobId])
        toast.success('Job saved!')
      }
    } catch {
      toast.error('Action failed. Try again.')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchJobs()
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Browse Jobs</h1>
        <p className="text-gray-500 mt-1">Find your perfect opportunity from thousands of listings</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by job title, company, or keyword..."
          className="flex-1 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
        />
        <button type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors duration-200 shadow-sm">
          🔍 Search
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Filters Sidebar */}
        <div className="lg:w-64 space-y-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-bold text-gray-800 mb-4">🔽 Filters</h3>

            {/* Category */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => handleFilterChange('category', cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-150 ${
                      filters.category === cat
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
              <div className="space-y-1">
                {LOCATIONS.map(loc => (
                  <button key={loc} onClick={() => handleFilterChange('location', loc)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-150 ${
                      filters.location === loc
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Experience</label>
              <div className="space-y-1">
                {EXPERIENCE.map(exp => (
                  <button key={exp} onClick={() => handleFilterChange('experience', exp)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-150 ${
                      filters.experience === exp
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}>
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1">
          {loading ? (
            <Spinner />
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
              <p className="text-gray-500">Try different keywords or filters</p>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-4">{jobs.length} jobs found</p>
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} onSave={handleSave} savedIds={savedIds} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-50 transition-colors">
                    ← Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1 ? 'bg-indigo-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-indigo-50'
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 disabled:opacity-50 transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default BrowseJobs