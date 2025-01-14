import { NavLink } from "react-router-dom";

const btnProfile = () => {
  return (
    <>
      <NavLink
        to="/profile"
        className="block ml-7 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
        aria-current="page"
      >
        Profile
      </NavLink>
    </>
  );
};

export default btnProfile;
