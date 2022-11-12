const API_KEY = "9f7fcfb89060f60bc8c05ddfb6ffaa02";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  popularity: string;
  release_date: string;
  vote_average: number;
  name: string;
  media_type: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ISearchResult {
  keyword?: string;
  results: IMovie[];
}
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&region=kr`).then((response) => response.json());
}
export function getTvs() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&region=kr`).then((response) => response.json());
}

export function getSearch({ keyword }: { keyword: string | undefined }) {
  return fetch(`
  ${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}&page=1
`).then((response) => response.json());
}
