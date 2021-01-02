const fetchCredits = async (id) => {
  return await fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TGDB_API_KEY}`
  );
};

export { fetchCredits };
