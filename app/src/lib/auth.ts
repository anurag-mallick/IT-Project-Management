import { NextRequest, NextResponse } from 'next/server';
import { createClient } from './supabase/server';

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('getUser error:', err);
    return null;
  }
}

export async function verifyUser() {
  const user = await getUser();
  if (!user) {
    return { user: null, error: 'Unauthorized' };
  }
  return { user, error: null };
}

// Higher order function for API route protection
export function withAuth(handler: (req: NextRequest, user: any, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any) => {
    // For API routes, session check is faster than full getUser
    const supabase = await createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return handler(req, session.user, context);
  };
}
