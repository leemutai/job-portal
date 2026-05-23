import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Dashboard = () => {

  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Navbar for recruiter panel */}
      <div className='shadow-sm bg-white py-4'>
        <div className='px-5 flex justify-between items-center'>

          {/* Logo */}
          <img
            onClick={() => navigate('/')}
            className='max-sm:w-32 cursor-pointer'
            src={assets.logo}
            alt="logo"
          />

          {/* Right Side */}
          <div className='flex items-center gap-3'>

            <p className='max-sm:hidden text-gray-700'>
              Welcome, LeeTech Solutions
            </p>

            {/* Profile Dropdown */}
            <div className='relative group'>

              <img
                className='w-8 h-8 border rounded-full cursor-pointer'
                src={assets.company_icon}
                alt="company icon"
              />

              {/* Dropdown Menu */}
              <div className='absolute right-0 top-full pt-2 hidden group-hover:block z-20'>

                <ul className='list-none m-0 p-2 bg-white rounded-md border shadow-lg text-sm min-w-[120px]'>

                  <li className='py-2 px-3 cursor-pointer hover:bg-gray-100 rounded'>
                    Logout
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>
      </div>
      <div className='flex items-start'>

        {/*Left  Sidebar with options to add job, manage jobs, view applications */}
        <div className='inline-block min-h-screen border-r-2'>
          <ul className='flex flex-col items-start pt-5 text-gray-800'>
            <NavLink className={({isActive}) => ` flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}  to={'/dashboard/add-job'}>
            <img src={assets.add_icon} alt="" />
            <p>Add Job</p>
            </NavLink>

            <NavLink className={({isActive}) => ` flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}  to={'/dashboard/manage-jobs'}>
            <img src={assets.home_icon} alt="" />
            <p>Manage Jobs</p>
            </NavLink>

            <NavLink className={({isActive}) => ` flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`}  to={'/dashboard/view-applications'}>
            <img src={assets.person_tick_icon} alt="" />
            <p>View Applications</p>
            </NavLink>
          </ul>
        </div>

        <div>
          <Outlet />
        </div>

      </div>

    

    </div>
  )
}

export default Dashboard