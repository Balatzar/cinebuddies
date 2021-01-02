const fetcher = async (url) => {
  console.time(`fetching: ${url}`);
  const res = await fetch(url);
  console.timeEnd(`fetching: ${url}`);
  return res;
};

const fetchCredits = async (id) => {
  return await fetcher(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TGDB_API_KEY}&append_to_response=combined_credits`
  );
};

const fetchMediaDetailsAndCredits = async (id, type) => {
  return await fetcher(
    `https://api.themoviedb.org/3/${type ? "movie" : "tv"}/${id}?api_key=${
      process.env.TGDB_API_KEY
    }&language=en-US&append_to_response=credits`
  );
};

export { fetchCredits, fetchMediaDetailsAndCredits };
