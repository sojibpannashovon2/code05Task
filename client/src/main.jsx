import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import MainLayout from "./Layout/MainLayout";
import Home from "./Pages/Home/Home";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route index element={<Home />} /> */}
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
