import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Genre from "./Routes/Genre";
import Search from "./Routes/Search";
import Header from "./Components/Header";
import Movie from "./Routes/Movie";
import Latest from "./Routes/Latest";
import MyList from "./Routes/MyList";
import OriginalAudio from "./Routes/OriginalAudio";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="movies/:id" element={<Home />}></Route>
        <Route path="/genre" element={<Genre />}></Route>
        <Route path="/movie" element={<Movie />}></Route>
        <Route path="/latest" element={<Latest />}></Route>
        <Route path="/my-list" element={<MyList />}></Route>
        <Route path="/original-audio" element={<OriginalAudio />}></Route>
        <Route path="/search" element={<Search />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
