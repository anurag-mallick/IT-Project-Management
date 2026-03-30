// Updated to use local /api/upload route
export async function uploadAttachment(ticketId: number, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('ticketId', ticketId.toString());

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload attachment');
  }

  const data = await response.json();

  return {
    path: data.url,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

export async function getFileUrl(path: string) {
  // Local files in /public/uploads are served directly
  return path;
}
