import React from 'react';
import { Info } from 'lucide-react';
import { SiteSetting } from '../../../types/settings';

interface SettingFieldProps {
  setting: SiteSetting;
}

export default function SettingField({ setting }: SettingFieldProps) {
  const baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm";
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <label 
          htmlFor={setting.key}
          className="block text-sm font-medium text-gray-700"
        >
          {setting.label}
        </label>
        {setting.description && (
          <div className="group relative">
            <Info className="h-4 w-4 text-gray-400 cursor-help" />
            <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
              {setting.description}
            </div>
          </div>
        )}
      </div>
      <div className="mt-1">
        {renderInput(setting, baseClasses)}
      </div>
    </div>
  );
}

function renderInput(setting: SiteSetting, baseClasses: string) {
  let value = setting.value;
  if (typeof value === 'object') {
    value = JSON.stringify(value, null, 2);
  } else if (typeof value === 'boolean') {
    value = value.toString();
  }

  switch (setting.type) {
    case 'textarea':
      return (
        <textarea
          id={setting.key}
          name={setting.key}
          rows={3}
          defaultValue={value}
          className={baseClasses}
          placeholder={`Enter ${setting.label.toLowerCase()}`}
        />
      );
    
    case 'boolean':
      return (
        <select
          id={setting.key}
          name={setting.key}
          defaultValue={value}
          className={baseClasses}
        >
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      );
    
    case 'select':
      return (
        <select
          id={setting.key}
          name={setting.key}
          defaultValue={value}
          className={baseClasses}
        >
          {setting.options?.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    
    case 'json':
      return (
        <textarea
          id={setting.key}
          name={setting.key}
          rows={4}
          defaultValue={value}
          className={`${baseClasses} font-mono text-sm`}
          placeholder="Enter valid JSON"
        />
      );
    
    case 'number':
      return (
        <input
          type="number"
          id={setting.key}
          name={setting.key}
          defaultValue={value}
          className={baseClasses}
          placeholder={`Enter ${setting.label.toLowerCase()}`}
        />
      );
    
    case 'email':
      return (
        <input
          type="email"
          id={setting.key}
          name={setting.key}
          defaultValue={value}
          className={baseClasses}
          placeholder={`Enter ${setting.label.toLowerCase()}`}
        />
      );
    
    default:
      return (
        <input
          type="text"
          id={setting.key}
          name={setting.key}
          defaultValue={value}
          className={baseClasses}
          placeholder={`Enter ${setting.label.toLowerCase()}`}
        />
      );
  }
}