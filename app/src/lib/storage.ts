// Note: Supabase Storage is disabled. Please integrate an alternative like Vercel Blob or S3.
import { put } from '@vercel/blob';

export async function uploadAttachment(ticketId: number, file: File) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `tickets/${ticketId}/${Date.now()}-${sanitizedName}`;

  const blob = await put(path, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return {
    path: blob.url,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}`,
    name: file.name,
    size: file.size,
    type: file.type
  };
}

export async function getFileUrl(path: string) {
  return ''; // Return empty string as storage is disabled
}
