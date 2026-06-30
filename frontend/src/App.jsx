import { Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import ProtectedRoute from './Components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import CandidateDashboard from './pages/Candidate/Dashboard'
import Profile from './pages/Candidate/Profile'
import BrowseJobs from './pages/Candidate/BowseJobs'
import JobDetails from './pages/Candidate/JobDetails'
import SavedJobs from './pages/Candidate/SavedJobs'
import AppliedJobs from './pages/Candidate/AppliedJobs'

import RecruiterDashboard from './pages/Recruiter/Dashboard'
import PostJob from './pages/Recruiter/PostJob'
import EditJob from './pages/Recruiter/EditJob'
import Applicants from './pages/Recruiter/Applicants'

import AdminDashboard from './pages/Admin/Dashboard'

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={
            <ProtectedRoute roles={['candidate']}>
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute roles={['candidate']}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute roles={['candidate']}>
              <BrowseJobs />
            </ProtectedRoute>
          } />
          <Route path="/candidate/jobs/:id" element={
            <ProtectedRoute roles={['candidate']}>
              <JobDetails />
            </ProtectedRoute>
          } />
          <Route path="/candidate/saved-jobs" element={
            <ProtectedRoute roles={['candidate']}>
              <SavedJobs />
            </ProtectedRoute>
          } />
          <Route path="/candidate/applied-jobs" element={
            <ProtectedRoute roles={['candidate']}>
              <AppliedJobs />
            </ProtectedRoute>
          } />

          {/* Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute roles={['recruiter']}>
              <RecruiterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <ProtectedRoute roles={['recruiter']}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/edit-job/:id" element={
            <ProtectedRoute roles={['recruiter']}>
              <EditJob />
            </ProtectedRoute>
          } />
          <Route path="/recruiter/applicants/:id" element={
            <ProtectedRoute roles={['recruiter']}>
              <Applicants />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App