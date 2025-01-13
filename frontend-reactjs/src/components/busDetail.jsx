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

function getUrlParameter(name) {
  let results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || 0;
}

const BusDetail = () => {
  var maxCommentNum = null;
  var commentPage = 0;
  var commentLimit = 2;
  var userRating = 1;
  const id = getUrlParameter("bus-operator");
  const averRating = getUrlParameter("averRating");

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
      console.log("dataReview: ", data);
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
  const template = (data, userComment) => `
    <div className='tab-pane fade show active' id='pills-bus-operator' role='tabpanel'
    aria-labelledby='pills-bus-operator-tab' tabindex='0'>
    <div className='p-4 col'>
      <div className='h3 text-center mw-50'>Nhà xe ${data.bus_operators.name}</div>
      <div className='d-flex justify-content-center'>
      <img className='img-fluid' src='${
        data.bus_operators.image_url
      }' alt='Nhà xe' />
      </div>
      <div>
      <span className='fst-italic fw-lighter'> Phone number: </span>
      <span className='fw-bolder'> ${data.bus_operators.phone} </span>
      <span className='float-end'>
        <span className='badge rounded-pill bg-warning text-dark'>
        <i className='bi bi-star-fill'></i>
        ${averRating}
        </span>
      </span>
      </div>
      <div id="user_comment">${userComment}</div>
      <nav className='mt-5' aria-label='Page navigation example'>
      <ul className='pagination justify-content-center'>
        <li className='page-item'>
        <a className='page-link' href='#' id='Previous'>Previous</a>
        </li>
        <li className='page-item'>
        <a className='page-link' href='#' id='Next'>Next</a>
        </li>
      </ul>
      </nav>
      <hr />
      <form className='row g-3' id="user_review">
      <div className='form-floating'>
        <textarea className='form-control' placeholder='Leave a comment here' id='floatingTextarea2'
        style='height: 150px; resize: none' required></textarea>
        <label className='text-muted' for='floatingTextarea2'>Your Comments.</label>
      </div>
      <div>
        <span className='float-start' id="rating">
        <i className='btn text-warning bi bi-star-fill' id='1' onClick={() => displayAndStoreUserRating(1)}></i>
        <i className='btn text-warning bi bi-star' id='2' onClick={() => displayAndStoreUserRating(2)}></i>
        <i className='btn text-warning bi bi-star' id='3' onClick={() => displayAndStoreUserRating(3)}></i>
        <i className='btn text-warning bi bi-star' id='4' onClick={() => displayAndStoreUserRating(4)}></i>
        <i className='btn text-warning bi bi-star' id='5' onClick={() => displayAndStoreUserRating(5)}></i>
        </span>
        <span className='float-end'>
        <button type='submit' className='btn btn-primary mb-3'>Submit</button>
        </span>
      </div>
      </form>
    </div>
    </div>
    <div className='tab-pane fade' id='pills-bus-information' role='tabpanel'
    aria-labelledby='pills-bus-information-tab' tabindex='0'>
    <div className='p-4 col'>
      <table className='table table-borderless'>
      <tr>
        <td className='fst-italic' style='width: 60%'>Bus operator</td>
        <td className='text-primary'>${data.bus_operators.name}</td>
      </tr>
      <tr>
        <td className='fst-italic'>Start point</td>
        <td className='text-primary'>${
          data.bus_stations_buses_start_pointTobus_stations.name
        }</td>
      </tr>
      <tr>
        <td className='fst-italic'>End point</td>
        <td className='text-primary'>${
          data.bus_stations_buses_end_pointTobus_stations.name
        }</td>
      </tr>
      <tr>
        <td className='fst-italic'>Start time</td>
        <td className='text-primary'>${data.start_time}</td>
      </tr>
      <tr>
        <td className='fst-italic'>End time</td>
        <td className='text-primary'>${data.end_time}</td>
      </tr>
      <tr>
        <td className='fst-italic'>Duration</td>
        <td className='text-primary'>${secondsToHms(
          (new Date(data.end_time) - new Date(data.start_time)) / 1000
        )}</td>
      </tr>
      <tr>
        <td className='fst-italic'>Policy</td>
        <td className='text-primary' id="policy">${data.policy}</td>
      </tr>
      <tr>
        <td className='fst-italic'>Number of seats</td>
        <td className='text-primary'>${data.num_of_seats}</td>
      </tr>
      <tr>
        <td className='fst-italic'>Type of bus</td>
        <td className='text-primary'>${typeName[data.type]}</td>
      </tr>
      <tr>
        <td className='fst-italic'>Cost</td>
        <td className='text-primary'>${data.price} vnđ</td>
      </tr>
      </table>
      <hr />
      <div className='d-flex justify-content-center'>
      <img className='img-fluid' src='${data.image_url}' alt='Xe' />
      </div>
    </div>
    </div>`;

  fetch(`${import.meta.env.VITE_BACKEND_URL}/bus/${id}`)
  .then(response => response.json())
  .then(data => {
    const userComment = generateComment(data.bus_operators.id);
    const html = template(data, userComment);
    document.getElementById("pills-tabContent").innerHTML = html;

    document.getElementById("Previous").addEventListener("click", () => {
      if (commentPage > 0) {
        commentPage--;
        document.getElementById("user_comment").innerHTML = generateComment(
          data.bus_operators.id
        );
      }
    });

    document.getElementById("Next").addEventListener("click", () => {
      if (commentPage < Math.floor(maxCommentNum / commentLimit) - 1) {
        commentPage++;
        document.getElementById("user_comment").innerHTML = generateComment(
          data.bus_operators.id
        );
      }
    });

    document.getElementById("user_review").addEventListener("submit", e => {
      e.preventDefault();
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/bus-operator/review/create/${
          data.bus_operators.id
        }`,
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
    });
  })
  .catch(error => {
    console.error("Error:", error);
  });

  return (
    <div className="card">
      <div className="card-header">
        <h1 className="card-title fs-6">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-bus-operator-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-bus-operator"
                type="button"
                role="tab"
                aria-controls="pills-bus-operator"
                aria-selected="true"
              >
                Bus operator
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-bus-information-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-bus-information"
                type="button"
                role="tab"
                aria-controls="pills-bus-information"
                aria-selected="false"
              >
                Bus information
              </button>
            </li>
          </ul>
        </h1>
        <button type="button" className="btn-close" aria-label="Close"></button>
      </div>
      <div className="card-body">
        <div className="tab-content" id="pills-tabContent">
        </div>
      </div>
    </div>
  );
};

export default BusDetail;
