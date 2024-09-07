import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
import OtpInputLogin from "./OtpInputLogin"; // Import the OTP Input component
import { auth, googleProvider, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Popup from "./Popup"; // Ensure you have this component
import "../index.css";

export default function LoginCard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const showSuccessPopup = () => {
    setPopupMessage("Successfully logged in!");
    setTimeout(() => {
      setPopupMessage("");
      navigate("/"); // Redirect to home page
    }, 1000); // Redirect after 1 second
  };

  const sendOtp = async (email) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Prepare the email data
    const templateParams = {
      to_email: email,
      otp: generatedOtp,
    };

    try {
      // Send OTP using EmailJS
      await emailjs.send(
        "service_v3lvcj7",
        "template_oe6dqx8",
        templateParams,
        "RLobcgTa50QVJRdJ4"
      );
      setOtp(generatedOtp);
      setOtpSent(true);
      setPopupMessage(`OTP has been sent to ${email}. Please enter the OTP.`);

      setTimeout(() => {
        setPopupMessage("");
      }, 2000);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setLoginError("Failed to send OTP. Please try again.");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitted(true);
    try {
      if (isAdmin) {
        // Admin Login
        if (!otpSent) {
          await sendOtp(data.email);
          return;
        }

        if (inputOtp !== otp) {
          setLoginError("Invalid OTP. Please try again.");
          setIsSubmitted(false);
          return;
        }

        // Perform admin login with email and OTP
        // Add any additional admin verification logic here
      } else {
        // Normal User Login
        await signInWithEmailAndPassword(auth, data.email, data.password);
        showSuccessPopup();
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setLoginError("User not found. Please sign up first.");
        navigate("/register");
      } else if (error.code === "auth/wrong-password") {
        setLoginError("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setLoginError("Invalid email address.");
      } else {
        setLoginError("Login failed. Please check your credentials.");
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
        setLoginError("User not found. Please sign up first.");
        navigate("/register");
      } else {
        showSuccessPopup();
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setLoginError("User not found. Please sign up first.");
        navigate("/register");
      } else {
        setLoginError("Google login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="mb-4">
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="py-2 px-4 bg-[#03AED2] text-white font-medium rounded-md hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300"
        >
          {isAdmin ? "Switch to User Login" : "Switch to Admin Login"}
        </button>
      </div>

      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl transform transition-transform duration-500 animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          {isAdmin ? "Admin Login" : "User Login"}
        </h2>
        {popupMessage && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
            {popupMessage}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {!otpSent ? (
            <>
              {isAdmin ? (
                <>
                  <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    icon={faEnvelope}
                    errors={errors}
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                        message: "Enter a valid email",
                      },
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
                    placeholder="Password"
                    validation={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                  />
                </>
              ) : (
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
                      required: "Aadhaar Card number is required",
                      pattern: {
                        value: /^[0-9]{12}$/,
                        message: "Aadhaar must be 12 digits",
                      },
                    }}
                  />
                  <TextInput
                    label="Email"
                    name="email"
                    type="email"
                    register={register}
                    icon={faEnvelope}
                    errors={errors}
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                        message: "Enter a valid email",
                      },
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
                    placeholder="Password"
                    validation={{
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    }}
                  />
                </>
              )}
              {loginError && (
                <p className="mt-2 text-sm text-red-600">{loginError}</p>
              )}
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300 ${
                  isSubmitted ? "animate-bounce" : ""
                }`}
              >
                {isSubmitted
                  ? isAdmin
                    ? "Verifying OTP..."
                    : "Logging in..."
                  : isAdmin
                  ? "Send OTP"
                  : "Log in"}
              </button>
            </>
          ) : (
            <>
              <OtpInputLogin
                label="Enter OTP"
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
              />
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300 ${
                  isSubmitted ? "animate-bounce" : ""
                }`}
              >
                Verify OTP
              </button>
            </>
          )}
          {!isAdmin && (
            <div className="mt-4 flex justify-center items-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center bg-[#4285F4] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#357ae8] transition-colors duration-300"
              >
                <FontAwesomeIcon icon={['fab', 'google']} className="mr-2" />
                Sign in with Google
              </button>
            </div>
          )}
          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-[#03AED2] hover:text-[#2cc5e4] transition-colors duration-300"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
      {popupMessage && <Popup message={popupMessage} />}
    </div>
  );
}
