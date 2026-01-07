import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { createCalendarEvent, getFreeBusy } from '@/lib/calendar';
import { getService } from '@/lib/services';
import { parse, addMinutes, isBefore } from 'date-fns';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { serviceId, date, time, customer } = body; // customer = { name, email, phone }

        if (!serviceId || !date || !time || !customer) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get Service Details
        const service = getService(serviceId);
        if (!service) {
            return NextResponse.json({ error: 'Invalid Service' }, { status: 400 });
        }

        // 2. Parse Dates
        // date comes as ISO string or similar from frontend.
        // time comes as "9:00 AM"

        // Combine date component and time component
        const baseDate = new Date(date);
        const parsedTime = parse(time, 'h:mm a', baseDate);

        const startTime = parsedTime;
        const endTime = addMinutes(startTime, service.durationMinutes);

        // 3. Double Check Availability (Race Condition Prevention)
        const busySlots = await getFreeBusy(startTime, endTime);
        if (busySlots && busySlots.length > 0) {
            return NextResponse.json({ error: 'Slot is no longer available. Please choose another.' }, { status: 409 });
        }

        // Check if we are in Mock DB Mode
        const isMockDb = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

        if (isMockDb) {
            console.log("========================================");
            console.log("[MOCK DB MODE] Supabase credentials missing");
            console.log("Skipping DB writes for Customer and Booking.");
            console.log(`Booking for: ${customer.email} on ${date} at ${time}`);
            console.log("========================================");
        } else {
            // 4. Create/Update Customer in Supabase
            // We try to find by email first
            const { data: existingCustomer } = await supabaseAdmin
                .from('customers')
                .select('id')
                .eq('email', customer.email)
                .single();

            let customerId = existingCustomer?.id;

            if (!customerId) {
                const { data: newCustomer, error: createError } = await supabaseAdmin
                    .from('customers')
                    .insert({
                        email: customer.email,
                        name: customer.name,
                        phone: customer.phone
                    })
                    .select()
                    .single();

                if (createError) {
                    console.error('Customer Creation Error:', createError);
                    return NextResponse.json({ error: 'Failed to create customer record' }, { status: 500 });
                }
                customerId = newCustomer.id;
            }

            // 5. Create Booking in Supabase
            const { error: bookingError } = await supabaseAdmin.from('bookings').insert({
                customer_id: customerId,
                service_id: service.id,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                price: service.priceStart,
                status: 'confirmed'
            });

            if (bookingError) {
                console.error('Booking Insert Error:', bookingError);
                return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
            }
        }

        // 6. Create Calendar Event (External Sync)
        try {
            await createCalendarEvent(
                startTime,
                endTime,
                `${customer.name} - ${service.name}`,
                `Phone: ${customer.phone}\nService: ${service.name}\nDuration: ${service.durationMinutes}m`,
                customer.email
            );
        } catch (calError) {
            console.error('Google Calendar Error:', calError);
        }

        // 7. Send Confirmation Email
        try {
            const { sendConfirmationEmail } = await import('@/lib/email');
            await sendConfirmationEmail(customer.email, customer.name, service.name, startTime);
        } catch (emailError) {
            console.error('Email Sending Error:', emailError);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Server Booking Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
