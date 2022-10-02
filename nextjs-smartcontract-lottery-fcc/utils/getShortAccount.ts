export const getShortAccount = ({
  value = "",
  start = 6,
  end = 4,
}: {
  value?: string;
  start?: number;
  end?: number;
}) => {
  if (!value || !value.length || value.length <= start + end) {
    return value;
  }
  return value.slice(0, start) + "..." + value.slice(value.length - end);
};
