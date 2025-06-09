// /pages/api/movies.js

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export default async function handler(req, res) {
  const { query = "" } = req.query;

  const url = query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&region=US&api_key=${API_KEY}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&region=US&api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch movies" });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
