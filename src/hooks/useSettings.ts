import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteSetting } from '../types/settings';

export function useSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (fetchError) throw fetchError;
      
      const parsedSettings = (data || []).map(setting => ({
        ...setting,
        value: setting.value,
        options: setting.options ? JSON.parse(JSON.stringify(setting.options)) : undefined
      }));

      setSettings(parsedSettings);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const createSetting = async (settingData: Omit<SiteSetting, 'id'>) => {
    try {
      const processedData = {
        ...settingData,
        value: settingData.value?.toString() || '',
        options: settingData.options 
          ? JSON.stringify(settingData.options)
          : null
      };

      const { error } = await supabase
        .from('site_settings')
        .insert([processedData]);

      if (error) throw error;
      await fetchSettings();
      return { error: null };
    } catch (err) {
      console.error('Error creating setting:', err);
      return { error: err };
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: value?.toString() || '' })
        .eq('key', key);

      if (error) throw error;
      await fetchSettings();
      return { error: null };
    } catch (err) {
      console.error('Error updating setting:', err);
      return { error: err };
    }
  };

  const deleteSetting = async (key: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .delete()
        .eq('key', key);

      if (error) throw error;
      await fetchSettings();
      return { error: null };
    } catch (err) {
      console.error('Error deleting setting:', err);
      return { error: err };
    }
  };

  return {
    settings,
    loading,
    error,
    createSetting,
    updateSetting,
    deleteSetting,
    refresh: fetchSettings
  };
}