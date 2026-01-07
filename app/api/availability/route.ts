import { NextResponse } from 'next/server';
import { getFreeBusy } from '@/lib/calendar';
import { addMinutes, parse, set, startOfDay, endOfDay, isBefore } from 'date-fns';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const durationParam = searchParams.get('duration');

    if (!dateParam || !durationParam) {
        return NextResponse.json({ error: 'Missing date or duration' }, { status: 400 });
    }

    const date = new Date(dateParam);
    const durationMinutes = parseInt(durationParam);

    // Hardcoded Business Hours / Slots (Matching the frontend for now)
    // In a real app, this might come from a DB configuration
    const TIME_SLOTS = [
        "9:00 AM", "10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"
    ];

    try {
        // Query Google Calendar for the whole day
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const busyIntervals = await getFreeBusy(dayStart, dayEnd);

        // If Google API failed or mocked, we might get null/empty. 
        // If null (API error), best to default to "open" or "closed"? 
        // For MVP, if API fails, we likely fall back to nothing available to prevent double booking safety, 
        // OR we let them try and fail at booking time. Let's assume empty means free for now.
        const safeBusyIntervals = busyIntervals || [];

        const availableSlots = [];

        for (const timeStr of TIME_SLOTS) {
            // Parse the slot time on the given date
            const slotStart = parse(timeStr, 'h:mm a', date);
            const slotEnd = addMinutes(slotStart, durationMinutes);

            // Check overlap
            let isBusy = false;

            for (const interval of safeBusyIntervals) {
                const busyStart = new Date(interval.start!); // Google returns RFC3339 strings
                const busyEnd = new Date(interval.end!);

                // Logic: Access denied if (SlotStart < BusyEnd) AND (SlotEnd > BusyStart)
                if (isBefore(slotStart, busyEnd) && isBefore(busyStart, slotEnd)) {
                    isBusy = true;
                    console.log(`Slot ${timeStr} blocked by event: ${busyStart.toISOString()} - ${busyEnd.toISOString()}`);
                    break;
                }
            }

            if (!isBusy) {
                availableSlots.push(timeStr);
            }
        }

        return NextResponse.json({ slots: availableSlots });

    } catch (error) {
        console.error('Availability Check Error:', error);
        return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
    }
}
