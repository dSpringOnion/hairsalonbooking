import { google } from 'googleapis';

// 1. Service Account Auth
// We expect GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL in .env
// The Service Account must be shared with the Calendar ID (CALENDAR_ID)

const SCOPES = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'];

// Sanitize the key: handle literal \n, actual newlines, and ensure headers are intact
const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ?.replace(/\\n/g, '\n') // Replace literal \n with actual newline
    .replace(/"/g, '')      // Remove any extra double quotes possibly included in the paste
    .trim();                // Remove whitespace

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
    },
    scopes: SCOPES,
});

const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

export type TimeSlot = {
    start: string; // ISO string
    end: string;
    available: boolean;
};

export async function getFreeBusy(start: Date, end: Date) {
    if (!CALENDAR_ID) return null; // Mock mode if no env

    const response = await calendar.freebusy.query({
        requestBody: {
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            items: [{ id: CALENDAR_ID }],
        },
    });

    return response.data.calendars?.[CALENDAR_ID]?.busy || [];
}

export async function createCalendarEvent(
    start: Date,
    end: Date,
    summary: string,
    description: string,
    customerEmail?: string
) {
    if (!CALENDAR_ID) {
        console.log("Mock Connection: Event created", { start, summary });
        return { id: 'mock-id' };
    }

    const event = {
        summary: summary,
        description: description,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
    };

    const response = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
    });

    return response.data;
}
