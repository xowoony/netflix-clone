import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Genre from "./Routes/Genre";
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/genre" element={<Genre />}></Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
