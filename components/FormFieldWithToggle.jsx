'use client';

import { useState } from 'react';

export default function FormFieldWithToggle({ label, name, value, onChange, required }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full p-2 bg-[#2a2a3d] rounded pr-10"
        />
        <span
          className="absolute top-2 right-2 cursor-pointer text-sm text-gray-300"
          onClick={() => setShow(!show)}
        >
          {show ? 'Hide' : 'Show'}
        </span>
      </div>
    </div>
  );
}
