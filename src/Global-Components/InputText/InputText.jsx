// import React, { useRef, useState } from "react";
// import './InputText.css'

// const InputText = ({label, payload, error, isAllowed, input_name, value, onChange, maxLen = 150, readOnly = false, width = '100%', require= false}) => {
//     const inputRef = useRef();
//     const [focusedField, setFocusedField] = useState('')
//   return (
//     <div
//       className={`delivery-input-container ${
//         focusedField === input_name || value
//           ? "focused"
//           : ""
//       }`}
//       style={{
//         width: width,
//         border: error ? "1px solid var(--primary-color)" : "",
//       }}
//       onClick={() => {
//         isAllowed ? undefined : inputRef.current?.focus();
//       }}
//     >
//       {isAllowed && <div className="input-overlay"></div>}
//       <label className={`floating-label`} style={{color: error ? 'var(--primary-color)' : 'var(--text-gray)'}}>{label}</label>
//       <input
//         type="text"
//         className="input-field-email"
//         ref={inputRef}
//         onFocus={() => setFocusedField(input_name)}
//         onBlur={() => setFocusedField("")}
//         name={input_name}
//         value={value}
//         maxLength={maxLen}
//         readOnly={readOnly}
//         onChange={onChange}
//         required={require}
//       />
//     </div>
//   );
// };

// export default InputText;



import React, { useRef, useState } from "react";
import './InputText.css'

const InputText = ({
  label,
  payload,
  error,
  isAllowed,
  input_name,
  value,
  onChange,
  maxLen = 150,
  readOnly = false,
  width = '100%',
  require = false,
  type = "text"
}) => {

  const inputRef = useRef();
  const [focusedField, setFocusedField] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={`delivery-input-container ${focusedField === input_name || value ? "focused" : ""
        }`}
      style={{
        width: width,
        border: error ? "1px solid var(--primary-color)" : "",
        position: "relative"
      }}
      onClick={() => {
        isAllowed ? undefined : inputRef.current?.focus();
      }}
    >
      {isAllowed && <div className="input-overlay"></div>}

      <label
        className={`floating-label`}
        style={{ color: error ? 'var(--primary-color)' : 'var(--text-gray)' }}
      >
        {label}
      </label>

      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        className="input-field-email"
        ref={inputRef}
        onFocus={() => setFocusedField(input_name)}
        onBlur={() => setFocusedField("")}
        name={input_name}
        value={value}
        maxLength={maxLen}
        readOnly={readOnly}
        onChange={onChange}
        required={require}
      />

      {/* ✅ PROFESSIONAL SVG ICON */}
      {type === "password" && (
        <span
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const input = inputRef.current;

            if (input) {
              const start = input.selectionStart;
              const end = input.selectionEnd;

              setShowPassword((prev) => !prev);

              // Restore cursor AFTER type change
              setTimeout(() => {
                input.setSelectionRange(start, end);
                input.focus();
              }, 0);
            }
          }}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          {showPassword ? (
            // Eye OFF (hidden)
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C7 19 2.73 15.11 1 12c.73-1.3 1.73-2.45 2.94-3.4M9.9 4.24A10.94 10.94 0 0 1 12 5c5 0 9.27 3.89 11 7a10.94 10.94 0 0 1-4.06 4.94M1 1l22 22" />
            </svg>
          ) : (
            // Eye ON (visible)
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </span>
      )}
    </div>
  );
};

export default InputText;