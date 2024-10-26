export function calculateDaysPassed(creationTime: string): number {
    const creationDate = new Date(creationTime);
    const currentDate = new Date();
    // const currentDate = new Date('10/27/2024')
  
    // Normalize both dates to midnight
    creationDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
  
    // Calculate the difference in milliseconds
    const difference = currentDate.getTime() - creationDate.getTime();
  
    // Convert milliseconds to days
    return Math.floor(difference / (1000 * 60 * 60 * 24));
}