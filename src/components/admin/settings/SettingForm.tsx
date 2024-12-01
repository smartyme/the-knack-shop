import React, { useState } from 'react';
import type { SiteSetting } from '../../../types/settings';

interface SettingFormProps {
  initialData?: SiteSetting | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const SETTING_TYPES = [
  'text',
  'textarea',
  'number',
  'boolean',
  'select',
  'email',
  'json'
];

export default function SettingForm({ initialData, onSubmit, onCancel }: SettingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        key: formData.get('key'),
        value: formData.get('value'),
        category: formData.get('category'),
        label: formData.get('label'),
        type: formData.get('type'),
        description: formData.get('description'),
        options: formData.get('options')
          ? JSON.parse(formData.get('options') as string)
          : undefined
      };

      await onSubmit(data);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to save setting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="key" className="block text-sm font-medium text-gray-700">
          Key
        </label>
        <input
          type="text"
          id="key"
          name="key"
          required
          defaultValue={initialData?.key}
          disabled={!!initialData}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="setting_key"
        />
      </div>

      <div>
        <label htmlFor="label" className="block text-sm font-medium text-gray-700">
          Label
        </label>
        <input
          type="text"
          id="label"
          name="label"
          required
          defaultValue={initialData?.label}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Setting Label"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          required
          defaultValue={initialData?.category}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="general"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue={initialData?.type || 'text'}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          {SETTING_TYPES.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
          Value
        </label>
        <textarea
          id="value"
          name="value"
          required
          rows={3}
          defaultValue={
            typeof initialData?.value === 'object'
              ? JSON.stringify(initialData.value, null, 2)
              : initialData?.value
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={initialData?.description}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Optional description of this setting"
        />
      </div>

      <div>
        <label htmlFor="options" className="block text-sm font-medium text-gray-700">
          Options (JSON array for select type)
        </label>
        <textarea
          id="options"
          name="options"
          rows={2}
          defaultValue={
            initialData?.options
              ? JSON.stringify(initialData.options, null, 2)
              : ''
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 font-mono text-sm"
          placeholder='["option1", "option2"]'
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn"
        >
          {loading ? 'Saving...' : initialData ? 'Update Setting' : 'Create Setting'}
        </button>
      </div>
    </form>
  );
}