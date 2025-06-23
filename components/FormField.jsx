export default function FormField({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
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

        label {
  ...
  color: #ffffff;
}


        input {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #2a2a3d;
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.95rem;
          transition: 0.3s ease;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 0 2px #ff6a32;
        }
      `}</style>
    </div>
  );
}
