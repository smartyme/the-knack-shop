export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  label: string;
  type: string;
  description?: string;
  options?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
}