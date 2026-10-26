import React from 'react'
import { assets } from '../assets/assets'

const AppDownload = () => {
  return (
    <div className="container px-4 2xl:px-20 mx-auto my-20">
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-blue-50 p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Download our app
        </h2>

        <p className="text-gray-600">
          Find jobs and manage your applications with ease.
        </p>

        <div className="flex items-center gap-4">
          <img
            src={assets.play_store}
            alt="Get it on Google Play"
            className="h-12 object-contain"
          />

          <img
            src={assets.app_store}
            alt="Download on the App Store"
            className="h-12 object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default AppDownload