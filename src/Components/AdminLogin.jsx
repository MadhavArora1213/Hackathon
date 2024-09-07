import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import emailjs from "emailjs-com";
import { auth, db } from "../firebase"; // Firestore and Firebase authentication config
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import TextInput from "./TextInput"; // Assume you have a TextInput component
import OtpInputLogin from "./OtpInputLogin"; // Assume you have an OTP input component
import Popup from "./Popup"; // Assume you have a Popup component

const AdminLogin = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const sendOtp = async (to_email) => {
    const otp1 = Math.floor(100000 + Math.random() * 900000).toString();
    const templateParams = { to_email: to_email, otp: otp1 };
    console.log(otp1);

    try {
      await emailjs.send("service_guk4ms6", "template_1px6ww2", templateParams, "B3xiQMmJKL8mTSdKv");
      setOtp(otp1);
      setOtpSent(true);
      setPopupMessage(`OTP has been sent to ${to_email}. Please enter the OTP.`);
      setTimeout(() => setPopupMessage(''), 2000);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      setLoginError('Failed to send OTP. Please try again.');
    }
  };

  const checkAdminCredentials = async (to_email, password) => {
    // Check if user exists by email or username
    const emailQuery = query(collection(db, "admins"), where("email", "==", to_email));
    const usernameQuery = query(collection(db, "admins"), where("username", "==", to_email));
    
    const [emailSnapshot, usernameSnapshot] = await Promise.all([getDocs(emailQuery), getDocs(usernameQuery)]);
    
    let adminDoc = emailSnapshot.docs[0] || usernameSnapshot.docs[0]; // Check by either email or username

    if (!adminDoc) {
      throw new Error('Invalid username/email address.');
    }

    const adminData = adminDoc.data();

    // Verify password
    if (adminData.password !== password) {
      throw new Error('Invalid password.');
    }

    return adminData; // Successfully authenticated admin
  };

  const onSubmit = async (data) => {
    setIsSubmitted(true);

    if (!otpSent) {
      // Send OTP
      await sendOtp(data.to_email);
      return;
    }

    if (inputOtp !== otp) {
      setLoginError('Invalid OTP. Please try again.');
      setIsSubmitted(false);
      return;
    }

    try {
      // Check if email/username and password match in Firestore
      await checkAdminCredentials(data.to_email, data.password);
      setPopupMessage('Successfully logged in!');
      
      setTimeout(() => {
        setPopupMessage('');
        navigate('/'); // Redirect to home page
      }, 1000); // Redirect after 1 second

    } catch (error) {
      setLoginError(error.message);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Admin Login
        </h2>
        {popupMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {popupMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!otpSent ? (
            <>
              <TextInput
                label="Username/Email"
                name="to_email"
                type="text"
                register={register}
                icon={faEnvelope}
                errors={errors}
                placeholder="Username or Email"
                validation={{
                  required: 'Username or email is required',
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: 'Enter a valid email'
                  }
                }}
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                register={register}
                icon={faLock}
                errors={errors}
                placeholder="Password"
                validation={{
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
              />
              {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] transition-colors duration-300 ${isSubmitted ? 'animate-bounce' : ''}`}
              >
                {isSubmitted ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <OtpInputLogin
                    name={field.name}
                    value={inputOtp}
                    onChange={(e) => setInputOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                )}
              />
              {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
              <button
                type="submit"
                className={`w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] transition-colors duration-300 ${isSubmitted ? 'animate-bounce' : ''}`}
              >
                {isSubmitted ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </>
          )}
        </form>
        {popupMessage && <Popup message={popupMessage} />}
      </div>
    </div>
  );
};

export default AdminLogin;
