interface IcsEvent {
  title: string;
  description: string;
  location: string;
  start: Date;
  durationMinutes: number;
}

const toIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

const escapeIcsText = (text: string) => text.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');

// Builds a standard .ics file and triggers a browser download — this is real, works with any
// calendar app (Google/Apple/Outlook all import .ics), and needs no external API or OAuth.
export const downloadIcsEvent = ({ title, description, location, start, durationMinutes }: IcsEvent) => {
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MindCare//Event//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@mindcare`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
