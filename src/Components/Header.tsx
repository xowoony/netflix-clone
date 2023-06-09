import { Link, NavigateFunction, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
// useScroll : motion value를 준다. 맨 밑에서부터 얼마나 멀리 있는지를 알려줌
import { useState } from "react";
import { useForm } from "react-hook-form";

// 헤더 (로고와 카테고리, 검색창)
const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
  background-image: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.7) 10%,
    transparent
  );
`;

// 헤더 컨테이너
const Col = styled.div`
  display: flex;
  align-items: center;
  z-index: 10;
`;

// 넷플릭스 로고
const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: #e51013;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

// 헤더 카테고리
const Item = styled.li`
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu,
    sans-serif;
  margin-right: 20px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 500;
  cursor: pointer;
  transition: color 0.4s ease-in-out;
  position: relative; // Item이 상대적인 위치를 가지도록
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.darker};
  }
`;

const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

// 검색창
const Input = styled(motion.input)`
  // transform-origin : 변화가 시작하는 위치를 의미함.
  transform-origin: right center;
  position: absolute;
  right: 0px;
  padding: 9px 17px;
  padding-left: 57px;
  z-index: -1;
  color: white;
  font-size: 14px;
  background-color: #00000085;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

// logo Variants
const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0], // 배열로 적어줌으로써 단계를 모두 적을 수 있다.
    transition: {
      repeat: Infinity, // 무한 반복됨
      duration: 2, // 2초동안 이루어짐
    },
  },
};

// search bar Interface
interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useMatch("/");
  const genreMatch = useMatch("genre");
  const movieMatch = useMatch("movie");
  const latestMatch = useMatch("latest");
  const mylistMatch = useMatch("my-list");
  const audioMatch = useMatch("original-audio");
  const inputAnimation = useAnimation();
  // 애니메이션을 실행시키는 또 하나의 방법
  // 애니메이션 상태변화에 의해서 실행되기 전에 애니메이션을 다른곳에서부터 실행시킴.
  // (코드로부터 애니메이션을 실행시킴)
  const toggleSearch = () => {
    if (searchOpen) {
      // trigger the close animation
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      // trigger the open animation
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  // 헤더 스크롤다운시 색 변경
  const { scrollY } = useScroll();
  const HeaderColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]
  );

  // 검색할 경우 redirect를 위해 useNavigate 사용
  const navigate:NavigateFunction = useNavigate();

  const { register, handleSubmit } = useForm<IForm>();
  const onValid = (data: IForm) => {
    console.log(data);
    navigate(`/search?keyword=${data.keyword}`);
  };

  return (
    // 헤더 전체
    <Nav style={{ backgroundColor: HeaderColor }}>
      <Col>
        <Link
          to="/"
          style={{ width: "95px", height: "25px", marginRight: "45px" }}
        >
          <Logo
            variants={logoVariants}
            whileHover="active"
            initial="normal"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
        </Link>
        <Items>
          <Item>
            <Link to="/">홈{homeMatch && <Circle layoutId="circle" />}</Link>
          </Item>
          <Item>
            <Link to="/genre">
              시리즈{genreMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/movie">
              영화{movieMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/latest">
              NEW! 요즘 대세 콘텐츠{latestMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/my-list">
              내가 찜한 콘텐츠{mylistMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/original-audio">
              언어별로 찾아보기{audioMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        {/* 기존의 span 에서 form으로 바꿔줌 */}
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -210 : 0 }}
            transition={{ type: "linear", duration: 0.5 }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            // 위에서 선언해준 register를 집어넣음. name은 keyword, 필수, 최소글자 1
            // 그리고 그냥 <Input /> 을 <Form />으로 감싸도록 한다.
            {...register("keyword", { required: true, minLength: 1 })}
            initial={{ scaleX: 0 }}
            animate={inputAnimation}
            transition={{ duration: 0.5 }}
            placeholder="제목, 사람, 장르"
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
