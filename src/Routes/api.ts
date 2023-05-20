const API_KEY = "e03a93d879218d0e8080eba916c8afdf";
const BASE_PATH = "https://api.themoviedb.org/3/";

// api fetch
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
