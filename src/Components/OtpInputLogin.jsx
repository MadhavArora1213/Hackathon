import React from 'react';

const OtpInputLogin = ({ name, value, onChange, placeholder }) => {
  return (
    <div className="relative">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[#03AED2] focus:border-[#03AED2] sm:text-sm"
        maxLength="6" // Assuming OTP length is 6 digits
      />
    </div>
  );
};

export default OtpInputLogin;
