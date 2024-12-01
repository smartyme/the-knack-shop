import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

const BUCKET_NAME = 'product-images';

export async function uploadProductImage(file: File) {
  try {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      throw new Error('File must be JPEG, PNG, or WebP');
    }

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to upload images');
    }

    // Create a unique file name
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { publicUrl: null, error };
  }
}

export async function deleteProductImage(imageUrl: string) {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be logged in to delete images');
    }

    // Extract the file path from the URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Get user_id/filename

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting image:', error);
    return { error };
  }
}