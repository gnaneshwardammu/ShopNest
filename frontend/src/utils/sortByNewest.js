const getTimestamp = ({ createdAt, _id }) => {
  const createdAtTimestamp = new Date(createdAt).getTime();
  if (!Number.isNaN(createdAtTimestamp)) return createdAtTimestamp;

  // The first four bytes of a MongoDB ObjectId are its creation timestamp.
  return /^[a-f\d]{24}$/i.test(_id) ? parseInt(_id.slice(0, 8), 16) * 1000 : 0;
};

export const sortByNewest = (records) =>
  [...records].sort((a, b) => getTimestamp(b) - getTimestamp(a));
