export function shortenString(str: string, startLength = 4, endLength = 5) {
  if (str.length <= startLength + endLength) {
    return str;
  }

  const start = str.substring(0, startLength);
  const end = str.substring(str.length - endLength);
  return `${start}...${end}`;
}
