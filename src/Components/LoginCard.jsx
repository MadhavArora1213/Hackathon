import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import emailjs from 'emailjs-com';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faIdCard } from '@fortawesome/free-solid-svg-icons';
import TextInput from './TextInput';
import OtpInputLogin from './OtpInputLogin'; // Import the new OtpInputInputInput component
import { auth, googleProvider, db } from '../firebase'; 
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Popup from './Popup'; // Ensure you have this component
import "../index.css";

export default function LoginCard() {
  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const showSuccessPopup = () => {
    setPopupMessage('Successfully logged in!');
    setTimeout(() => {
      setPopupMessage('');
      navigate('/'); // Redirect to home page
    }, 1000); // Redirect after 1 second
  };

  

const sendOtp = async (email) => {
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Prepare the email data
  const templateParams = {
    to_email: email,
    otp: generatedOtp
  };

  try {
    // Send OTP using EmailJS
    await emailjs.send("service_v3lvcj7", "template_oe6dqx8", templateParams, "RLobcgTa50QVJRdJ4");
    setOtp(generatedOtp);
    setOtpSent(true);
    setPopupMessage(`OTP has been sent to ${email}. Please enter the OTP.`);

    setTimeout(() => {
      setPopupMessage('');
    }, 2000);
  } catch (error) {
    console.error('Failed to send OTP:', error);
    setLoginError('Failed to send OTP. Please try again.');
  }
};

  const onSubmit = async (data) => {
    setIsSubmitted(true);
    try {
      if (!otpSent) {
        await sendOtp(data.email);
        return;
      }

      if (inputOtp !== otp) {
        setLoginError('Invalid OTP. Please try again.');
        setIsSubmitted(false);
        return;
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);
      showSuccessPopup();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setLoginError('User not found. Please sign up first.');
        navigate('/register');
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setLoginError('Invalid email address.');
      } else {
        setLoginError('Login failed. Please check your credentials.');
      }
      setIsSubmitted(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        setLoginError('User not found. Please sign up first.');
        navigate('/register');
      } else {
        showSuccessPopup();
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setLoginError('User not found. Please sign up first.');
        navigate('/register');
      } else {
        setLoginError('Google login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl transform transition-transform duration-500 animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Sign in to PMSSS
        </h2>
        {popupMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {popupMessage}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {!otpSent ? (
            <>
              <TextInput
                label="AadharCard Number"
                name="idNumber"
                type="text"
                register={register}
                icon={faIdCard}
                errors={errors}
                placeholder="Aadhar Card Number"
                validation={{ 
                  required: 'Aadhaar Card number is required',
                  pattern: {
                    value: /^[0-9]{12}$/,
                    message: 'Aadhaar must be 12 digits'
                  }}}
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                register={register}
                icon={faEnvelope}
                errors={errors}
                validation={{ 
                  required: 'Email is required', 
                  pattern: {
                    value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                    message: 'Enter a valid email'
                  }
                }}
                placeholder="Email address"
              />
              <TextInput
                label="Password"
                name="password"
                type="password"
                register={register}
                icon={faLock}
                errors={errors}
                validation={{ 
                  required: 'Password is required', 
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                placeholder="Password"
              />
              {loginError && <p className="mt-2 text-sm text-red-600">{loginError}</p>}
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300 ${isSubmitted ? 'animate-bounce' : ''}`}
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
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300 ${isSubmitted ? 'animate-bounce' : ''}`}
              >
                {isSubmitted ? 'Verifying OTP...' : 'Verify OTP'}
              </button>
            </>
          )}
          <div className="flex justify-between items-center mt-4">
            <a 
              href="#"
              onClick={() => navigate('/reset-password')}
              className="text-sm font-medium text-[#03AED2] hover:text-[#2cc5e4]"
            >
              Forgot Password?
            </a>
          </div>

          <div className='text-center'>
            <p>Or</p>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4285F4] hover:bg-[#357ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z"></path></svg>
              <p className='pl-1'>Login with Google</p>
            </button>
          </div>
        </form>
        {popupMessage && <Popup message={popupMessage} />}
      </div>
    </div>
  );
}
