import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import Spinner from '../../components/Spinner'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, fetchUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resumeUploading, setResumeUploading] = useState(false)
  const [profile, setProfile] = useState({
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience_years: '',
    education: '',
    linkedin_url: '',
    portfolio_url: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/auth/profile/')
      setProfile({
        phone: res.data.phone || '',
        location: res.data.location || '',
        bio: res.data.bio || '',
        skills: res.data.skills || '',
        experience_years: res.data.experience_years || '',
        education: res.data.education || '',
        linkedin_url: res.data.linkedin_url || '',
        portfolio_url: res.data.portfolio_url || '',
      })
    } catch {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/auth/profile/', profile)
      toast.success('Profile updated successfully!')
      fetchUser()
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files allowed!')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB')
      return
    }
    const formData = new FormData()
    formData.append('resume', file)
    setResumeUploading(true)
    try {
      await api.post('/auth/upload-resume/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Resume uploaded successfully!')
      fetchProfile()
    } catch {
      toast.error('Resume upload failed')
    } finally {
      setResumeUploading(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-2xl">
              {user?.full_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.full_name}</h1>
            <p className="text-indigo-200">{user?.email}</p>
            <span className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full mt-1 inline-block capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Resume Upload Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">📄 Resume</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-400 transition-colors duration-200">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-gray-500 text-sm mb-3">Upload your resume (PDF only, max 5MB)</p>
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                {resumeUploading ? 'Uploading...' : 'Choose PDF'}
                <input type="file" accept=".pdf" onChange={handleResumeUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-6">✏️ Edit Profile</h2>
            <form onSubmit={handleSave} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" name="phone" value={profile.phone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input type="text" name="location" value={profile.location} onChange={handleChange}
                    placeholder="Chennai, Tamil Nadu"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea name="bio" value={profile.bio} onChange={handleChange}
                  placeholder="Tell recruiters about yourself..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input type="text" name="skills" value={profile.skills} onChange={handleChange}
                  placeholder="Python, React, Django, SQL..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input type="number" name="experience_years" value={profile.experience_years} onChange={handleChange}
                    placeholder="2"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <input type="text" name="education" value={profile.education} onChange={handleChange}
                    placeholder="B.Tech Computer Science"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input type="url" name="linkedin_url" value={profile.linkedin_url} onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
                  <input type="url" name="portfolio_url" value={profile.portfolio_url} onChange={handleChange}
                    placeholder="https://yourportfolio.com"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                </div>
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : '💾 Save Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile