import { Outlet } from "react-router";
import Container from "../Components/Shared/Container";
import Footer from "../Components/Shared/Footer";
import Navbar from "../Components/Shared/Navbar";

const MainLayout = () => {
  return (
    <>
      <Container>
        <div>
          <Navbar />
          <Outlet />
          <Footer />
        </div>
      </Container>
    </>
  );
};

export default MainLayout;
