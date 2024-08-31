import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function TextInput({
  label,
  name,
  type,
  register,
  icon,
  errors,
  validation,
  placeholder
}) {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const handleToggleVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={icon} className="text-gray-400" />
        </div>
        <input
          name={name}
          type={type === 'password' && !showPassword ? 'password' : 'text'}
          placeholder={placeholder}
          {...register(name, validation)}
          className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#03AED2] focus:border-[#03AED2] sm:text-sm ${errors[name] ? 'border-red-500' : ''}`}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={handleToggleVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-400" />
          </button>
        )}
      </div>
      {errors[name] && <p className="mt-2 text-sm text-red-600">{errors[name].message}</p>}
    </div>
  );
}
