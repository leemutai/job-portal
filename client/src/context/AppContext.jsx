import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react"

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    console.log('Backend URL:', backendUrl);

    const {user} = useUser()
    const {getToken} = useAuth()

    const [searchFilter, setSearchFilter] = useState({
        title:"",
        location:""
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userData, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])



    // Function to fetch job data

    const fetchJobs  = async () => {
        try {

            const {data} = await axios.get(backendUrl+'/api/jobs')
            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs);
                

                
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {

            toast.error(error.message)
            
        }
        

    }

    // Function to fetch the company data

    const fetchCompanyData = async () => {
        try {

            const {data} = await axios.get(backendUrl+'/api/company/company', {headers:{token:companyToken}})

            if (data.success) {
                setCompanyData(data.company)
                console.log(data);
                
            } else {
                toast.error(data.message)
            }
            
        } catch (error) {

            toast.error(error.message)
            
        }
    }



    // Function to fetch the user data
const fetchUserData = async () => {
    try {
        const token = await getToken();

        if (!token) {
            console.error('No Clerk session token available');
            return;
        }

        const { data } = await axios.get(
            backendUrl + '/api/user/user',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                cache: false
            }
        );

        if (data.success) {
            setUserData(data.user);
        } else {
            toast.error(data.message);
        }

    } catch (error) {
        console.error(
            'Fetch user data error:',
            error.response?.data || error.message
        );
        toast.error(
            error.response?.data?.message || error.message
        );
    }
};

    useEffect(()=> {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken')

        if (storedCompanyToken) {

            setCompanyToken(storedCompanyToken)
            
        }

    },[])

    useEffect(() => {

        if (companyToken) {
            fetchCompanyData()
            
        }

    },[companyToken])

    useEffect(() => {

        if (user) {
            fetchUserData()
            
        }

    },[user])

    const value = {
        searchFilter,setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userData , setUserData,
        userApplications, setUserApplications,
        fetchUserData
        

    }
    return (<AppContext.Provider value={value}>
        {props.children}

    </AppContext.Provider>)
}