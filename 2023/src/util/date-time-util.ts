export function getCurrentDateTimeStr(): string {
  const currentDate = new Date();

  // Get the date components
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();

  // Get the time components
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  // Format the time as AM/PM
  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  // Construct the formatted string
  const formattedDateTime = `[${month}-${day}-${year}] ${formattedHours}:${formattedMinutes} ${amOrPm}`;

  return formattedDateTime;
}
