import { useQuery } from "react-query";
import { IGetMoviesNowPlayingResult, getMovieNowPlaying } from "./api";
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
  top: -90px;
  margin-left: 60px;
  margin-right: 60px;
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
  margin-right: 0.5rem;
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

const PlusButton = styled.button`
  background-color: #2a2a2a;
  border-color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  border-radius: 2rem;
  width: 2.5rem;
  height: 2.5rem;
  cursor: pointer;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-right: 0.5rem;
  &:hover {
    background-color: #1a1a1a;
    border: 2px solid white;
  }
`;

const GoodButton = styled(PlusButton)``;

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
  height: 8rem;
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

const BoxInfoTitle = styled.div`
  width: 11rem;
  font-size: 17px;
  font-weight: 100;
  font-family: "Black Han Sans", sans-serif;
  color: ${(props) => props.theme.white.lighter};
  height: 100%;
  align-items: flex-end;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0.6rem;
  text-shadow: 1px 1.5px 1px rgba(0, 0, 0, 0.75);
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
    font-weight: 100;
    font-family: "Black Han Sans", sans-serif;
    color: ${(props) => props.theme.white.lighter};
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
  border-radius: 5px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  right: 330px;
  margin: 0 auto;
`;

// 영화 클릭시 팝업창에 들어갈 이미지
const BigCover = styled.div`
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 479px;
  border-radius: 5px;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const BigButtonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const BigCloseContainer = styled.div`
  height: 100%;
  width: 100%;
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 1rem;
`;
const BigCloseButton = styled(PlusButton)`
  margin-right: 1rem;
  width: 2.2rem;
  height: 2.2rem;
  border: none;
  &:hover {
    border: none;
  }
  &:active {
    border: 2px solid white;
    color: white;
  }
  svg {
    width: 15px;
  }
`;

const BigTitleBox = styled.div`
  padding: 3rem;
  width: 35rem;
`;

// 영화 클릭시 팝업창에 들어갈 영화제목
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 3.25rem;
  font-weight: 100;
  font-family: "Black Han Sans", sans-serif;
  margin-bottom: 32px;
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
  const { data, isLoading } = useQuery<IGetMoviesNowPlayingResult>(
    ["movies", "nowPlaying"],
    getMovieNowPlaying
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
  // console.log(clickedMovie);
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
            <div
              style={{
                fontSize: "1.4vw",
                fontWeight: 400,
                marginBottom: "1rem",
                color: "#E5E5E5",
              }}
            >
              지금 뜨는 콘텐츠
            </div>
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
                      <BoxInfoTitle>
                        <h4>{movie.title}</h4>
                      </BoxInfoTitle>
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
                  style={{ top: scrollY.get() + 33 }}
                  layoutId={bigMovieMatch.params.movieId} // 위 Box 컴포넌트 layoutId랑 같이 작성. match
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      >
                        <BigCloseContainer>
                          <BigCloseButton onClick={onOverlayClick}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              data-name="Close"
                              data-uia="previewModal-closebtn"
                              role="button"
                              aria-label="close"
                            >
                              <path
                                d="M2.29297 3.70706L10.5859 12L2.29297 20.2928L3.70718 21.7071L12.0001 13.4142L20.293 21.7071L21.7072 20.2928L13.4143 12L21.7072 3.70706L20.293 2.29285L12.0001 10.5857L3.70718 2.29285L2.29297 3.70706Z"
                                fill="currentColor"
                              ></path>
                            </svg>
                          </BigCloseButton>
                        </BigCloseContainer>

                        <BigTitleBox>
                          <BigTitle>{clickedMovie.title}</BigTitle>
                          <BigButtonContainer>
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
                            <PlusButton>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                data-name="Add"
                              >
                                <path
                                  d="M11 2V11H2V13H11V22H13V13H22V11H13V2H11Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </PlusButton>
                            <GoodButton>
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                data-name="RateUp"
                              >
                                <path
                                  d="M10.696 8.7732C10.8947 8.45534 11 8.08804 11 7.7132V4H11.8377C12.7152 4 13.4285 4.55292 13.6073 5.31126C13.8233 6.22758 14 7.22716 14 8C14 8.58478 13.8976 9.1919 13.7536 9.75039L13.4315 11H14.7219H17.5C18.3284 11 19 11.6716 19 12.5C19 12.5929 18.9917 12.6831 18.976 12.7699L18.8955 13.2149L19.1764 13.5692C19.3794 13.8252 19.5 14.1471 19.5 14.5C19.5 14.8529 19.3794 15.1748 19.1764 15.4308L18.8955 15.7851L18.976 16.2301C18.9917 16.317 19 16.4071 19 16.5C19 16.9901 18.766 17.4253 18.3994 17.7006L18 18.0006L18 18.5001C17.9999 19.3285 17.3284 20 16.5 20H14H13H12.6228C11.6554 20 10.6944 19.844 9.77673 19.5382L8.28366 19.0405C7.22457 18.6874 6.11617 18.5051 5 18.5001V13.7543L7.03558 13.1727C7.74927 12.9688 8.36203 12.5076 8.75542 11.8781L10.696 8.7732ZM10.5 2C9.67157 2 9 2.67157 9 3.5V7.7132L7.05942 10.8181C6.92829 11.0279 6.72404 11.1817 6.48614 11.2497L4.45056 11.8313C3.59195 12.0766 3 12.8613 3 13.7543V18.5468C3 19.6255 3.87447 20.5 4.95319 20.5C5.87021 20.5 6.78124 20.6478 7.65121 20.9378L9.14427 21.4355C10.2659 21.8094 11.4405 22 12.6228 22H13H14H16.5C18.2692 22 19.7319 20.6873 19.967 18.9827C20.6039 18.3496 21 17.4709 21 16.5C21 16.4369 20.9983 16.3742 20.995 16.3118C21.3153 15.783 21.5 15.1622 21.5 14.5C21.5 13.8378 21.3153 13.217 20.995 12.6883C20.9983 12.6258 21 12.5631 21 12.5C21 10.567 19.433 9 17.5 9H15.9338C15.9752 8.6755 16 8.33974 16 8C16 6.98865 15.7788 5.80611 15.5539 4.85235C15.1401 3.09702 13.5428 2 11.8377 2H10.5Z"
                                  fill="currentColor"
                                ></path>
                              </svg>
                            </GoodButton>
                          </BigButtonContainer>
                        </BigTitleBox>
                      </BigCover>

                      <div>개봉일 : {clickedMovie.release_date}</div>
                      <div>평점 : {clickedMovie.popularity}</div>
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
