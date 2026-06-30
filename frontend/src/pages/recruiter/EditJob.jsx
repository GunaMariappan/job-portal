import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const CATEGORIES = ['Technology', 'Healthcare', 'Finance', 'Design', 'Marketing', 'Engineering', 'Education', 'Startup', 'Other']
const JOB_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance', 'Remote']
const EXPERIENCE_LEVELS = ['Fresher', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager']

const EditJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '', company_name: '', location: '', category: 'Technology',
    job_type: 'Full-Time', experience_level: 'Junior', salary_min: '',
    salary_max: '', vacancies: 1, description: '', requirements: '',
    skills_required: '', is_active: true,
  })

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}/`)
      setFormData({
        title: res.data.title || '',
        company_name: res.data.company_name || '',
        location: res.data.location || '',
        category: res.data.category || 'Technology',
        job_type: res.data.job_type || 'Full-Time',
        experience_level: res.data.experience_level || 'Junior',
        salary_min: res.data.salary_min || '',
        salary_max: res.data.salary_max || '',
        vacancies: res.data.vacancies || 1,
        description: res.data.description || '',
        requirements: res.data.requirements || '',
        skills_required: res.data.skills_required || '',
        is_active: res.data.is_active ?? true,
      })
    } catch {
      toast.error('Failed to load job')
      navigate('/recruiter/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required!')
      return
    }
    setSaving(true)
    try {
      await api.put(`/jobs/${id}/`, formData)
      toast.success('Job updated successfully!')
      navigate('/recruiter/dashboard')
    } catch {
      toast.error('Failed to update job')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1"

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">✏️ Edit Job</h1>
        <p className="text-gray-500 mt-1">Update your job posting details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">📋 Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Title <span className="text-red-500">*</span></label>
              <input type="text" name="title" value={formData.title}
                onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Company Name</label>
              <input type="text" name="company_name" value={formData.company_name}
                onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" name="location" value={formData.location}
                onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Vacancies</label>
              <input type="number" name="vacancies" value={formData.vacancies}
                onChange={handleChange} min="1" className={inputClass} />
            </div>
          </div>
        </div>

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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">💰 Salary Range (LPA)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Min Salary</label>
              <input type="number" name="salary_min" value={formData.salary_min}
                onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Salary</label>
              <input type="number" name="salary_max" value={formData.salary_max}
                onChange={handleChange} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-800 mb-5">📄 Job Description</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Description <span className="text-red-500">*</span></label>
              <textarea name="description" value={formData.description}
                onChange={handleChange} rows={5}
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Requirements</label>
              <textarea name="requirements" value={formData.requirements}
                onChange={handleChange} rows={4}
                className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className={labelClass}>Skills Required</label>
              <input type="text" name="skills_required" value={formData.skills_required}
                onChange={handleChange} placeholder="React, Node.js, Python..."
                className={inputClass} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Job Status</h3>
              <p className="text-gray-500 text-sm">Toggle to activate or deactivate this job</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active}
                onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => navigate('/recruiter/dashboard')}
            className="flex-1 border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : '💾 Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditJob