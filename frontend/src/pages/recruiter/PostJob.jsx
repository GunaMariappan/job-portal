import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const CATEGORIES = ['Technology', 'Healthcare', 'Finance', 'Design', 'Marketing', 'Engineering', 'Education', 'Startup', 'Other']
const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance', 'Remote']
const EXPERIENCE_LEVELS = ['Fresher', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager']

const PostJob = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    location: '',
    category: 'Technology',
    job_type: 'Full-Time',
    experience_level: 'Junior',
    salary_min: '',
    salary_max: '',
    vacancies: 1,
    description: '',
    requirements: '',
    skills_required: '',
    is_active: true,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.company_name || !formData.location || !formData.description) {
      toast.error('Please fill all required fields!')
      return
    }
    setLoading(true)
    try {
      await api.post('/jobs/', formData)
      toast.success('Job posted successfully! 🎉')
      navigate('/recruiter/dashboard')
    } catch (err) {
      const errors = err.response?.data
      if (errors) {
        Object.values(errors).forEach(msg => toast.error(Array.isArray(msg) ? msg[0] : msg))
      } else {
        toast.error('Failed to post job. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">📝 Post a New Job</h1>
        <p className="text-gray-500 mt-1">Fill in the details to attract the right candidates</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">📋 Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title}
                onChange={handleChange} placeholder="e.g. Senior React Developer"
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
              <input type="text" name="company_name" value={formData.company_name}
                onChange={handleChange} placeholder="e.g. TechCorp Pvt Ltd"
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location <span className="text-red-500">*</span></label>
              <input type="text" name="location" value={formData.location}
                onChange={handleChange} placeholder="e.g. Chennai, Tamil Nadu"
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Vacancies</label>
              <input type="number" name="vacancies" value={formData.vacancies}
                onChange={handleChange} min="1"
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">🎯 Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select name="category" value={formData.category}
                onChange={handleChange} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Job Type</label>
              <select name="job_type" value={formData.job_type}
                onChange={handleChange} className={inputClass}>
                {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Experience Level</label>
              <select name="experience_level" value={formData.experience_level}
                onChange={handleChange} className={inputClass}>
                {EXPERIENCE_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">💰 Salary Range (LPA)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Minimum Salary (LPA)</label>
              <input type="number" name="salary_min" value={formData.salary_min}
                onChange={handleChange} placeholder="e.g. 5"
                className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Maximum Salary (LPA)</label>
              <input type="number" name="salary_max" value={formData.salary_max}
                onChange={handleChange} placeholder="e.g. 10"
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">📄 Job Description</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description}
                onChange={handleChange} rows={5} placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Requirements</label>
              <textarea name="requirements" value={formData.requirements}
                onChange={handleChange} rows={4} placeholder="List the qualifications, certifications, and must-have skills..."
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Skills Required</label>
              <input type="text" name="skills_required" value={formData.skills_required}
                onChange={handleChange} placeholder="e.g. React, Node.js, Python, SQL (comma separated)"
                className={inputClass} />
            </div>
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Publish Job</h3>
              <p className="text-gray-500 text-sm">Make this job visible to candidates immediately</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active}
                onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/recruiter/dashboard')}
            className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors duration-200">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Posting...
              </>
            ) : '🚀 Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostJob