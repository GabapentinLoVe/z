import React from 'react';

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
};

const InputField: React.FC<Props> = ({ label, name, value, onChange, required = false, type = 'text' }) => (
  <div className="input-field">
    <label htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
      autoComplete="off"
    />
  </div>
);

export default InputField; 