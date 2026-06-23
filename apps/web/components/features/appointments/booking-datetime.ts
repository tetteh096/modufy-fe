/** Combine local date (YYYY-MM-DD) and time (HH:mm) into RFC3339 UTC. */
export function combineDateAndTime(date: string, time: string): string {
  return new Date(`${date}T${time}:00`).toISOString();
}

export function isDateTimeInFuture(date: string, time: string): boolean {
  return new Date(`${date}T${time}:00`).getTime() > Date.now();
}
