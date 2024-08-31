// src/components/FileInput.js
import React from 'react';

export default function FileInput({ label, name, register, errors, validation }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        name={name}
        {...register(name, validation)}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#03AED2] "
      />
      {errors[name] && <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );
}
