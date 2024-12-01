import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import SettingsCategory from '../../components/admin/settings/SettingsCategory';
import SettingForm from '../../components/admin/settings/SettingForm';
import Modal from '../../components/Modal';
import { useSettings } from '../../hooks/useSettings';
import type { SiteSetting } from '../../types/settings';

export default function Settings() {
  const { settings, loading, error, updateSetting, createSetting, deleteSetting } = useSettings();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SiteSetting | null>(null);

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin' },
    { label: 'Settings' }
  ];

  const handleUpdate = async (settingData: Partial<SiteSetting>) => {
    if (!selectedSetting) return;
    const { error } = await updateSetting(selectedSetting.key, settingData.value);
    if (!error) {
      setIsModalOpen(false);
      setSelectedSetting(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setSaveError(error instanceof Error ? error.message : 'Failed to update setting');
    }
  };

  const handleCreate = async (settingData: Omit<SiteSetting, 'id'>) => {
    const { error } = await createSetting(settingData);
    if (!error) {
      setIsModalOpen(false);
      setSelectedSetting(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setSaveError(error instanceof Error ? error.message : 'Failed to create setting');
    }
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm('Are you sure you want to delete this setting?')) return;
    const { error } = await deleteSetting(key);
    if (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to delete setting');
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  const categories = Array.from(new Set(settings.map(s => s.category)));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-3xl font-bold">Site Settings</h1>
            <p className="mt-2 text-gray-600">Manage your website's configuration and preferences</p>
          </div>
          <button
            onClick={() => {
              setSelectedSetting(null);
              setIsModalOpen(true);
            }}
            className="btn flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Setting
          </button>
        </div>
      </div>

      {saveError && <ErrorMessage message={saveError} />}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">Settings updated successfully!</p>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No settings found. Click "Add Setting" to create your first setting.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map(category => (
            <SettingsCategory
              key={category}
              category={category}
              settings={settings.filter(s => s.category === category)}
              onEdit={(setting) => {
                setSelectedSetting(setting);
                setIsModalOpen(true);
              }}
              onDelete={(key) => handleDelete(key)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSetting(null);
        }}
        title={selectedSetting ? 'Edit Setting' : 'Add Setting'}
      >
        <SettingForm
          initialData={selectedSetting}
          onSubmit={selectedSetting ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedSetting(null);
          }}
        />
      </Modal>
    </div>
  );
}