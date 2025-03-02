import { useContext, useState } from "react";
import { Link } from "react-router";
import { AuthContext } from "../../Provider/AuthProvider";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  return (
    <>
      <nav className="relative px-4 py-4 flex justify-between items-center bg-white">
        <Link to="/" className="font-sans font-bold text-xl">
          ShareLinkPro
        </Link>
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="navbar-burger flex items-center text-blue-600 p-3"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
        <ul className="hidden lg:flex lg:mx-auto lg:items-center lg:w-auto lg:space-x-6">
          <li>
            <Link className="text-sm text-gray-400 hover:text-gray-500" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-sm text-blue-600 font-bold" to="/about">
              Tracking Page
            </Link>
          </li>
        </ul>

        {user ? (
          <>
            <div className="flex gap-4">
              <Link to="/dashboard" className="btn btn-dash btn-success">
                Dashboard
              </Link>
              <div className="hidden lg:flex space-x-3">
                <button onClick={logOut} className="btn btn-dash">
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="hidden lg:flex space-x-3">
              <Link to="/login">
                <button className="btn btn-dash">Login</button>
              </Link>
            </div>
          </>
        )}
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-menu relative z-50">
          <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
          <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto">
            <div className="flex items-center mb-8">
              <button
                onClick={() => setIsOpen(false)}
                className="navbar-close text-gray-600"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul>
              <li className="mb-1">
                <Link
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  to="/about"
                >
                  About Us
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  to="/services"
                >
                  Services
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  to="/pricing"
                >
                  Pricing
                </Link>
              </li>
              <li className="mb-1">
                <Link
                  className="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
