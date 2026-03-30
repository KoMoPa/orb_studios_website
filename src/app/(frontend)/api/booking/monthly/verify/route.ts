import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

/**
 * POST /api/booking/monthly/verify
 * Verify that an email belongs to a monthly client
 * Returns client details if verified
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config });

    // Find client by email
    const clients = await payload.find({
      collection: 'clients',
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (clients.docs.length === 0) {
      return NextResponse.json(
        { error: 'No client found with this email' },
        { status: 404 }
      );
    }

    const client = clients.docs[0];

    if (!client.isMonthlyClient) {
      return NextResponse.json(
        { error: 'This email is not associated with a monthly client account' },
        { status: 403 }
      );
    }

    // Return client info for the quick booking form
    return NextResponse.json({
      success: true,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        bandName: client.bandName,
        monthlyHoursUsed: client.monthlyHoursUsed || 0,
        monthlyHoursCancelled: client.monthlyHoursCancelled || 0,
        monthlyStartDate: client.monthlyStartDate,
      },
    });
  } catch (error) {
    console.error('Error verifying monthly client:', error);
    return NextResponse.json(
      { error: 'Failed to verify client. Please try again.' },
      { status: 500 }
    );
  }
}
