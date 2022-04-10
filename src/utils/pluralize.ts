const pluralize = (item: string, count = 2): string => {
  if (count === 1) {
    return `1 ${item}`;
  }
  return `${count} ${item}s`;
};

export default pluralize;
