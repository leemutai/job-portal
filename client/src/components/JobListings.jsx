import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets, JobCategories, JobLocations } from '../assets/assets'
import JobCard from './JobCard'

const JobListings = () => {

  const { isSearched, searchFilter, setSearchFilter, jobs } = useContext(AppContext)
  const [showFilter, setShowFilter] = useState(false)

  return (
    <div className="container 2xl:px-20 mx-auto py-8">

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden mb-4 px-4">
        <button
          onClick={() => setShowFilter(prev => !prev)}
          className="px-6 py-2 border border-gray-400 rounded"
        >
          {showFilter ? "Close Filters" : "Filters"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <aside
          className={`
            w-full lg:w-1/4 bg-white px-4
            ${showFilter ? "block" : "hidden"}
            lg:block
          `}
        >

          {/* Current Search */}
          {isSearched && (searchFilter.title || searchFilter.location) && (
            <>
              <h3 className="font-medium text-lg mb-4">Current Search</h3>

              <div className="mb-4 flex flex-wrap gap-2 text-gray-600">
                {searchFilter.title && (
                  <span className="inline-flex items-center gap-2.5 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded">
                    {searchFilter.title}
                    <img
                      src={assets.cross_icon}
                      className="cursor-pointer"
                      onClick={() =>
                        setSearchFilter(prev => ({ ...prev, title: "" }))
                      }
                      alt=""
                    />
                  </span>
                )}

                {searchFilter.location && (
                  <span className="inline-flex items-center gap-2.5 bg-red-50 border border-red-200 px-4 py-1.5 rounded">
                    {searchFilter.location}
                    <img
                      src={assets.cross_icon}
                      className="cursor-pointer"
                      onClick={() =>
                        setSearchFilter(prev => ({ ...prev, location: "" }))
                      }
                      alt=""
                    />
                  </span>
                )}
              </div>
            </>
          )}

          {/* Categories */}
          <div>
            <h4 className="font-medium text-lg py-4">Search by Categories</h4>
            <ul className="space-y-4 text-gray-600">
              {JobCategories.map((category, index) => (
                <li className="flex gap-3 items-center" key={index}>
                  <input type="checkbox" className="scale-125" />
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-medium text-lg py-4 pt-10">Search by Location</h4>
            <ul className="space-y-4 text-gray-600">
              {JobLocations.map((location, index) => (
                <li className="flex gap-3 items-center" key={index}>
                  <input type="checkbox" className="scale-125" />
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* JOB LISTINGS */}
        <section className="w-full lg:w-3/4 text-gray-800 px-4 lg:px-0">
          <h3 className="font-medium text-3xl py-2" id="job-list">
            Latest jobs
          </h3>
          <p className="mb-8">Get your desired job from top companies</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs?.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

export default JobListings
