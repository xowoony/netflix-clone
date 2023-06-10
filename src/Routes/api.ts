const API_KEY = "e03a93d879218d0e8080eba916c8afdf";
const BASE_PATH = "https://api.themoviedb.org/3/";
// 
const LANGUAGE = "ko-KO";
const REGION = "KR";
const TAIL_PATH = `api_key=${API_KEY}&language=${LANGUAGE}&region=${REGION}`;

// IMovie 인터페이스
interface IMovie {
  popularity: number;
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  original_title: string;
  adult: boolean;
  video: boolean;
  release_date: string;
}

// GetMoviesResult(getMovies의 결과) 인터페이스 객체
export interface IGetMoviesNowPlayingResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

// api fetch
// export function getMovies() {
//   return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
//     (response) => response.json()
//   );
// }

// Movies - NowPlaying
export function getMovieNowPlaying() {
  return fetch(`${BASE_PATH}/movie/now_playing?${TAIL_PATH}`).then((response) =>
    response.json()
  );
}
