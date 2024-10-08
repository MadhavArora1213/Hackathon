import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGraduationCap } from 'react-icons/fc';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust path as necessary
import '../index.css';

const Navbar = ({ user }) => {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className='w-full h-auto py-[2.5vh] bg-gradient-to-r from-[#03AED2] to-[#FDDE55] text-black flex justify-between items-center gap-3 px-3 flex-col lg:flex-row'>
        <div className="logo font-semibold text-center flex justify-center items-center text-xl gap-3">
          <FcGraduationCap className='h-[3.5rem] w-[3.5rem]' />
          Special Scholarship Scheme for J&K and Ladakh (PM-USPY)
        </div>
        <img className='w-[17em]' src="https://www.aicte-india.org/sites/default/files/logo_new.png" alt="AICTE Logo" />
      </div>

      <div className="extendednav w-[90vw] m-auto mt-4 h-auto py-[2.5vh] bg-[#f2f2f2] shadow-2xl text-black flex justify-center items-center gap-3 px-3 backdrop-blur-[11px] backdrop-saturate-[200%] bg-white/65 rounded-lg border border-gray-300/30">
        <Link to='/'>Home</Link>
        {!user ? (
          <>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
            {/* <Link to='/add-admin-data'>Add Admin</Link> */}
          </>
        ) : (
          <button onClick={() => setShowPopup(true)}>Logout</button>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="mb-4 text-lg">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
