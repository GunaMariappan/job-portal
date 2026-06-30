const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-200 border-solid rounded-full animate-spin border-t-indigo-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-solid rounded-full animate-spin border-t-purple-600"
            style={{ animationDirection: 'reverse' }}>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Spinner