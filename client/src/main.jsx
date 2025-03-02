import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import MainLayout from "./Layout/MainLayout";
import Home from "./Pages/Home/Home";
import Dashboard from "./Components/Dashboard";
import AuthProvider from "./Provider/AuthProvider";
import Login from "./Components/Logs/Login";
import SignUp from "./Components/Logs/Signup";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          {/* <Route index element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<Dashboard />}>
          <Route path="/dashboard" element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
