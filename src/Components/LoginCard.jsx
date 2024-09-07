import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faIdCard } from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
import OtpInputLogin from "./OtpInputLogin"; // Import the OTP Input component
import { auth, googleProvider, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Popup from "./Popup"; // Ensure you have this component
import "../index.css";

export default function LoginCard({ setPopupMessage }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [inputOtp, setInputOtp] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

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
        setPopupMessage("Admin successfully logged in!");
        setTimeout(() => {
          setPopupMessage("");
          navigate("/"); // Redirect to home page
        }, 1000);
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        setPopupMessage("Successfully logged in!");
        setTimeout(() => {
          setPopupMessage("");
          navigate("/"); // Redirect to home page
        }, 1000);
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
        setPopupMessage("Successfully logged in with Google!");
        setTimeout(() => {
          setPopupMessage("");
          navigate("/"); // Redirect to home page
        }, 1000);
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
    <div>
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
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300"
              disabled={isSubmitted}
            >
              {isAdmin ? "Login as Admin" : "Log in"}
            </button>
            {loginError && <div className="text-red-500 text-center">{loginError}</div>}
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-[#03AED2] hover:text-[#2cc5e4] transition-colors duration-300"
              >
                Forgot Password?
              </a>
            </div>
          </>
        ) : (
          <>
            <OtpInputLogin value={inputOtp} onChange={setInputOtp} />
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#03AED2] hover:bg-[#2cc5e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#03AED2] transition-colors duration-300"
              disabled={isSubmitted}
            >
              Verify OTP
            </button>
          </>
        )}
      </form>
      <div className="text-center mt-4">
        <button
          onClick={handleGoogleLogin}
          className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#4285F4] hover:bg-[#357ae8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4285F4] transition-colors duration-300"
        >
          Log in with Google
        </button>
      </div>
    </div>
  );
}
