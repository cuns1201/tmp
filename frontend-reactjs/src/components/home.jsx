import Search from "./search.jsx";

const HomePage = () => {
  return (
    <>
      <div
        className="bg-image position-relative"
        style={{
          marginTop: "0px",
          backgroundImage: `url(https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <main className="w-100  text-center">
          <h1
            className="display-1 py-3 text-primary"
            style={{
              marginTop: "0px",
              fontSize: 72,
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.3,
            }}
          >
            Reach For The Travel Easier <br></br>And More Enjoyable
          </h1>
        </main>
        <Search corlorBorder="#17A2B8" width="1056px" />
      </div>
    </>
  );
};

export default HomePage;
