import { useEffect, useState } from "react";
import { BiStar } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";

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
  const [isOperator, setIsOperator] = useState(true);
  var [dataOperator, setDataOperator] = useState({});
  var maxCommentNum = null;
  var commentPage = 0;
  var commentLimit = 2;
  var [userRating, setUserRating] = useState(1);
  const typeName = ["Limousine", "Normal Seat", "Sleeper Bus"];

  const id = getUrlParameter("bus-operator");
  const averRating = getUrlParameter("averRating");

  function generateStart(num) {
    let star = "";
    for (let i = 0; i < num; ++i)
      star += `<i className='text-warning'>
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg>
    </i>`;
    for (let i = num; i < 5; ++i)
      star += `<i className='text-warning'>
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m6.516 14.323-1.49 6.452a.998.998 0 0 0 1.529 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822 0L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107zm2.853-4.326a.998.998 0 0 0 .832-.586L12 5.43l1.799 3.981a.998.998 0 0 0 .832.586l3.972.315-3.271 2.944c-.284.256-.397.65-.293 1.018l1.253 4.385-3.736-2.491a.995.995 0 0 0-1.109 0l-3.904 2.603 1.05-4.546a1 1 0 0 0-.276-.94l-3.038-2.962 4.09-.326z"></path></svg>
    </i>`;
    return star;
  }

  async function generateComment(bo_id) {
    const commentHTMLTemplate = (email, star, comment) => `
      <hr />
      <div className='clearfix'>
        <i className='float-start fs-1 me-1'>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
          </svg>
        </i>
        <div className='float-start'>
          <div className='fw-bolder'>${email}</div>
          <div className='flex flex-row'>${star}</div>
          <p className='fw-light fst-italic'>${comment}</p>
        </div>
      </div>`;

    let commentContent = "";
    try {
      let response = await fetch(`${
        import.meta.env.VITE_BACKEND_URL
      }/bus-operator/review/${bo_id}/${commentPage}/${commentLimit}`);
      let data = await response.json();
      if (maxCommentNum == null || maxCommentNum < data.count){
        maxCommentNum = data.count;
      }
      if (data.data.length > 0) {
        data.data.forEach(item => {
          commentContent += commentHTMLTemplate(
            item.users.email,
            generateStart(item.rate),
            item.comment
          );
        });
      }
    } catch (error) {
      alert("Error", JSON.stringify(error));
    }
    
    // fetch(
    //   `${
    //     import.meta.env.VITE_BACKEND_URL
    //   }/bus-operator/review/${bo_id}/${commentPage}/${commentLimit}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       Authorization: `Bearer`,
    //       "Content-Type": "application/json",
    //       Accept: "application/json",
    //     },
    //   }
    // )
    // .then(response => response.json())
    // .then(data => {
    //   if (maxCommentNum == null || maxCommentNum < data.count){
    //     maxCommentNum = data.count;
    //   }
    //   if (data.data.length > 0) {
    //     data.data.forEach(item => {
    //       commentContent += commentHTMLTemplate(
    //         item.users.email,
    //         generateStart(item.rate),
    //         item.comment
    //       );
    //     });

    //   }
    // })
    // .catch(error => {
    //   alert("Error", JSON.stringify(error));
    // });

    console.log("commentContent: ", commentContent);
    return commentContent;
  }

  // function displayAndStoreUserRating(starID) {
  //   const stars = document.querySelectorAll("#rating .bi");
  //   stars.forEach((star, index) => {
  //     if (index < starID) {
  //       star.classList.add("bi-star-fill");
  //       star.classList.remove("bi-star");
  //     } else {
  //       star.classList.add("bi-star");
  //       star.classList.remove("bi-star-fill");
  //     }
  //   });
  // }

  // const typeName = ["Limousine", "Normal Seat", "Sleeper Bus"];
  // const template = (data, userComment) => `
  //   <div className='tab-pane fade show active' id='pills-bus-operator' role='tabpanel'
  //   aria-labelledby='pills-bus-operator-tab' tabindex='0'>
  //   <div className='p-4 col'>
  //     <div className='h3 text-center mw-50'>Nhà xe ${data.bus_operators.name}</div>
  //     <div className='d-flex justify-content-center'>
  //     <img className='img-fluid' src='${
  //       data.bus_operators.image_url
  //     }' alt='Nhà xe' />
  //     </div>
  //     <div>
  //     <span className='fst-italic fw-lighter'> Phone number: </span>
  //     <span className='fw-bolder'> ${data.bus_operators.phone} </span>
  //     <span className='float-end'>
  //       <span className='badge rounded-pill bg-warning text-dark'>
  //       <i className='bi bi-star-fill'></i>
  //       ${averRating}
  //       </span>
  //     </span>
  //     </div>
  //     <div id="user_comment">${userComment}</div>
  //     <nav className='mt-5' aria-label='Page navigation example'>
  //     <ul className='pagination justify-content-center'>
  //       <li className='page-item'>
  //       <a className='page-link' href='#' id='Previous'>Previous</a>
  //       </li>
  //       <li className='page-item'>
  //       <a className='page-link' href='#' id='Next'>Next</a>
  //       </li>
  //     </ul>
  //     </nav>
  //     <hr />
  //     <form className='row g-3' id="user_review">
  //     <div className='form-floating'>
  //       <textarea className='form-control' placeholder='Leave a comment here' id='floatingTextarea2'
  //       style='height: 150px; resize: none' required></textarea>
  //       <label className='text-muted' for='floatingTextarea2'>Your Comments.</label>
  //     </div>
  //     <div>
  //       <span className='float-start' id="rating">
  //       <i className='btn text-warning bi bi-star-fill' id='1' onClick={() => displayAndStoreUserRating(1)}></i>
  //       <i className='btn text-warning bi bi-star' id='2' onClick={() => displayAndStoreUserRating(2)}></i>
  //       <i className='btn text-warning bi bi-star' id='3' onClick={() => displayAndStoreUserRating(3)}></i>
  //       <i className='btn text-warning bi bi-star' id='4' onClick={() => displayAndStoreUserRating(4)}></i>
  //       <i className='btn text-warning bi bi-star' id='5' onClick={() => displayAndStoreUserRating(5)}></i>
  //       </span>
  //       <span className='float-end'>
  //       <button type='submit' className='btn btn-primary mb-3'>Submit</button>
  //       </span>
  //     </div>
  //     </form>
  //   </div>
  //   </div>
  //   <div className='tab-pane fade' id='pills-bus-information' role='tabpanel'
  //   aria-labelledby='pills-bus-information-tab' tabindex='0'>
  //   <div className='p-4 col'>
  //     <table className='table table-borderless'>
  //     <tr>
  //       <td className='fst-italic' style='width: 60%'>Bus operator</td>
  //       <td className='text-primary'>${data.bus_operators.name}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Start point</td>
  //       <td className='text-primary'>${
  //         data.bus_stations_buses_start_pointTobus_stations.name
  //       }</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>End point</td>
  //       <td className='text-primary'>${
  //         data.bus_stations_buses_end_pointTobus_stations.name
  //       }</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Start time</td>
  //       <td className='text-primary'>${data.start_time}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>End time</td>
  //       <td className='text-primary'>${data.end_time}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Duration</td>
  //       <td className='text-primary'>${secondsToHms(
  //         (new Date(data.end_time) - new Date(data.start_time)) / 1000
  //       )}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Policy</td>
  //       <td className='text-primary' id="policy">${data.policy}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Number of seats</td>
  //       <td className='text-primary'>${data.num_of_seats}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Type of bus</td>
  //       <td className='text-primary'>${typeName[data.type]}</td>
  //     </tr>
  //     <tr>
  //       <td className='fst-italic'>Cost</td>
  //       <td className='text-primary'>${data.price} vnđ</td>
  //     </tr>
  //     </table>
  //     <hr />
  //     <div className='d-flex justify-content-center'>
  //     <img className='img-fluid' src='${data.image_url}' alt='Xe' />
  //     </div>
  //   </div>
  //   </div>`;

  useEffect(() => {
    const getDataOperator = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bus/${id}`);
        const data = await response.json();
        setDataOperator(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getDataOperator();
  }, []);

  useEffect(() => {
    if (Object.keys(dataOperator).length > 0) {
      generateComment(dataOperator.bus_operators?.id).then(commentContent => {
        document.getElementById("user_comment").innerHTML = commentContent;
      })
      .catch(error => {
        console.error("Error generating comment:", error);
      });
    }
  }, [dataOperator]);

  const handleSwitch = (bool) => {
    bool ? setIsOperator(true) : setIsOperator(false);
  };
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
  const handlePrevious = id => {
    if (commentPage > 0) {
      commentPage--;
      generateComment(id)
        .then(commentContent => {
          document.getElementById("user_comment").innerHTML = commentContent;
        })
        .catch(error => {
          console.error("Error generating comment:", error);
        });
    }
  };
  const handleNext = id => {
    if (commentPage < Math.floor(maxCommentNum / commentLimit) - 1) {
      commentPage++;
      generateComment(id)
        .then(commentContent => {
          document.getElementById("user_comment").innerHTML = commentContent;
        })
        .catch(error => {
          console.error("Error generating comment:", error);
        });
    }
  };

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
                onClick={() => handleSwitch(true)}
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
                onClick={() => handleSwitch(false)}
              >
                Bus information
              </button>
            </li>
          </ul>
        </h1>
        <button type="button" className="btn-close" aria-label="Close"></button>
      </div>
      <div className="card-body">
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
                Nhà xe {dataOperator.bus_operators?.name}
              </div>
              <div className="d-flex justify-content-center">
                <img
                  className="img-fluid"
                  src={dataOperator.bus_operators?.image_url}
                  alt="Nhà xe"
                />
              </div>
              <div>
                <span className="fst-italic fw-lighter"> Phone number: </span>
                <span className="fw-bolder">
                  {dataOperator.bus_operators?.phone}
                </span>
                <span className="float-end">
                  <span className="badge rounded-pill bg-warning text-dark">
                    <i className="bi bi-star-fill"></i>
                    {averRating}
                  </span>
                </span>
              </div>
              <div id="user_comment"></div>
              <nav className="mt-5" aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  <li className="page-item">
                    <button
                      type="button"
                      className="page-link"
                      id="Previous"
                      onClick={() =>
                        handlePrevious(dataOperator.bus_operators?.id)
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
                      onClick={() => handleNext(dataOperator.bus_operators?.id)}
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
                    placeholder="Your Comments"
                    id="floatingTextarea2"
                    style={{ height: "150px", resize: "none" }}
                    required
                  ></textarea>
                </div>
                <div className="mb-3 flex justify-center">
                  <span className="float-start flex items-center" id="rating">
                    {[...Array(5)].map((_, index) => (
                      <a
                        key={index + 1}
                        type="button"
                        className="btn text-warning star"
                        id={index + 1}
                        onClick={() => setUserRating(index + 1)}
                      >
                        {index < userRating ? <FaStar /> : <BiStar />}
                      </a>
                    ))}
                    {/* <a
                      type="button"
                      className="btn text-warning star"
                      id="1"
                      onClick={() => displayAndStoreUserRating(1)}
                    >
                      <BiStar />
                    </a>
                    <a
                      type="button"
                      className="btn text-warning star"
                      id="2"
                      onClick={() => displayAndStoreUserRating(2)}
                    >
                      <BiStar />
                    </a>
                    <a
                      type="button"
                      className="btn text-warning star"
                      id="3"
                      onClick={() => displayAndStoreUserRating(3)}
                    >
                      <BiStar />
                    </a>
                    <a
                      type="button"
                      className="btn text-warning star"
                      id="4"
                      onClick={() => displayAndStoreUserRating(4)}
                    >
                      <BiStar />
                    </a>
                    <a
                      type="button"
                      className="btn text-warning star"
                      id="5"
                      onClick={() => displayAndStoreUserRating(5)}
                    >
                      <BiStar />
                    </a> */}
                  </span>
                  <span className="float-end flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleSubmitComment(dataOperator.bus_operators?.id)
                      }
                      className="btn btn-primary"
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
                <td className="fst-italic" style={{ width: "60%" }}>
                  Bus operator
                </td>
                <td className="text-primary">
                  {dataOperator.bus_operators?.name}
                </td>
              </tr>
              <tr>
                <td className="fst-italic">Start point</td>
                <td className="text-primary">
                  {
                    dataOperator.bus_stations_buses_start_pointTobus_stations
                      ?.name
                  }
                </td>
              </tr>
              <tr>
                <td className="fst-italic">End point</td>
                <td className="text-primary">
                  {
                    dataOperator.bus_stations_buses_end_pointTobus_stations
                      ?.name
                  }
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
              <img
                className="img-fluid"
                src={dataOperator.image_url}
                alt="Xe"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetail;
