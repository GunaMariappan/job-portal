const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <span className="text-xl font-bold text-white">JobPortal</span>
            </div>
            <p className="text-sm text-gray-400">Find your dream job or hire the best talent.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="/candidate/jobs" className="hover:text-indigo-400 transition-colors">Browse Jobs</a></li>
              <li><a href="/register" className="hover:text-indigo-400 transition-colors">Register</a></li>
              <li><a href="/login" className="hover:text-indigo-400 transition-colors">Login</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 support@jobportal.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Chennai, Tamil Nadu</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © 2024 JobPortal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer