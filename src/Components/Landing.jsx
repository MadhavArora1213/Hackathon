import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Landing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = doc(db, "users", auth.currentUser.uid);
          const userSnapshot = await getDoc(userDoc);
          if (userSnapshot.exists()) {
            setUser(userSnapshot.data());
          } else {
            setError("No user data found");
          }
        } else {
          setError("User not logged in");
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="flex justify-center items-center min-h-screen p-4 pt-8">
      <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          User Profile
        </h2>
        <div className="flex flex-col items-center">
          {user?.profilePicURL && (
            <img
              src={user.profilePicURL}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-4"
            />
          )}
          <div className="text-center">
            <p className="text-xl font-semibold">{user?.fullName}</p>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-gray-600">{user?.dob}</p>
            <p className="text-gray-600">{user?.mobileNumber}</p>
            <p className="text-gray-600">Aadhaar: {user?.AadharCardNumber}</p>
            {/* Add more user details here */}
          </div>
        </div>
      </div>
    </div>
  );
}
