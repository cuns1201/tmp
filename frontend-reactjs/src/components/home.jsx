import Search from "./search.jsx";

const HomePage = () => {
  return (
    <>
      <div
        className="bg-image position-relative"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <main className="w-100 text-center">
          <h1
            className="display-1 py-3 text-primary"
            style={{
              textShadow: "rgb(91 89 119) 1px 1px",
              color: "white !important",
              fontWeight: 700,
              fontSize: "60px",
            }}
          >
            Reach For The Travel Easier And More Enjoyable
          </h1>
          
        </main>
        <Search />
      </div>
    </>
  );
};

export default HomePage;
