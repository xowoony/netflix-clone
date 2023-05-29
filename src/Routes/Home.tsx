import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "./api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "../Components/WindowDimensions";

const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Banner = styled.div<{ $bgPhoto: string }>`
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
    url(${(props) => props.$bgPhoto}); // 배경 어두워지게 (cover)
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

// 슬라이더 안 박스 : bgPhoto를 작성해주고 background-image를 작성해주면 된다.
const Box = styled(motion.div)<{ $bgPhoto: string }>`
  border-radius: 0.2vw;
  background-color: white;
  background-image: url(${(props) => props.$bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 150px;
  color: black;
  font-size: 30px;
  cursor: pointer;
  // 첫번째 박스 hover시 확대 될 때 왼쪽이 잘리지 않게 하기 위해
  &:first-child {
    transform-origin: center left;
  }
  // 마지막 박스 hover시 확대 될 때 오른쪽이 잘리지 않게 하기 위해
  &:last-child {
    transform-origin: center right;
  }
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
// const rowVariants = {
//   // 안보일 때 x: 사용자의 화면 크기를 받아와야 함.
//   hidden: {
//     x: window.outerWidth + 5, // 1과 6이 붙어있기 때문에 +10
//   },
//   // 보일 때
//   visible: {
//     x: 0,
//   },
//   // 사라질 때
//   exit: {
//     x: -window.outerWidth - 5,
//   },
// };

// 페지네이션
const offset = 6; // 한번에 보여주고자 하는 영화의 수. 그리고 밑 Box에서 모든 영화가 담긴 배열을 자르면 됨.

// variants
const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.4,
      type: "tween",
    },
  }, // hover 상태에서만 따로 딜레이 주기
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
    // if문을 써줌으로 인해 data는 반드시 number일 것이다.
    if (data) {
      if (leaving) return; // 한번 더 클릭하면 leaving이 true가 되어 리턴되어 아무일도 일어나지 않음.
      setLeaving(true);
      // 영화 갯수 알아보기
      const totalMovie = data.results.length - 1; // 이미 영화 하나는 사용하고 있기 때문에 -1
      // page가 0에서부터 시작하기 때문에  maxIndex도 1을 감소시켜주어야 한다.
      const maxIndex = Math.floor(totalMovie / offset) - 1; // ex ) 4.2와 같을 경우 올림처리
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1)); // index를 증가시키긴 하는데
      // maxindex일 경우 0으로, 아닐경우 +1
    }
  };

  // toggle leaving
  const toggleLeaving = () => setLeaving((prev) => !prev);

  // 슬라이드 겹침현상 해결하기
  const width = useWindowDimensions();

  // <></> 공통된 부모 없이 연이어 리턴하기
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            $bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
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
                initial={{ x: width + 10 }} // variants를 없애고 컴포넌트에 직접 initial, animate, exit prop을 전달하여 슬라이드 겹침 현상을 해결
                animate={{ x: 0 }}
                exit={{ x: -width - 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index} // key만 바꿔줌. key가 변경되면 새로운 Row가 만들어졌다고 생각함.
                // 그리고 원래 있던 Row는 파괴된다.
              >
                {/* slice(1) 을 해주는 이유는 이미 홈의 배경화면으로 쓴 사진은 제외시켜주어야 하기 때문. */}
                {/* offset*index에서 index는 페이지임. 0, 1, 2, 3 이런식으로 증가함. */}
                {/* index가 너무 높아지면 문제가 생김. 영화 갯수에 한계가 있기 때문 */}
                {/* 페이징 */}
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      variants={BoxVariants}
                      whileHover="hover" // hover시 1.3배
                      initial="normal"
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(movie.backdrop_path, "w500")} // 영화 슬라이드 사진 w500 작성으로 크기 조절
                    ></Box>
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

/* // offset과 page를 기반으로 해서 배열 자르기
// 6개를 잘라오고, 그 다음 여섯개를 잘라오기

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].slice(0, 2)

처음에 page는 0이고 offset은 6이니까 6 * 0을 해서 0이 될 것임.
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].slice(offset*page, offset*page + offset)

그럼 0에서 시작해서 6에서 끝나게 됨.
*/
