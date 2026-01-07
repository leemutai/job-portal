import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const JobListings = () => {

    const {isSearched, searchFilter } = useContext(AppContext);



  return (
    <div>
        {/* Sidebar  */}
        <div>

            {/* Search Filter from Hero component */}
            {
                isSearched && ( searchFilter.title !== "" || searchFilter.location !== "" ) && (
                    <>
                    <h3>Current Search</h3>
                    <div>
                        {searchFilter.title && (
                            <span>
                                {searchFilter.title}

                            </span>
                        )}
                        {searchFilter.location && (
                            <span>
                                {searchFilter.location}
                                
                            </span>
                        )}
                    </div>
                    
                    </>
                )

            }
        </div>
    </div>
  )
}

export default JobListings