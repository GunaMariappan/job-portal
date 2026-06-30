import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import CandidateDashboard from './pages/candidate/Dashboard'
import Profile from './pages/candidate/Profile'
import BrowseJobs from './pages/candidate/BowseJobs'
import JobDetails from './pages/candidate/JobDetails'
import SavedJobs from './pages/candidate/SavedJobs'
import AppliedJobs from './pages/candidate/AppliedJobs'

import RecruiterDashboard from './pages/recruiter/Dashboard'
import PostJob from './pages/recruiter/PostJob'
import EditJob from './pages/recruiter/EditJob'
import Applicants from './pages/recruiter/Applicants'

import AdminDashboard from './pages/admin/Dashboard'

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/candidate/dashboard" element={
            <ProtectedRoute roles={['candidate']}><CandidateDashboard /></ProtectedRoute>
          } />
          <Route path="/candidate/profile" element={
            <ProtectedRoute roles={['candidate']}><Profile /></ProtectedRoute>
          } />
          <Route path="/candidate/jobs" element={
            <ProtectedRoute roles={['candidate']}><BrowseJobs /></ProtectedRoute>
          } />
          <Route path="/candidate/jobs/:id" element={
            <ProtectedRoute roles={['candidate']}><JobDetails /></ProtectedRoute>
          } />
          <Route path="/candidate/saved-jobs" element={
            <ProtectedRoute roles={['candidate']}><SavedJobs /></ProtectedRoute>
          } />
          <Route path="/candidate/applied-jobs" element={
            <ProtectedRoute roles={['candidate']}><AppliedJobs /></ProtectedRoute>
          } />

          <Route path="/recruiter/dashboard" element={
            <ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>
          } />
          <Route path="/recruiter/post-job" element={
            <ProtectedRoute roles={['recruiter']}><PostJob /></ProtectedRoute>
          } />
          <Route path="/recruiter/edit-job/:id" element={
            <ProtectedRoute roles={['recruiter']}><EditJob /></ProtectedRoute>
          } />
          <Route path="/recruiter/applicants/:id" element={
            <ProtectedRoute roles={['recruiter']}><Applicants /></ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App