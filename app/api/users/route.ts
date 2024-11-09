import { NextResponse } from 'next/server';
import { connect } from '@/app/lib/db';
import User from '@/app/lib/models/user.model';

export async function GET() {
  try {
    await connect();
    
    const users = await User.find({})
      .select('name email createdAt')
      .sort({ createdAt: -1 }); // Sort by newest first
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

