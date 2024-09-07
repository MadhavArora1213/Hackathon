import React from "react";
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { db } from "../firebase"; // Firestore config

const AddAdminData = () => {
  const addAdminData = async () => {
    for (let i = 1; i <= 100; i++) {
      const email = `admin${i}@yourdomain.com`;
      const password = `admin${i}_password`; // Ideally, hash this before storing
      const username = `admin${i}`; // Generate username dynamically

      try {
        // Add admin document to Firestore
        await addDoc(collection(db, "admins"), {
          username: username, // Add username to the document
          email: email,
          password: password, // Store hashed password instead in production
        });
        console.log(`Admin ${i} added successfully`);
      } catch (error) {
        console.error("Error adding admin: ", error);
      }
    }
    alert("All admins have been added successfully!");
  };

  return (
    <div>
      <h2>Insert Admin Data</h2>
      <button onClick={addAdminData}>Add Admins</button>
    </div>
  );
};

export default AddAdminData;
