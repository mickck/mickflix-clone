import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/netflix-clone/' element={<Home />}>
          <Route path='movies/:id' element={<Home />} />
        </Route>
        <Route path='/netflix-clone/tv' element={<Tv />}>
          <Route path=':id' element={<Tv />} />
        </Route>

        <Route path='/netflix-clone/search' element={<Search />}>
          <Route path=':id' element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
