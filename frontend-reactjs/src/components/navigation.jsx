import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
// import LoginForm from './loginForm.jsx';
// import UnsplashPhotos from "./infiniteScroll.jsx";
import History from "./history.jsx";
import OTPInput from "./otp.jsx";
import HomePage from "./home.jsx";
import LoginForm from "./loginForm.jsx";
import BusList from "./busList.jsx";
import FillForm from "./fill-form.jsx";
import BusDetail from "./busDetail.jsx";
import HistoryDetail from "./historyDetail.jsx";

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
      } else {
        setIsLogIn(false);
      }
    };

    checkToken();
  }, []);

  return (
    <>
      <BrowserRouter>
        <div
          className="fixed top-0 left-0 right-0 bg-white border-gray-200 dark:bg-gray-900 z-50"
          style={{
            boxShadow: "0px 8px 24px 0px rgba(140, 149, 159, 0.2)",
          }}
        >
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-6">
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Vexere
              </span>
            </a>
            <div className="flex flex-row gap-5">
              <NavLink
                to={`${isLogIn ? "/history" : "/login"}`}
                className="btnLogin"
                aria-current="page"
              >
                {isLogIn ? "History" : "Log In"}
              </NavLink>
              {isLogIn ? (
                <NavLink
                  to="/"
                  onClick={handleLogOut}
                  className="btnLogin"
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
        <div className="pt-20 ">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<LoginForm />} />
            <Route exact path="/history" element={<History />} />
            <Route exact path="/otp" element={<OTPInput />} />
            <Route exact path="/list" element={<BusList />} />
            <Route exact path="/fill-form" element={<FillForm />} />
            <Route exact path="/bus-detail" element={<BusDetail />} />
            <Route exact path="/history-detail" element={<HistoryDetail />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};

export default Navigation;
