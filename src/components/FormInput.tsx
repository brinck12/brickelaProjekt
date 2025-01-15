import React from 'react';

interface FormInputProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export default function FormInput({ 
  label, 
  type, 
  name, 
  value, 
  onChange, 
  required 
}: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                 text-slate-300 placeholder-slate-500"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}