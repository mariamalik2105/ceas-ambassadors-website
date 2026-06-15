const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const recipient = process.env.NOTIFICATION_RECIPIENT_EMAIL;

async function sendSignupNotification(event, member, status) {
  if (!emailUser || !emailPass || !recipient) {
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const payload = {
      email: member.email,
      firstName: member.first_name || '',
      lastName: member.last_name || '',
      eventTitle: event.title,
      startTime: event.start_time ? new Date(event.start_time).toISOString() : '',
      endTime: event.end_time ? new Date(event.end_time).toISOString() : '',
      eventDate: event.start_time ? new Date(event.start_time).toLocaleDateString('en-US', { timeZone: 'America/New_York' }) : '',
      eventStartTime: event.start_time ? new Date(event.start_time).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }) : '',
      eventEndTime: event.end_time ? new Date(event.end_time).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }) : '',
      location: event.location || '',
      status,
      description: event.description || '',
    };

    await transporter.sendMail({
      from: emailUser,
      to: recipient,
      subject: `[EVENT-SIGNUP] ${event.title}`,
      text: JSON.stringify(payload, null, 2),
    });

    console.log(`Successfully sent signup email notification for ${member.email}`);
  } catch (err) {
    console.error('Error sending signup email notification:', err.message || err);
  }
}

module.exports = {
  sendSignupNotification,
};
