
import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
    const { openSignIn } = useClerk();
    const { user } = useUser();

    const navigate = useNavigate();

    const { setShowRecruiterLogin } = useContext(AppContext);

    // Generate a display name, handling missing or invalid name fields
    const cleanName = (value) => {
        if (typeof value !== 'string') return '';

        const name = value.trim();

        if (!name || name.toLowerCase() === 'null') {
            return '';
        }

        return name;
    };

    const firstName = cleanName(user?.firstName);
    const lastName = cleanName(user?.lastName);

    const displayName =
        [firstName, lastName].filter(Boolean).join(' ') ||
        cleanName(user?.username) ||
        cleanName(
            user?.primaryEmailAddress?.emailAddress?.split('@')[0]
        ) ||
        'there';

    return (
        <div className="shadow py-4">
            <div className="container px-4 2xl:px-20 mx-auto flex justify-between items-center">

                {/* Logo */}
                <img
                    onClick={() => navigate('/')}
                    className="cursor-pointer"
                    src={assets.logo}
                    alt="Logo"
                />

                {user ? (
                    <div className="flex items-center gap-3">

                        {/* Applied jobs link */}
                        <Link to="/applications">
                            Applied Jobs
                        </Link>

                        <p>|</p>

                        {/* Personalized greeting */}
                        <p className="max-sm:hidden">
                            Hi, {displayName}
                        </p>

                        {/* Clerk user profile and logout */}
                        <UserButton />
                    </div>
                ) : (
                    <div className="flex gap-4 max-sm:text-xs">

                        {/* Recruiter login */}
                        <button
                            onClick={() => setShowRecruiterLogin(true)}
                            className="text-gray-600"
                        >
                            Recruiter Login
                        </button>

                        {/* User login */}
                        <button
                            onClick={() => openSignIn()}
                            className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
