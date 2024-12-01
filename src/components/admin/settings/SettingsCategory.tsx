import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import SettingField from './SettingField';
import { SiteSetting } from '../../../types/settings';

interface SettingsCategoryProps {
  category: string;
  settings: SiteSetting[];
  onEdit: (setting: SiteSetting) => void;
  onDelete: (key: string) => void;
}

export default function SettingsCategory({ category, settings, onEdit, onDelete }: SettingsCategoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-xl font-semibold capitalize">
          {category} Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure {category.toLowerCase()} related settings
        </p>
      </div>
      <div className="space-y-6">
        {settings.map(setting => (
          <div key={setting.key} className="relative flex items-start space-x-4">
            <div className="flex-1">
              <SettingField setting={setting} />
            </div>
            <div className="flex items-start space-x-2 pt-6">
              <button
                onClick={() => onEdit(setting)}
                className="p-1.5 rounded-md text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                title="Edit setting"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(setting.key)}
                className="p-1.5 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete setting"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}