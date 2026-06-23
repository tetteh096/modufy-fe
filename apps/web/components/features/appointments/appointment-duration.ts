export function appointmentDurationMinutes(startIso: string, endIso: string) {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  return Math.max(1, Math.round(ms / 60_000));
}

export function formatAppointmentDuration(mins: number) {
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  if (!remainder) return hours === 1 ? "1 hr" : `${hours} hr`;
  return `${hours} hr ${remainder} min`;
}
