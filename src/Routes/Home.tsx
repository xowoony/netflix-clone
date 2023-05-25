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
  top: -65px;
`;

// 슬라이더 row
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

// 슬라이더 안 박스
const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 64px;
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

// 슬라이더 - variants
const rowVariants = {
  // 안보일 때 x: 사용자의 화면 크기를 받아와야 함.
  hidden: {
    x: window.outerWidth + 5, // 1과 6이 붙어있기 때문에 +10
  },
  // 보일 때
  visible: {
    x: 0,
  },
  // 사라질 때
  exit: {
    x: -window.outerWidth - 10,
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

  // 슬라이더 빨리 누를때 간격 벌어지는 것 해결
  const [leaving, setLeaving] = useState(false);

  // index를 증가시키는 함수
  const increaseIndex = () => {
    if (leaving) return; // 한번 더 클릭하면 leaving이 true가 되어 리턴되어 아무일도 일어나지 않음.
    setLeaving(true);
    setIndex((prev) => prev + 1);
  };

  // toggle leaving
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // <></> 공통된 부모 없이 연이어 리턴하기
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            {/* 슬라이더. variants 적용 */}
            {/* Row를 AnimatePresence로 감싸서 key를 넘겨주어 render해줌. */}
            {/* onExitComplete에 함수를 넣으면 exit이 끝났을 때 실행됨 */}
            {/* initial을 false로 주면 처음 home에 들어왔을때 슬라이드가 움직이지 않고 고정되어 있음. */}
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit" // 원래의 Row가 파괴될 때 exit이 실행됨
                transition={{ type: "tween", duration: 1 }}
                key={index} // key만 바꿔줌. key가 변경되면 새로운 Row가 만들어졌다고 생각함.
                // 그리고 원래 있던 Row는 파괴된다.
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>{i}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
