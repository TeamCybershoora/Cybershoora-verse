import { useState, useEffect } from 'react';

export default function FormFieldPassword({
  label,
  name,
  value,
  onChange,
  required,
  userName = 'User',
  setForm
}) {
  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState({ percent: 0, color: 'red', label: '' });

  useEffect(() => {
    if (name === 'password') {
      const hasUpper = /[A-Z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecial = /[^A-Za-z0-9]/.test(value);
      const isLong = value.length >= 8;

      const passed = [hasUpper, hasNumber, hasSpecial, isLong].filter(Boolean).length;
      const percent = (passed / 4) * 100;

      const label = percent === 100 ? 'Strong password' : '';
      const color = percent === 100 ? 'limegreen' : percent >= 50 ? 'orange' : 'red';

      setStrength({ percent, color, label });
    }
  }, [value, name]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const generateStrongPassword = () => {
    const baseName = capitalize(userName?.split(' ')[0] || 'User');
    const symbols = '@$!%*?&';
    const randSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const suggested = `shoora@${baseName}${randSymbol}${randNum}`;

    if (setForm) {
      setForm(prev => ({
        ...prev,
        password: suggested,
        confirmPassword: suggested,
      }));
    } else {
      onChange({ target: { name, value: suggested } });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      {name === 'password' && (
        <>
          <div className="instructions">
            Include at least 1 capital letter, 1 special character & 1 number
          </div>
          <button type="button" className="suggest-btn" onClick={generateStrongPassword}>
            Suggest Strong Password
          </button>
        </>
      )}

      <div className="input-wrapper">
        <input
          type={show ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button type="button" className="eye-btn" onClick={() => setShow(!show)}>
          {show ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.03-10-9s4.477-9 10-9 10 4.03 10 9a9.985 9.985 0 01-4.125 7.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24m1.43-1.43A9.98 9.98 0 0012 4c-2.5 0-4.78.92-6.56 2.44M3.51 3.51A9.974 9.974 0 002 12c0 4.97 4.477 9 10 9 1.57 0 3.05-.37 4.36-1.03" />
            </svg>
          )}
        </button>
      </div>

      {name === 'password' && (
        <>
          {strength.label && <div className="strength-label">{strength.label}</div>}
          <div className="strength-bar">
            <div
              className="strength-fill"
              style={{
                width: `${strength.percent}%`,
                backgroundColor: strength.color,
              }}
            />
          </div>
        </>
      )}

      <style jsx>{`
        .form-group {
          margin-bottom: 1.25rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.95rem;
          color: #ffffff;
        }

        .instructions {
          font-size: 0.75rem;
          color: #bbb;
          margin-bottom: 0.4rem;
        }

        .suggest-btn {
          background: #9747FF;
          color: white;
          padding: 5px 12px;
          font-size: 0.8rem;
          border: none;
          border-radius: 6px;
          margin-bottom: 0.4rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .suggest-btn:hover {
          background: #bb6fff;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #2a2a3d;
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.95rem;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #ff6a32;
        }

        .eye-btn {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          color: #ff6a32;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .icon {
          width: 20px;
          height: 20px;
        }

        .eye-btn:hover .icon {
          color: #ffa86a;
        }

        .strength-label {
          margin-top: 0.25rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: limegreen;
          text-align: right;
          animation: fadeIn 0.3s ease;
        }

        .strength-bar {
          margin-top: 6px;
          height: 8px;
          background: #1d1d1d;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: inset 0 0 4px rgba(0,0,0,0.6);
        }

        .strength-fill {
          height: 100%;
          transition: width 0.4s ease-in-out, background-color 0.3s ease;
          border-radius: 4px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
