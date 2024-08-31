// src/components/OtpInput.js
import React from 'react';

export default function OtpInput({ name, register, placeholder, errors }) {
  return (
    <div className="flex flex-col">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        OTP
      </label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        {...register(name, { required: 'OTP is required' })}
        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
      />
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>}
    </div>
  );
}
