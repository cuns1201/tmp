import Select from "react-select";
import { useEffect, useState } from "react";

import BusTicket from "./busTicket.jsx";
import Search from "./search.jsx";
// import BusDetail from "./busDetail.jsx";
// import Card from "react-bootstrap/Card";
import '../index.css';

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

function numberWithThoundsand(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const BusList = () => {
  const [options, setOptions] = useState([]);
  var page = 0;
  // var commentLimit = 2;
  // var maxCommentNum = null;
  // var commentPage = 0;
  // var userRating = 1;

  const [pricing, setPricing] = useState(0);
  const [busOperator, setBusOperator] = useState();
  const [busTickets, setBusTickets] = useState([]);

  useEffect(() => {
    const fetchData = async (reset = false) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bus-operator/list/0/1000`);
        const data = await response.json();
        let optionTmp = [];
        for (const item of data.data) {
          optionTmp.push({ value: item.id, label: item.name });
        }
        setOptions(optionTmp);
      } catch (error) {
        console.error("Error fetching bus operators:", error);
      }

      console.log("LOADMORE~~~");
      // const checkAuthen = await isAuthenticated();

      const busTypeText = ["Limousine", "Normal Seat", "Sleeper Bus"];
      const typeOfSeat = document.querySelector(
        'input[name="typeOfSeat"]:checked'
      ).value;
      const price = document.querySelector("#filter-pricing").value;
      const deparature = getUrlParameter("startPoint");
      const destination = getUrlParameter("endPoint");
      const date = getUrlParameter("startTime");

      if (page === 0) {
        document.getElementById("load-more").style.display = "block";
      } else {
        document.getElementById("load-more").style.display = "none";
      }

      fetch(`${import.meta.env.VITE_BACKEND_URL}/bus/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startPoint: deparature,
          endPoint: destination,
          page,
          limit: 10,
          boId: busOperator === "" ? undefined : busOperator,
          type: parseInt(typeOfSeat),
          price: parseInt(price),
          startTime: date,
        }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.data.length === 0 && reset === false) {
          document.getElementById("load-more").style.display = "none";
          return;
        }

        let tmpTicket = [];
        for (const item of data.data) {
          let duration =
            (new Date(item.end_time) - new Date(item.start_time)) / 1000;
          let bus_operator_rating =
            Math.round(item.averageReviews * 100) / 100;
          let start_point_time =
            new Date(item.start_time).getHours() +
            ":" +
            new Date(item.start_time).getSeconds();
          let start_point_date = new Date(item.start_time)
            .toISOString()
            .split("T")[0];
          let end_point_time =
            new Date(item.end_time).getHours() +
            ":" +
            new Date(item.end_time).getSeconds();
          let end_point_date = new Date(item.end_time)
            .toISOString()
            .split("T")[0];

          tmpTicket.push({
            id: item.id,
            image_url: item.image_url,
            bus_operators_name: item.bus_operators.name,
            bus_operator_rating: bus_operator_rating,
            start_point_time: start_point_time,
            start_point_date: start_point_date,
            start_point_name: item.start_point.name,
            end_point_time: end_point_time,
            end_point_date: end_point_date,
            end_point_name: item.end_point.name,
            left_seats: item.left_seats,
            price: numberWithThoundsand(item.price),
            duration: secondsToHms(duration),
            type: busTypeText[item.type],
          });

          // html += `
          //   <div className='mb-4 card bus-ticket'>
          //     <div className='card-body'>
          //     <div className='row'>
          //       <div className='col-md-3'>
          //       <img
          //         src='${item.image_url}'
          //         className='img-fluid rounded'
          //         alt='...'
          //       />
          //       </div>
          //       <div className='col-md-9'>
          //       <div className='row'>
          //         <div className='col-md-9'>
          //         <h5 className='card-title fw-bold text-black-40'>
          //           ${item.bus_operators.name}
          //           <span className='ml-2 badge text-bg-warning'>
          //           ${Math.round(item.averageReviews * 100) / 100}*
          //           </span>
          //         </h5>
          //         <div className='row'>
          //           <div className='col-md-6'>
          //           <h5 className='text-success'>
          //             ${new Date(item.start_time).getHours()}:
          //             ${new Date(item.start_time).getSeconds()}
          //           </h5>
          //           <p className='text-black-50 mb-0'>
          //             ${new Date(item.start_time).toISOString().split("T")[0]}
          //           </p>
          //           <p className='text-black-50 fw-bold'>
          //             ${item.start_point.name}
          //           </p>
          //           </div>
          //           <div className='col-md-6'>
          //           <h5 className='text-success'>
          //             ${new Date(item.end_time).getHours()}:
          //             ${new Date(item.end_time).getSeconds()}
          //           </h5>
          //           <p className='text-black-50 mb-0'>
          //             ${new Date(item.end_time).toISOString().split("T")[0]}
          //           </p>
          //           <p className='text-black-50 fw-bold'>
          //             ${item.end_point.name}
          //           </p>
          //           </div>
          //         </div>
          //         </div>
          //       <div className='col-md-3 text-end'>
          //       <h5 className='fw-bold text-primary'>
          //         ${numberWithThoundsand(item.price)} đ
          //       </h5>
          //       <p className='mb-0'>
          //         <small className='text-muted'>
          //         ${item.left_seats} seats available
          //         </small>
          //       </p>
          //       </div>
          //       </div>
          //       <div className='mt-3 d-flex align-items-center justify-content-between'>
          //       <div>
          //         <button
          //         type='button'
          //         className='btn btn-success'
          //         data-bs-toggle='modal'
          //         data-bs-target='#exampleModal'
          //         >
          //         Details
          //         </button>
          //       </div>
          //       <div>
          //       <span className='text-primary fw-bold'>
          //       ${secondsToHms(duration)}
          //       </span>
          //       <span className='text-black-50'> | </span>
          //       <span className='text-primary fw-bold'>
          //       ${busTypeText[item.type]}
          //       </span>
          //         </div>
          //         <div>
          //       <button
          //         type='button'
          //         className='btn btn-primary book-bus book-btn'
          //         bid=${item.id}
          //       >
          //       Book
          //       </button>
          //     </div>
          //       </div>
          //       </div>
          //     </div>
          //     </div>
          //   </div>
          //   `;
        }
        // console.log("ticket: ", tmpTicket);
        setBusTickets(tmpTicket);

      })
      .catch(error => {
        console.error("Error fetching bus data:", error);
      });
    };

    fetchData();
    // loadMore();
  }, []);

  const handlePricingChange = event => {
    setPricing(parseInt(event.target.value, 10)); // Parse to integer
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  function getUrlParameter(name) {
    let results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  }

  return (
    <>
      <div>
        <Search />
      </div>
      <div className="flex mt-5 row">
        <div className="col-3">
          <div className="card">
            <div className="card-header">Filter</div>
            <div className="card-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label fw-bold"
                >
                  Bus Operator
                </label>
                <Select
                  id="filter-bus-operator"
                  options={options}
                  onChange={selectedOption => setBusOperator(selectedOption.value)} // Add onChange handler
                />
              </div>
              <div className="mb-3">
                <div className="mb-3">
                  <label htmlFor="typeOfSeat" className="form-label fw-bold">
                    Types of seat
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="0"
                      name="typeOfSeat"
                      id="limousineSeat" // Added id for label association
                    />
                    <label className="form-check-label" htmlFor="limousineSeat">
                      Limousine
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="1"
                      name="typeOfSeat"
                      defaultChecked // Use defaultChecked in React
                      id="normalSeat" // Added id for label association
                    />
                    <label className="form-check-label" htmlFor="normalSeat">
                      Normal Seat
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      value="2"
                      name="typeOfSeat"
                      id="sleeperBusSeat" // Added id for label association
                    />
                    <label
                      className="form-check-label"
                      htmlFor="sleeperBusSeat"
                    >
                      Sleeper Bus
                    </label>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="filter-pricing"
                    className="form-label fw-bold"
                  >
                    Pricing (
                    <span id="current-pricing">{formatCurrency(pricing)}</span>)
                  </label>

                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={pricing}
                    step="10000"
                    className="form-range"
                    id="filter-pricing"
                    onChange={handlePricingChange} // Add onChange handler
                  />

                  <div className="d-flex justify-content-between">
                    <span className="fw-bold text-black-50">
                      {formatCurrency(0)}
                    </span>
                    <span className="fw-bold text-black-50">
                      {formatCurrency(100000)}
                    </span>
                  </div>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                  <button
                    id="filter"
                    className="btn btn-primary float-center"
                    // onClick={handleSubmitFilter}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="list-of-buses">
            {busTickets.map((ticket, index) => {
              return (
                <BusTicket 
                  key={index}
                  ticket={ticket}
                />
              );
            })}
          </div>

          <div className="d-grid gap-2 col-6 mx-auto">
            <a className='btn btn-outline-primary float-center' id="load-more">Load more</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusList;
