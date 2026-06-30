import { Link } from 'react-router-dom'

const JobCard = ({ job, onSave, savedIds = [] }) => {
  const isSaved = savedIds.includes(job.id)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
            🏢
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
            <p className="text-gray-500 text-sm">{job.company_name}</p>
          </div>
        </div>
        {onSave && (
          <button
            onClick={() => onSave(job.id)}
            className={`text-xl transition-transform hover:scale-110 ${isSaved ? 'text-yellow-500' : 'text-gray-300'}`}
          >
            ★
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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

      <div className="mt-4 flex justify-between items-center">
        <div>
          <span className="text-gray-800 font-semibold">
            {job.salary_min && job.salary_max
              ? `₹${job.salary_min}L - ₹${job.salary_max}L`
              : 'Salary Not Disclosed'}
          </span>
        </div>
        <Link
          to={`/candidate/jobs/${job.id}`}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default JobCard