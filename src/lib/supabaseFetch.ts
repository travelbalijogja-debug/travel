const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

// Fungsi helper untuk mengambil data dari tabel manapun
export async function fetchSupabase(table: string, query: string = 'select=*'): Promise<any[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      method: 'GET',
      headers: HEADERS,
      next: { revalidate: 0 } // No cache supaya data selalu baru dari admin
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${table}:`, error);
    return [];
  }
}

// Fungsi helper untuk mengupdate data (Admin)
export async function updateSupabase(table: string, matchColumn: string, matchValue: string, payload: any) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchColumn}=eq.${matchValue}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Error updating ${table}:`, error);
    return null;
  }
}

// Fungsi helper untuk menghapus data (Admin)
export async function deleteSupabase(table: string, matchColumn: string, matchValue: string) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${matchColumn}=eq.${matchValue}`, {
      method: 'DELETE',
      headers: HEADERS
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return true;
  } catch (error) {
    console.error(`Error deleting ${table}:`, error);
    return false;
  }
}

// Fungsi helper untuk Insert data (Admin)
export async function insertSupabase(table: string, payload: any) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Error inserting ${table}:`, error);
    return null;
  }
}

// Fungsi helper untuk Upload File ke Supabase Storage
export async function uploadFile(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Supabase REST storage upload
    const uploadResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/images/${filePath}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': file.type
      },
      body: file
    });

    if (!uploadResponse.ok) throw new Error('Gagal upload file');

    // Return public URL
    return `${SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}
