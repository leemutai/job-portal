import React from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'

const ViewApplications = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='overflow-x-auto'>
        <table className='w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm'>

          {/* TABLE HEADER */}
          <thead>
            <tr className='border-b bg-gray-50'>
              <th className='py-2 px-4 text-left'>#</th>
              <th className='py-2 px-4 text-left'>User name</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
              <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
              <th className='py-2 px-4 text-left'>Resume</th>
              <th className='py-2 px-4 text-left'>Action</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {viewApplicationsPageData.map((applicant, index) => (
              <tr key={index} className='text-gray-700 hover:bg-gray-50'>

                {/* INDEX */}
                <td className='py-2 px-4 border-b text-center'>
                  {index + 1}
                </td>

                {/* USER INFO */}
                <td className='py-2 px-4 border-b flex items-center'>
                  <img
                    className='w-10 h-10 rounded-full mr-3 max-sm:hidden'
                    src={applicant.imgSrc}
                    alt='user'
                  />
                  <span>{applicant.name}</span>
                </td>

                {/* JOB TITLE */}
                <td className='py-2 px-4 border-b max-sm:hidden'>
                  {applicant.jobTitle}
                </td>

                {/* LOCATION */}
                <td className='py-2 px-4 border-b max-sm:hidden'>
                  {applicant.location}
                </td>

                {/* RESUME */}
                <td className='py-2 px-4 border-b'>
                  <a
                    href={applicant.resumeUrl || '#'}
                    target='_blank'
                    rel='noreferrer'
                    className='bg-blue-50 text-blue-500 px-3 py-1 rounded inline-flex gap-2 items-center hover:bg-blue-100'
                  >
                    Resume
                    <img src={assets.resume_download_icon} alt='download' />
                  </a>
                </td>

                {/* ACTION MENU */}
                <td className='py-2 px-4 border-b'>

                  {/* group on a div inside td — not on td itself */}
                  <div className='relative inline-block group'>

                    {/* Trigger */}
                    <button className='text-gray-500 px-2 py-1 cursor-pointer'>
                      ...
                    </button>

                    {/* pt-2 creates an invisible hover bridge so the
                        mouse doesn't lose hover when moving to dropdown */}
                    <div className='absolute right-0 top-full w-32 pt-2 z-10'>
                      <div className='bg-white border border-gray-200 rounded shadow-md
                                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                      transition-all duration-150'>

                        <button className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>
                          Accept
                        </button>

                        <button className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>
                          Reject
                        </button>

                      </div>
                    </div>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  )
}

export default ViewApplications