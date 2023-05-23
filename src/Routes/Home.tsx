import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "./api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgPhoto}); // 배경 어두워지게 (cover)
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  font-family: "Carter One", cursive;
  width: 40%;
  color: ${(props) => props.theme.white.lighter};
`;


// 슬라이더
const Slider = styled.div`

`;


// 슬라이더 가로
const Row = styled(motion.div)`

`;

// 슬라이더 안 박스
const Box = styled(motion.div)`

`;

const Overview = styled.p`
  color: #fff;
  font-size: 1.2vw;
  font-weight: 400;
  line-height: normal;
  margin-top: 0.1vw;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);
  width: 40%;
`;

function Home() {
  // useQuery
  // 기본적으로 key를 제공해주어야 한다. (문자열 or 배열)
  // getMovies 로 api를 가져옴.
  // 타입스크립트에게 useQuery의 결과가 IGetMoviesResult 타입이라고 알려주기
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  ); // movies, nowPlaying => 식별자
  console.log(data, isLoading);
  // <></> 공통된 부모 없이 연이어 리턴하기
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <Row>
              <Box />
              <Box />
              <Box />
              <Box />
              <Box />
              <Box />
            </Row>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
