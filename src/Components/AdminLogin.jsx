import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import emailjs from "emailjs-com";
import { db } from "../firebase"; // Import Firestore configuration
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import TextInput from "./TextInput"; // Your custom TextInput component
import OtpInputLogin from "./OtpInputLogin"; // Your custom OTP input component
import Popup from "./Popup"; // Your custom Popup component

const AdminLogin = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  // Fetch all admins from Firestore
  const fetchAdmins = async () => {
    try {
      const adminsRef = collection(db, "admins");
      const querySnapshot = await getDocs(adminsRef);
      const admins = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return admins;
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      throw new Error('Failed to fetch admin data. Please try again later.');
    }
  };

  const sendOtp = async (to_email) => {
    const otp1 = Math.floor(100000 + Math.random() * 900000).toString();
    const templateParams = { to_email: to_email, otp: otp1 };

    // console.log("Sending OTP to:", to_email);
    // console.log("Generated OTP:", otp1);

    try {
      await emailjs.send("service_844bcrs", "template_1px6ww2", templateParams, "B3xiQMmJKL8mTSdKv");
      setOtp(otp1);
      setOtpSent(true);
      setPopupMessage(`OTP has been sent to ${to_email}. Please enter the OTP.`);
      setTimeout(() => setPopupMessage(''), 5000);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      setLoginError('Failed to send OTP. Please try again.');
      setTimeout(() => setLoginError(''), 5000);
    }
  };

  const checkAdminCredentials = async (emailOrUsername, password) => {
    try {
      const admins = await fetchAdmins();
      const admin = admins.find(admin =>
        (admin.email === emailOrUsername || admin.username === emailOrUsername) &&
        admin.password === password
      );

      if (!admin) {
        throw new Error('Invalid email/username or password.');
      }

      setAdminEmail(admin.email); // Set the admin's email for OTP sending
      return admin;
    } catch (error) {
      setLoginError(error.message);
      setTimeout(() => setLoginError(''), 5000);
      throw error; // Re-throw error to handle it in the onSubmit function
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitted(true);

    if (!otpSent) {
      try {
        await checkAdminCredentials(data.to_email, data.password);
        if (adminEmail) { // Ensure adminEmail is set
          await sendOtp(adminEmail);
        } else {
          throw new Error('Failed to retrieve admin email. Please try again.');
        }
      } catch (error) {
        setIsSubmitted(false);
        return;
      }
      return;
    }

    if (inputOtp !== otp) {
      setLoginError('Invalid OTP. Please try again.');
      setIsSubmitted(false);
      return;
    }

    try {
      await checkAdminCredentials(data.to_email, data.password);
      setPopupMessage('Successfully logged in!');
      setTimeout(() => {
        setPopupMessage('');
        navigate('/'); // Redirect to home page
      }, 1000);
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
                  validate: value => value.trim() !== '' || 'Username or email cannot be empty'
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
