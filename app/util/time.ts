export const formatTimeDifference = (
  lastClaimTime: Date,
  currentTime: Date,
): string => {
  const difference = currentTime.getTime() - lastClaimTime.getTime();
  const hours = difference / (1000 * 60 * 60);
  return `${hours.toFixed(2)}`;
};

export function capitalizeFirstLetterOfEachWord(text: string) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}
