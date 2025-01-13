import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
} from "react-router-dom";
import { useEffect, useState } from "react";
// import LoginForm from './loginForm.jsx';
// import UnsplashPhotos from "./infiniteScroll.jsx";
import Profile from "./profile.jsx";
import OTPInput from "./otp.jsx";
import HomePage from "./home.jsx";
import LoginForm from "./loginForm.jsx";
import BusList from "./busList.jsx";
import FillForm from "./fill-form.jsx";
import BusDetail from "./busDetail.jsx";

const Navigation = () => {
  const [isLogIn, setIsLogIn] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("url");

    window.location.href = "/";
  };

  useEffect(() => {
    const checkToken = () => { 
      let token = localStorage.getItem("userInfo");
      if (token) {
        setIsLogIn(true);
      }
      else {
        setIsLogIn(false);
      }
    };

    checkToken();
  }, []);

  return (
    <>
      <BrowserRouter>
        <div className="fixed top-0 left-0 right-0 bg-white border-gray-200 dark:bg-gray-900 z-50">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Vexere
              </span>
            </a>
            <div className="flex flex-row">
              <NavLink
                to={`${isLogIn ? "/profile" : "/login"}`}
                className="block ml-7 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                aria-current="page"
              >
                {isLogIn ? "Profile" : "Log In"}
              </NavLink>
              {isLogIn ? (
                <NavLink
                  to="/"
                  onClick={handleLogOut}
                  className="block ml-7 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                  aria-current="page"
                >
                  Log out
                </NavLink>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="pt-20">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route exact path="/otp" element={<OTPInput />} />
            <Route exact path="/list" element={<BusList />} />
            <Route exact path="/fill-form" element={<FillForm />} />
            <Route exact path="/bus-detail" element={<BusDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default Navigation;