import React from 'react';

export default function Popup({ message }) {
  return (
    <div className="fixed top-0 left-0 right-0 mt-4 mx-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
    
      <p>{message}</p>
    </div>
  );
}
