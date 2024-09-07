import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGraduationCap } from 'react-icons/fc';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import '../index.css';

// Confirmation popup component
const ConfirmationPopup = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <p className="mb-4 text-lg">{message}</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onConfirm}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          No
        </button>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null); 
      // Clear user state
      navigate('/login'); // Redirect to login page
      window.location.reload(); // Ensure page reloads after redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className='w-full h-auto py-[2.5vh] bg-gradient-to-r from-[#03AED2] to-[#FDDE55] text-black flex justify-between items-center gap-3 px-3 flex-col lg:flex-row'>
        {/* Left side */}
        <div className="logo font-semibold text-center flex justify-center items-center text-xl gap-3">
          <FcGraduationCap className='h-[3.5rem] w-[3.5rem]' />
          Special Scholarship Scheme for J&K and Ladakh (PM-USPY)
        </div>
        {/* Left side end */}

        {/* Right side */}
        <img className='w-[17em]' src="https://www.aicte-india.org/sites/default/files/logo_new.png" alt="AICTE Logo" />
        {/* Right side end */}
      </div>

      {/* Extended Navbar */}
      <div className="extendednav w-[90vw] m-auto mt-4 h-auto py-[2.5vh] bg-[#f2f2f2] shadow-2xl text-black flex justify-center items-center gap-3 px-3 backdrop-blur-[11px] backdrop-saturate-[200%] bg-white/65 rounded-lg border border-gray-300/30">
        <Link to='/'>Home</Link>
        {!user ? (
          <>
            <Link to='/register'>Register</Link>
            <Link to='/login'>Login</Link>
            {/* <Link to='/add-admin-data'>AddAmin</Link> */}
          </>
        ) : (
          <button onClick={() => setShowPopup(true)}>Logout</button>
        )}
      </div>

      {showPopup && (
        <ConfirmationPopup
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </>
  );
};

export default Navbar;
