import PropTypes from "prop-types";

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : "h") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : "m") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : "s") : "";
  return hDisplay + mDisplay + sDisplay;
}

const Detail = ({ isOperator, dataOperator, averRating, userComment }) => {
  var userRating = 1;
  var maxCommentNum = null;
  var commentPage = 0;
  var commentLimit = 2;

  const handleSubmitComment = id => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/bus-operator/review/create/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userInfo.token.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          comment: document.getElementById("floatingTextarea2").value,
          rate: userRating,
        }),
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log("dataReview: ", data);
        document.getElementById("floatingTextarea2").value = "";
        alert("Success");
      })
      .catch(error => {
        alert("Error", JSON.stringify(error));
      });
  };

  function generateStart(num) {
    let star = "";
    for (let i = 0; i < num; ++i)
      star += "<i className='text-warning bi bi-star-fill'></i>";
    for (let i = num; i < 5; ++i)
      star += "<i className='text-warning bi bi-star'></i>";
    return star;
  }

  function generateComment(bo_id) {
    const commentHTMLTemplate = (email, star, comment) => `
      <hr />
      <div className='clearfix'>
        <i className='float-start fs-1 bi bi-person-fill fa-5x me-1'></i>
        <div className='float-start'>
        <div className='fw-bolder'>${email}</div>
        <div>${star}</div>
        <p className='fw-light fst-italic'>${comment}</p>
        </div>
      </div>`;

    let commentContent = "";
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/bus-operator/review/${bo_id}/${commentPage}/${commentLimit}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userInfo.token.token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )
      .then(response => response.json())
      .then(data => {
        if (maxCommentNum == null || maxCommentNum < data.count)
          maxCommentNum = data.count;
        if (data.data.length > 0) {
          data.data.forEach(item => {
            commentContent += commentHTMLTemplate(
              item.users.email,
              generateStart(item.rate),
              item.comment
            );
          });
        }
      })
      .catch(error => {
        alert("Error", JSON.stringify(error));
      });

    return commentContent;
  }

  const handlePrevious = id => {
    if (commentPage > 0) {
      commentPage--;
      document.getElementById("user_comment").innerHTML = generateComment(id);
    }
  };

  const handleNext = id => {
    if (commentPage < Math.floor(maxCommentNum / commentLimit) - 1) {
      commentPage++;
      document.getElementById("user_comment").innerHTML = generateComment(id);
    }
  };
  
  function displayAndStoreUserRating(starID) {
    const stars = document.querySelectorAll("#rating .bi");
    stars.forEach((star, index) => {
      if (index < starID) {
        star.classList.add("bi-star-fill");
        star.classList.remove("bi-star");
      } else {
        star.classList.add("bi-star");
        star.classList.remove("bi-star-fill");
      }
    });
  }

  const typeName = ["Limousine", "Normal Seat", "Sleeper Bus"];

    return (
    <>
      <div
        className="tab-content"
        id="pills-tabContent"
        style={{ display: isOperator ? "block" : "none" }}
      >
        <div
          className="tab-pane fade show active"
          id="pills-bus-operator"
          role="tabpanel"
          aria-labelledby="pills-bus-operator-tab"
        >
          <div className="p-4 col">
            <div className="h3 text-center mw-50">
              Nhà xe {dataOperator.bus_operators.name}
            </div>
            <div className="d-flex justify-content-center">
              <img
                className="img-fluid"
                src={dataOperator.bus_operators.image_url}
                alt="Nhà xe"
              />
            </div>
            <div>
              <span className="fst-italic fw-lighter"> Phone number: </span>
              <span className="fw-bolder">
                {dataOperator.bus_operators.phone}
              </span>
              <span className="float-end">
                <span className="badge rounded-pill bg-warning text-dark">
                  <i className="bi bi-star-fill"></i>
                  {averRating}
                </span>
              </span>
            </div>
            <div id="user_comment">{userComment}</div>
            <nav className="mt-5" aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    id="Previous"
                    onClick={() =>
                      handlePrevious(dataOperator.bus_operators.id)
                    }
                  >
                    Previous
                  </button>
                </li>
                <li className="page-item">
                  <button
                    type="button"
                    className="page-link"
                    id="Next"
                    onClick={() => handleNext(dataOperator.bus_operators.id)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
            <hr />
            <form className="row g-3" id="user_review">
              <div className="form-floating">
                <textarea
                  className="form-control"
                  placeholder="Leave a comment here"
                  id="floatingTextarea2"
                  style="height: 150px; resize: none"
                  required
                ></textarea>
                <label className="text-muted">Your Comments.</label>
              </div>
              <div>
                <span className="float-start" id="rating">
                  <i
                    className="btn text-warning bi bi-star-fill"
                    id="1"
                    onClick={() => displayAndStoreUserRating(1)}
                  ></i>
                  <i
                    className="btn text-warning bi bi-star"
                    id="2"
                    onClick={() => displayAndStoreUserRating(2)}
                  ></i>
                  <i
                    className="btn text-warning bi bi-star"
                    id="3"
                    onClick={() => displayAndStoreUserRating(3)}
                  ></i>
                  <i
                    className="btn text-warning bi bi-star"
                    id="4"
                    onClick={() => displayAndStoreUserRating(4)}
                  ></i>
                  <i
                    className="btn text-warning bi bi-star"
                    id="5"
                    onClick={() => displayAndStoreUserRating(5)}
                  ></i>
                </span>
                <span className="float-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleSubmitComment(dataOperator.bus_operators.id)
                    }
                    className="btn btn-primary mb-3"
                  >
                    Submit
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="tab-pane fade"
        id="pills-bus-information"
        role="tabpanel"
        aria-labelledby="pills-bus-information-tab"
        style={{ display: isOperator ? "none" : "block" }}
      >
        <div className="p-4 col">
          <table className="table table-borderless">
            <tr>
              <td className="fst-italic" style="width: 60%">
                Bus operator
              </td>
              <td className="text-primary">
                {dataOperator.bus_operators.name}
              </td>
            </tr>
            <tr>
              <td className="fst-italic">Start point</td>
              <td className="text-primary">
                {dataOperator.bus_stations_buses_start_pointTobus_stations.name}
              </td>
            </tr>
            <tr>
              <td className="fst-italic">End point</td>
              <td className="text-primary">
                {dataOperator.bus_stations_buses_end_pointTobus_stations.name}
              </td>
            </tr>
            <tr>
              <td className="fst-italic">Start time</td>
              <td className="text-primary">{dataOperator.start_time}</td>
            </tr>
            <tr>
              <td className="fst-italic">End time</td>
              <td className="text-primary">{dataOperator.end_time}</td>
            </tr>
            <tr>
              <td className="fst-italic">Duration</td>
              <td className="text-primary">
                {secondsToHms(
                  (new Date(dataOperator.end_time) -
                    new Date(dataOperator.start_time)) /
                    1000
                )}
              </td>
            </tr>
            <tr>
              <td className="fst-italic">Policy</td>
              <td className="text-primary" id="policy">
                {dataOperator.policy}
              </td>
            </tr>
            <tr>
              <td className="fst-italic">Number of seats</td>
              <td className="text-primary">{dataOperator.num_of_seats}</td>
            </tr>
            <tr>
              <td className="fst-italic">Type of bus</td>
              <td className="text-primary">{typeName[dataOperator.type]}</td>
            </tr>
            <tr>
              <td className="fst-italic">Cost</td>
              <td className="text-primary">{dataOperator.price} vnđ</td>
            </tr>
          </table>
          <hr />
          <div className="d-flex justify-content-center">
            <img className="img-fluid" src={dataOperator.image_url} alt="Xe" />
          </div>
        </div>
      </div>
    </>
  );
};

Detail.propTypes = {
  isOperator: PropTypes.bool.isRequired,
  dataOperator: PropTypes.shape({
    bus_operators: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    num_of_seats: PropTypes.number.isRequired,
    policy: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    bus_stations_buses_start_pointTobus_stations: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired,
    bus_stations_buses_end_pointTobus_stations: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
    }).isRequired,
    image_url: PropTypes.string.isRequired,
  }).isRequired,
  averRating: PropTypes.string.isRequired,
  userComment: PropTypes.string.isRequired,
};

export default Detail;
