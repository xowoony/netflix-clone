import { useQuery } from "react-query";
import { getMovies } from "./api";

function Home() {
  // useQuery
  // 기본적으로 key를 제공해주어야 한다. (문자열 or 배열)
  // getMovies 로 api를 가져옴.
  const { data, isLoading } = useQuery(["movies", "nowPlaying"], getMovies); // movies, nowPlaying => 식별자
  console.log(data, isLoading);
  return <div style={{ height: "200vh" }}>Home</div>;
}

export default Home;
