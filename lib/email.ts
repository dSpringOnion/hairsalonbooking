export async function sendConfirmationEmail(
    to: string,
    customerName: string,
    serviceName: string,
    date: Date
) {
    // In a real application, you would use Resend, SendGrid, or AWS SES here.
    // Example with Resend:
    // await resend.emails.send({ ... })

    console.log(`
    ========================================
    [MOCK EMAIL SENT]
    To: ${to}
    Subject: Booking Confirmed: ${serviceName}
    ----------------------------------------
    Hi ${customerName},

    Your appointment for ${serviceName} is confirmed!
    
    When: ${date.toLocaleString()}
    
    See you soon,
    Aura Salon
    ========================================
    `);

    return true;
}

export async function sendReminderEmail(
    to: string,
    customerName: string,
    time: string
) {
    console.log(`[MOCK REMINDER] Sending reminder to ${to} for tomorrow at ${time}`);
    return true;
}
