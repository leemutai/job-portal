import React, { useContext } from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import { UserProfile } from '@clerk/clerk-react'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'

const App = () => {

  const {showRecruiterLogin} = useContext(AppContext)


  return (
    <div>
      { showRecruiterLogin &&<RecruiterLogin />}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/apply-job/:id' element={<ApplyJob/>} />
        <Route path='/applications' element={<Applications/>} />
        {/* Clerk profile & settings */}
      <Route
        path='/user-profile/*'
        element={
          <UserProfile
            routing="path"
            path="/user-profile"
          />
        }
      />
      </Routes>
      </div>
  )
}

export default App