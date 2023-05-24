import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "./api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
  position: relative;
`;

// 슬라이더 row
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

// 슬라이더 안 박스
const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
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

// variants
const rowVariansts = {
  // 안보일 때
  hidden: {
    x: 1000,
  },
  // 보일 때
  visible: {
    x: 0,
  },
  // 사라질 때
  exit: {
    x: -1000,
  },
};

function Home() {
  // useQuery
  // 기본적으로 key를 제공해주어야 한다. (문자열 or 배열)
  // getMovies 로 api를 가져옴.
  // 타입스크립트에게 useQuery의 결과가 IGetMoviesResult 타입이라고 알려주기
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  ); // movies, nowPlaying => 식별자

  // index 시스템 : 작성해주고 밑에서 이 index를 Row의 key로 넘겨줌
  const [index, setIndex] = useState(0);
  // index를 증가시키는 함수
  const increaseIndex = () => setIndex((prev) => prev + 1);
  // <></> 공통된 부모 없이 연이어 리턴하기
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner onClick={increaseIndex}  bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            {/* Row를 AnimatePresence로 감싸서 key를 넘겨주어 render해줌. */}
            <AnimatePresence>
              <Row
                variants={rowVariansts}
                initial="hidden"
                animate="visible"
                exit="exit"
                key={index}
              >
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
                <Box />
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
