import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {
  const navigate = useNavigate()

  const {
    companyData,
    setCompanyData,
    setCompanyToken
  } = useContext(AppContext)

  const [showLogoutMenu, setShowLogoutMenu] = useState(false)

  // Logout company
  const logout = () => {
    setCompanyToken(null)
    localStorage.removeItem('companyToken')
    setCompanyData(null)
    setShowLogoutMenu(false)
    navigate('/')
  }

  // Redirect to Manage Jobs when company data is available
  useEffect(() => {
    if (companyData) {
      navigate('/dashboard/manage-jobs')
    }
  }, [companyData, navigate])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <div className="shadow-sm bg-white py-4 relative z-30">
        <div className="px-5 flex justify-between items-center">

          {/* Logo */}
          <img
            onClick={() => navigate('/')}
            className="max-sm:w-32 cursor-pointer"
            src={assets.logo}
            alt="Logo"
          />

          {/* Company Profile */}
          {companyData && (
            <div className="flex items-center gap-3">

              <p className="max-sm:hidden text-gray-700">
                Welcome, {companyData.name}
              </p>

              {/* Profile dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setShowLogoutMenu(true)}
                onMouseLeave={() => setShowLogoutMenu(false)}
              >
                <button
                  type="button"
                  onClick={() => setShowLogoutMenu(prev => !prev)}
                  className="flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Company account menu"
                  aria-expanded={showLogoutMenu}
                >
                  <img
                    className="w-8 h-8 border rounded-full cursor-pointer object-cover"
                    src={companyData.image}
                    alt="Company profile"
                  />
                </button>

                {/* Logout menu */}
                {showLogoutMenu && (
                  <div className="absolute right-0 top-full pt-2 w-36 z-50">
                    <div className="bg-white rounded-md border border-gray-200 shadow-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={logout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Dashboard Layout */}
      <div className="flex items-start">

        {/* Sidebar */}
        <div className="inline-block min-h-screen border-r-2 bg-white">
          <ul className="flex flex-col items-start pt-5 text-gray-800">

            {/* Add Job */}
            <NavLink
              to="/dashboard/add-job"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive
                    ? 'bg-blue-100 border-r-4 border-blue-500'
                    : ''
                }`
              }
            >
              <img
                className="min-w-4"
                src={assets.add_icon}
                alt=""
              />
              <p className="max-sm:hidden">Add Job</p>
            </NavLink>

            {/* Manage Jobs */}
            <NavLink
              to="/dashboard/manage-jobs"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive
                    ? 'bg-blue-100 border-r-4 border-blue-500'
                    : ''
                }`
              }
            >
              <img
                className="min-w-4"
                src={assets.home_icon}
                alt=""
              />
              <p className="max-sm:hidden">Manage Jobs</p>
            </NavLink>

            {/* View Applications */}
            <NavLink
              to="/dashboard/view-applications"
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive
                    ? 'bg-blue-100 border-r-4 border-blue-500'
                    : ''
                }`
              }
            >
              <img
                className="min-w-4"
                src={assets.person_tick_icon}
                alt=""
              />
              <p className="max-sm:hidden">View Applications</p>
            </NavLink>

          </ul>
        </div>

        {/* Nested Dashboard Pages */}
        <div className="flex-1 min-w-0 min-h-screen p-2 sm:p-5">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default Dashboard