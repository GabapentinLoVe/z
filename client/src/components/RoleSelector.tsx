import React from 'react';

type Props = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  roles: readonly string[];
};

const RoleSelector: React.FC<Props> = ({ value, onChange, roles }) => (
  <div className="role-selector">
    <label htmlFor="role">Роль</label>
    <select id="role" name="role" value={value} onChange={onChange} required>
      <option value="">Выберите роль</option>
      {roles.map((role) => (
        <option key={role} value={role}>{role}</option>
      ))}
    </select>
  </div>
);

export default RoleSelector; 