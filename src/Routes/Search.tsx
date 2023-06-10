import { useLocation } from "react-router";

function Search() {
  // useLocation을 이용하면 지금 있는 곳에 대한 정보를 얻을 수 있다.
  const location = useLocation();
  // location.search 파싱
  // Search: "?keyword=키워드"   ==> 파싱하기가 어려운 형태
  // 따라서 직접 파싱하는 대신 URLSearchParameter를 사용 (javascript)
  const keyword = new URLSearchParams(location.search).get("keyword");
  console.log(keyword);
  return null;
}
export default Search;
