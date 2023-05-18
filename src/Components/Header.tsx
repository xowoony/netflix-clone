// import { motion } from "framer-motion";
// import { styled } from "styled-components";

// // 헤더 (로고와 카테고리, 검색창)
// const Nav = styled.nav`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   position: fixed;
//   width: 100%;
//   top: 0;
//   background-color: black;
//   font-size: 14px;
//   padding: 20px 60px;
//   color: white;
// `;

// // 헤더 컨테이너
// const Col = styled.div`
//   align-items: center;
//   display: flex;
// `;

// // 넷플릭스 로고
// const Logo = styled(motion.svg)`
//   margin-right: 45px;
//   width: 95px;
//   height: 25px;
//   fill: ${(props) => props.theme.red};
//   path {
//     stroke-width: 6px;
//     stroke: #e51013;
//   }
// `;

// const Items = styled.ul`
//   display: flex;
//   align-items: center;
// `;

// const Item = styled.li`
// font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu,
//   sans-serif;
//   margin-right: 20px;
//   color: ${(props) => props.theme.white.lighter};
//   transition: color 0.4s ease-in-out;
//   font-weight: 500;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   cursor: pointer;
//   &:hover {
//     color: ${(props) => props.theme.white.darker};
//   }
// `;

// const Search = styled.span`
//   color: white;
//   svg {
//     height: 25px;
//   }
// `;

// function Header() {
//   return (
//     <Nav>
//       <Col>
//         <Logo>
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="95"
//             height="25"
//             viewBox="0 0 1024 276.742"
//           >
//             <path
//               d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
//               fill="#d81f26"
//             />
//           </svg>
//         </Logo>
//         <Items>
//           <Item>홈</Item>
//           <Item>시리즈</Item>
//           <Item>영화</Item>
//           <Item>NEW! 요즘 대세 콘텐츠</Item>
//           <Item>내가 찜한 콘텐츠</Item>
//           <Item>언어별로 찾아보기</Item>
//         </Items>
//       </Col>
//       <Col>
//         <Search>
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fill-rule="evenodd"
//               clip-rule="evenodd"
//               d="M14 11C14 14.3137 11.3137 17 8 17C4.68629 17 2 14.3137 2 11C2 7.68629 4.68629 5 8 5C11.3137 5 14 7.68629 14 11ZM14.3623 15.8506C12.9006 17.7649 10.5945 19 8 19C3.58172 19 0 15.4183 0 11C0 6.58172 3.58172 3 8 3C12.4183 3 16 6.58172 16 11C16 12.1076 15.7749 13.1626 15.368 14.1218L24.0022 19.1352L22.9979 20.8648L14.3623 15.8506Z"
//               fill="currentColor"
//             ></path>
//           </svg>
//         </Search>
//       </Col>
//     </Nav>
//   );
// }

// export default Header;

import { Link, useMatch } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

// 헤더 (로고와 카테고리, 검색창)
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: black;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
`;

// 헤더 컨테이너
const Col = styled.div`
  display: flex;
  align-items: center;
`;

// 넷플릭스 로고
const Logo = styled(motion.svg)`
  margin-right: 45px;
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

const Item = styled.li`
  font-family: Netflix Sans, Helvetica Neue, Segoe UI, Roboto, Ubuntu,
    sans-serif;
  margin-right: 20px;
  color: ${(props) => props.theme.white.lighter};
  font-weight: 500;
  cursor: pointer;
  transition: color 0.4s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  &:hover {
    color: ${(props) => props.theme.white.darker};
  }
`;

const Search = styled.span`
  color: white;
  svg {
    height: 25px;
  }
`;

const Circle = styled.span`
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

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

function Header() {
  const homeMatch = useMatch("/");
  const genreMatch = useMatch("genre");
  const movieMatch = useMatch("movie");
  const latestMatch = useMatch("latest");
  const mylistMatch = useMatch("my-list");
  const audioMatch = useMatch("original-audio");
  return (
    <Nav>
      <Col>
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
        <Items>
          <Item>
            <Link to="/">홈{homeMatch && <Circle />}</Link>
          </Item>
          <Item>
            <Link to="/genre">시리즈{genreMatch && <Circle />}</Link>
          </Item>
          <Item>
            <Link to="/movie">영화{movieMatch && <Circle />}</Link>
          </Item>
          <Item>
            <Link to="/latest">
              NEW! 요즘 대세 콘텐츠{latestMatch && <Circle />}
            </Link>
          </Item>
          <Item>
            <Link to="/my-list">
              내가 찜한 콘텐츠{mylistMatch && <Circle />}
            </Link>
          </Item>
          <Item>
            <Link to="/original-audio">
              언어별로 찾아보기{audioMatch && <Circle />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search>
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
