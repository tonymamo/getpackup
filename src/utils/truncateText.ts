const truncateText = (string: string | null | undefined, maxChars: number) => {
  if (string === undefined || string === null) {
    return string;
  }
  return string.length > maxChars ? `${string.substring(0, maxChars)}…` : string;
};

export default truncateText;
