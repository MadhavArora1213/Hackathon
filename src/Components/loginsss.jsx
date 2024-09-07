import React, { useState } from "react";
import LoginCard from "./LoginCard"; // Ensure you have this component
import AdminLogin from "./AdminLogin"; // Import the AdminLogin component
import Popup from "./Popup"; // Ensure you have this component
import "../index.css";

export default function Loginsss() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const toggleLoginType = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4">
      <div className="mb-4">
        <button
          onClick={toggleLoginType}
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
        {isAdmin ? (
          <AdminLogin setPopupMessage={setPopupMessage} />
        ) : (
          <LoginCard setPopupMessage={setPopupMessage} />
        )}
      </div>
      {popupMessage && <Popup message={popupMessage} />}
    </div>
  );
}
