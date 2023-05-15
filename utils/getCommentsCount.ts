const getCommentsCount = (data: Array<Array<any>>) => {
  if (!data.length) return 0;
  let count = 0;
  for (const item of data) {
    count += item.length;
  }
  return count;
};
export default getCommentsCount;
