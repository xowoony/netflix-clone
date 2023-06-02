import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "./api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import useWindowDimensions from "../Components/WindowDimensions";
import { useMatch, PathMatch, useNavigate } from "react-router-dom";

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
  font-family: "Black Han Sans", sans-serif;
  width: 40%;
  color: ${(props) => props.theme.white.lighter};
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.35);
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

const Overview = styled(motion.p)`
  color: #fff;
  font-size: 1.2vw;
  font-weight: 400;
  line-height: normal;
  margin-top: 0.1vw;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.45);
  width: 40%;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const PlayButton = styled.button`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  padding: 0.7rem 2rem;
  margin-right: 1rem;
  border: none;
  &:hover {
    background-color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
  }
  div {
    font-size: 1.2rem;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
`;

const PlayIcon = styled.div`
  margin-right: 0.5rem;
`;

const InfoIcon = styled.div`
  margin-right: 0.5rem;
`;

const InfoButton = styled.button`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 5px;
  border: none;
  padding: 0.7rem 1.7rem;
  background-color: #787878b8;
  color: white;
  &:hover {
    background-color: #a2a2a26b;
    cursor: pointer;
  }
  div {
    font-size: 1.2rem;
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
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
  /* position: relative; // 요소 자기 자신을 기준으로 배치 */
  // 첫번째 박스 hover시 확대 될 때 왼쪽이 잘리지 않게 하기 위해
  &:first-child {
    transform-origin: center left;
  }
  // 마지막 박스 hover시 확대 될 때 오른쪽이 잘리지 않게 하기 위해
  &:last-child {
    transform-origin: center right;
  }
`;

// box hover시 나타나는 info
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute; // 부모(조상) 요소를 기준으로 배치
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

// overlay - 사용자가 overlay를 클릭시 팝업이 사라지게 해야함.
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 850px;
  height: 600px;
  border-radius: 10px;
  background-color: rgb(23, 22, 22);
  right: 350px;
  margin: 0 auto;
`;

// 영화 클릭시 팝업창에 들어갈 이미지
const BigCover = styled.img`
  width: 100%;
  height: 400px;
  border-radius: 10px;
`;

// 영화 클릭시 팝업창에 들어갈 영화제목
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
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

// variants - infoVariants의 부모
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.4, // hover 상태에서만 따로 딜레이 주기
      duration: 0.3,
      type: "tween",
    },
  },
};

// infoVariants - infoVariants의 자식
const infoVariants = {
  // 같은 key (hover) 를 가진 자식이므로 부모와 똑같이 작동함
  hover: {
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: "tween",
    }, // hover시 opacity 가 1이고 위에서 Info 스타일링 해준 곳에서는 0으로 설정
  },
};

function Home() {
  // useHistory() => useNavigate() 로 바뀜
  // box hover시 나오는 info =>  url을 바꾸어주기 위해 Navigate object에 접근
  // useNavigate 훅을 사용하면 URL을 왔다갔다 할 수 있음.(여러 route 사이를 움직일 수 있음)
  const navigate = useNavigate();
  // match
  const bigMovieMatch: PathMatch<string> | null = useMatch("/movies/:movieId");
  // useScroll - 영화 클릭시 팝업창 스크롤
  const { scrollY } = useScroll();

  // useQuery
  // 기본적으로 key를 제공해주어야 한다. (문자열 or 배열)
  // getMovies 로 api를 가져옴.
  // 타입스크립트에게 useQuery의 결과가 IGetMoviesResult 타입이라고 알려주기
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  ); // movies, nowPlaying => 식별자

  // 더보기
  const [readMore, setReadMore] = useState(false);

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

  // Box 클릭시 url 바꿔주기
  const onBoxClicked = (movieId: number) => {
    // movieId를 인자로 받음(클릭한 영화의 id를 알아야 하기 때문)
    navigate(`/movies/${movieId}`);
  };

  // 영화정보 팝업창 뜬 다음 바깥쪽 (overlay) 클릭시 팝업창 사라지게
  const onOverlayClick = () => navigate(-1);

  // 영화 클릭시

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch.params.movieId
    );
  console.log(clickedMovie);
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
            {/* 시놉시스 */}
            <Overview>
              {readMore
                ? data?.results[0].overview
                : `${data?.results[0].overview.substring(0, 100)}...`}
              <span
                style={{ color: "#bfbcbc", cursor: "pointer" }}
                onClick={() => setReadMore(!readMore)}
              >
                {readMore ? "[닫기]" : "[더보기]"}
              </span>
            </Overview>
            <ButtonContainer>
              <PlayButton>
                <PlayIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Play"
                  >
                    <path
                      d="M4 2.69127C4 1.93067 4.81547 1.44851 5.48192 1.81506L22.4069 11.1238C23.0977 11.5037 23.0977 12.4963 22.4069 12.8762L5.48192 22.1849C4.81546 22.5515 4 22.0693 4 21.3087V2.69127Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </PlayIcon>
                <div>재생</div>
              </PlayButton>
              <InfoButton>
                <InfoIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Info"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM13 10V18H11V10H13ZM12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </InfoIcon>
                <div>상세 정보</div>
              </InfoButton>
            </ButtonContainer>
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
                      layoutId={movie.id + ""} // + "" 작성으로 string으로 변환 (movie.id는 number이기 때문)
                      key={movie.id}
                      variants={boxVariants}
                      whileHover="hover" // hover시 1.3배
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      $bgPhoto={makeImagePath(movie.backdrop_path, "w500")} // 영화 슬라이드 사진 w500 작성으로 크기 조절
                    >
                      {/* <Info /> 부모인 Box 의 whileHover도 상속됨 */}
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          {/* 영화정보 팝업 - url이 있을 경우에만 (영화 클릭시에만) 나타나게. */}
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                {/* Overlay */}
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
                {/* 영화 클릭시 뜨는 정보 팝업창 */}
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId} // 위 Box 컴포넌트 layoutId랑 같이 작성. match
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        src={makeImagePath(clickedMovie.backdrop_path, "w500")}
                        alt=""
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
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
