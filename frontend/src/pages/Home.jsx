import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  const features = [
    { icon: '🔍', title: 'Smart Job Search', desc: 'Search jobs by title, location, category and experience level' },
    { icon: '📄', title: 'Easy Apply', desc: 'One click apply with your resume and profile' },
    { icon: '💼', title: 'Top Companies', desc: 'Connect with top recruiters and companies' },
    { icon: '🔔', title: 'Job Alerts', desc: 'Get notified when new matching jobs are posted' },
  ]

  const stats = [
    { number: '10,000+', label: 'Jobs Posted' },
    { number: '5,000+', label: 'Companies' },
    { number: '50,000+', label: 'Candidates' },
    { number: '95%', label: 'Success Rate' },
  ]

  const categories = [
    { icon: '💻', name: 'Technology' },
    { icon: '🏥', name: 'Healthcare' },
    { icon: '📊', name: 'Finance' },
    { icon: '🎨', name: 'Design' },
    { icon: '📱', name: 'Marketing' },
    { icon: '🏗️', name: 'Engineering' },
    { icon: '📚', name: 'Education' },
    { icon: '🚀', name: 'Startup' },
  ]

  return (
    <div className="bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your <span className="text-yellow-400">Dream Job</span> Today
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Connect with top companies and kickstart your career with JobPortal — India's fastest growing job platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to={
                  user.role === 'candidate' ? '/candidate/dashboard' :
                  user.role === 'recruiter' ? '/recruiter/dashboard' :
                  '/admin/dashboard'
                }
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors duration-200"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors duration-200"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white hover:bg-white hover:text-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-4 shadow-sm">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-indigo-600">{stat.number}</div>
              <div className="text-gray-500 mt-1 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Why Choose JobPortal?</h2>
          <p className="text-center text-gray-500 mb-12">Everything you need to land your next opportunity</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">Browse by Category</h2>
          <p className="text-center text-gray-500 mb-12">Explore jobs in your field of interest</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i}
                className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all duration-200">
                <span className="text-2xl">{cat.icon}</span>
                <span className="font-medium text-gray-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-indigo-200 mb-8 text-lg">Join thousands of professionals who found their dream job through JobPortal</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="bg-white text-indigo-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-lg transition-colors duration-200">
              Register as Candidate
            </Link>
            <Link to="/register"
              className="border-2 border-white hover:bg-white hover:text-indigo-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition-colors duration-200">
              Register as Recruiter
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home