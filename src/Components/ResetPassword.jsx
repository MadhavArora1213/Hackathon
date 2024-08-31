// src/components/ResetPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent!');
      setError('');
      setEmail('');
    } catch (error) {
      setError('Error sending password reset email. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl transform transition-transform duration-500 animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Reset Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#03AED2] focus:border-[#03AED2] sm:text-sm"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
        <button
          type="button"
          onClick={handleResetPassword}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300"
        >
          Reset Password
        </button>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
