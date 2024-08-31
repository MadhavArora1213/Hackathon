import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import bcrypt from "bcryptjs";
import emailjs from "emailjs-com";
import {
  faUser,
  faEnvelope,
  faLock,
  faPhone,
  faCalendar,
  faIdCard,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
import FileInput from "./FileInput";
import OtpInput from "./OtpInput";
import Popup from "./Popup";

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [academicRecords, setAcademicRecords] = useState(null);

  const sendEmail = async (templateParams) => {
    try {
      await emailjs.send(
        "service_kvnps03",
        "template_89k49x3",
        templateParams,
        "0_VwgBhPJoxif86Ba"
      );
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  };

  const sendOtp = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const subject = "Your OTP Code";
    const message = `Your OTP code is ${otp}. Please enter it to complete your registration.`;
    try {
      await sendEmail({
        to_email: email,
        otp: otp,
        subject: subject,
        message: message,
      });
      setOtp(otp);
      setOtpSent(true);
      setShowPopup(true);
      setPopupMessage(`OTP has been sent to ${email}. Please enter the OTP.`);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setShowPopup(true);
      setPopupMessage("Failed to send OTP. Please try again.");
    }
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;

    const fileRef = ref(storage, path);
    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      return downloadURL;
    } catch (error) {
      console.error("File upload failed:", error);
      throw new Error("Failed to upload file");
    }
  };

  const onSubmit = async (data) => {
    const {
      email,
      password,
      fullName,
      dob,
      mobileNumber,
      AadharCardNumber,
      otp: enteredOtp,
    } = data;

    if (!otpSent) {
      sendOtp(email);
      return;
    }

    if (enteredOtp !== otp) {
      setShowPopup(true);
      setPopupMessage("Invalid OTP. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);

      const hashedPassword = await bcrypt.hash(password, 10);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const profilePicURL = profilePic ? await uploadFile(profilePic, `profilePics/${profilePic.name}`) : "";
      const idProofURL = idProof ? await uploadFile(idProof, `idProofs/${idProof.name}`) : "";
      const academicRecordsURL = academicRecords ? await uploadFile(academicRecords, `academicRecords/${academicRecords.name}`) : "";

      await setDoc(doc(db, "users", user.uid), {
        fullName,
        dob,
        email,
        AadharCardNumber,
        mobileNumber,
        hashedPassword,
        profilePicURL,
        idProofURL,
        academicRecordsURL,
        createdAt: new Date(),
      });

      setShowPopup(true);
      setPopupMessage(
        "You have successfully registered! A confirmation email has been sent."
      );

      setTimeout(() => {
        reset();
        setOtpSent(false);
        setShowPopup(false);
        // Redirect to login page
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Error registering user:", error);
      setShowPopup(true);
      setPopupMessage("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 pt-8">
      <div className="w-full max-w-4xl p-8 bg-white shadow-xl rounded-xl transform hover:scale-105 transition-transform duration-500">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Sign up for PMSSS
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Full Name"
              name="fullName"
              type="text"
              register={register}
              icon={faUser}
              errors={errors}
              validation={{ required: "Full Name is required" }}
            />
            <TextInput
              label="Date of Birth"
              name="dob"
              type="date"
              register={register}
              icon={faCalendar}
              errors={errors}
              validation={{ required: "Date of Birth is required" }}
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
            />
            <TextInput
              label="Mobile Number"
              name="mobileNumber"
              type="tel"
              register={register}
              icon={faPhone}
              errors={errors}
              validation={{
                required: "Mobile Number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Mobile number must be 10 digits",
                },
              }}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              register={register}
              icon={faLock}
              errors={errors}
              validation={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              }}
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              register={register}
              icon={faLock}
              errors={errors}
              validation={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
            />
            <TextInput
              label="AadharCard Number"
              name="AadharCardNumber"
              type="text"
              register={register}
              icon={faIdCard}
              errors={errors}
              validation={{
                required: "Aadhaar Card number is required",
                pattern: {
                  value: /^[0-9]{12}$/,
                  message: "Aadhaar must be 12 digits",
                },
              }}
            />
            <FileInput
              label="Profile Pic"
              name="profilePic"
              register={register}
              errors={errors}
              validation={{ required: "Profile Pic is required" }}
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
            <FileInput
              label="ID Proof"
              name="idProof"
              register={register}
              errors={errors}
              validation={{ required: "ID Proof is required" }}
              onChange={(e) => setIdProof(e.target.files[0])}
            />
            <FileInput
              label="Academic Records"
              name="academicRecords"
              register={register}
              errors={errors}
              validation={{ required: "Academic Records are required" }}
              onChange={(e) => setAcademicRecords(e.target.files[0])}
            />
          </div>

          {otpSent && (
            <div className="mb-6">
              <OtpInput
                name="otp"
                register={register}
                placeholder="Enter OTP"
                errors={errors}
              />
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : otpSent
                ? "Verify OTP"
                : "Send OTP"}
            </button>
          </div>
        </form>
        {showPopup && <Popup message={popupMessage} />}
      </div>
    </div>
  );
}
