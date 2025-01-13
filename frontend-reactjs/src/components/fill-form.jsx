// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import printJS from "print-js";

const FillForm = () => {
    // const navigate = useNavigate();

    const [isPayment, setIsPayment] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

  const handleCancel = () => {
    window.location.href = window.localStorage.getItem("url");
  };

  const handleHome = () => (window.location.href = "/");

  const handlePrintPDF = () => {
    const node = document.getElementById("table").innerHTML;
    console.log("NODEEE", node);
    printJS("table", "html");
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

  const handleSubmitForm = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const email = userInfo.user.email;
    const busId = getUrlParameter("bus-operator");
    console.log("BUSOP", busId);
    console.log("EMAIL", email);
    const name = document.getElementById("inputFullName").value;
    const phone = document.getElementById("inputPhone").value;
    const numOfSeats = Number(
      document.getElementById("inputNumberOfSeat").value
    );
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/ticket/create/${busId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token.token}`,
          },
          body: JSON.stringify({
            name,
            phone,
            numOfSeats,
          }),
        }
      );
      const data = await response.json();
      if (!data) {
        alert("[ERROR]: Cannot get response from server");
      } else if (data.error) {
        alert(
          "The number of seats you booked exceed the maximum number of seats\nPlease try again!!!"
        );
      } else {
        console.log(JSON.stringify(data));
        document.querySelector("#title div h3").textContent = "Booking details";
        const msToTime = ms => {
          let seconds = (ms / 1000).toFixed(1);
          let minutes = (ms / (1000 * 60)).toFixed(1);
          let hours = (ms / (1000 * 60 * 60)).toFixed(1);
          let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
          if (seconds < 60) return seconds + " Seconds";
          else if (minutes < 60) return minutes + " Minutes";
          else if (hours < 24) return hours + " Hours";
          else return days + " Days";
        };
        const ticketIds = data.ticket_ids.map(tid => `<li>${tid}</li>`);
        const template = `<div>
            <div id="table">
                <table class='table table-hover table-striped'>
                <tbody>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Full name</th>
                    <td class='quarter-width align-middle'>${data.name}</td>
                    <th class='quarter-width align-middle ps-4'>Email</th>
                    <td class='quarter-width align-middle'>${email}</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Ticket id</th>
                    <td class='quarter-width align-middle'>
                        <ul class='disc-list-style-type px-3'>
                        ${ticketIds.join("")}
                        </ul>
                    </td>
                    <th class='quarter-width align-middle ps-4'>Bus operator</th>
                    <td class='quarter-width align-middle'>${data.bo_name}</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Start point</th>
                    <td class='quarter-width align-middle'>${
                      data.start_point
                    }</td>
                    <th class='quarter-width align-middle ps-4'>End point</th>
                    <td class='quarter-width align-middle'>${
                      data.end_point
                    }</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Start time</th>
                    <td class='quarter-width align-middle'>
                        ${new Date(data.start_time).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                    </td>
                    <th class='quarter-width align-middle ps-4'>End time</th>
                    <td class='quarter-width align-middle'>
                        ${new Date(data.end_time).toLocaleDateString(
                          undefined,
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                          }
                        )}
                    </td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Duration</th>
                    <td class='quarter-width align-middle'>${msToTime(
                      data.duration
                    )}</td>
                    <th class='quarter-width align-middle ps-4'>Policy</th>
                    <td class='quarter-width align-middle'>${data.policy}</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Number of seats</th>
                    <td class='quarter-width align-middle'>${
                      data.num_of_seats
                    }</td>
                    <th class='quarter-width align-middle ps-4'>Type of bus</th>
                    <td class='quarter-width align-middle'>${
                      data.type === 0
                        ? "Limousine"
                        : data.type === 1
                        ? "Normal Seat"
                        : "Sleeper Bus"
                    }</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Ticket cost</th>
                    <td class='quarter-width align-middle'>${
                      data.ticket_cost
                    } VND</td>
                    <th class='quarter-width align-middle ps-4'>Total cost</th>
                    <td class='quarter-width align-middle'>${
                      data.total_cost
                    } VND</td>
                    </tr>
                    <tr style='height: 80px'>
                    <th class='quarter-width align-middle ps-4'>Seat positions</th>
                    <td class='quarter-width align-middle'>${data.seat_positions.join(
                      ", "
                    )}</td>
                    <th class='quarter-width align-middle ps-4'>Status</th>
                    <td id="status-td" class='quarter-width align-middle'>${
                      data.status === 0
                        ? "Booked"
                        : data.status === 1
                        ? "Paid"
                        : "Canceled"
                    }</td>
                    </tr>
                </tbody>
                </table>
            </div>
            <div class='mt-5 d-flex justify-content-center align-items-center'>
                <button type='button' class='home-btn btn btn-primary py-3 px-4' style='margin-right: 300px;width: 110px'>
                Home
                </button>
                <button id="pay-btn" type='button' class='btn btn-primary py-3 px-4' style='width: 110px'>
                Pay
                </button>
            </div>
            </div>`;
        document.getElementById("form-container").innerHTML = template;
        document.querySelector(".home-btn").addEventListener("click", () => {
          window.location.href = "/";
        });
        document
          .getElementById("pay-btn")
          .addEventListener("click", async () => {
            document.getElementById("status-td").textContent = "Paid";
            try {
              const paymentResponse = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/ticket/payment`,
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userInfo.token.token}`,
                  },
                  body: JSON.stringify({
                    ticket_ids: data.ticket_ids,
                  }),
                }
              );
              const paymentData = await paymentResponse.json();
              console.log("[SUCCESS]", paymentData);

              localStorage.removeItem("url");

              // navigate('/payment-success');
              setIsPayment(true);
              setIsDisabled(false);
            } catch (error) {
              console.log(error);
              alert("[ERROR]", "Payment failed");
            }
          });
      }
    } catch (error) {
      console.log(error);
      alert("[ERROR]", "Something went wrong");
    }
  };

  return (
    <>
      <div
        id="title"
        className="mt-5 mb-5 card bg-light"
        style={{ height: "150px", display: isDisabled ? "block" : "none" }}
      >
        <div className="card-body d-flex justify-content-center align-items-center">
          <h3>Fill in booking form</h3>
        </div>
      </div>

      <div id="form-container" style={{ display: isDisabled ? "block" : "none" }}>
        <form id="form">
          <div className="form-group row mb-4">
            <label htmlFor="inputFullName" className="col-sm-2 col-form-label">
              Full Name
            </label>
            <div className="col-sm-10 d-flex">
              <input
                required
                type="text"
                className="form-control"
                id="inputFullName"
                name="inputFullName"
                placeholder="Full Name"
                autoFocus
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="form-group row mb-4">
            <label htmlFor="disabledEmail" className="col-sm-2 col-form-label">
              Email
            </label>
            <div className="col-sm-10">
              <input
                readOnly
                type="text"
                className="form-control bg-secondary text-light"
                id="disabledEmail"
                name="disabledEmail"
                value="example@gmail.com"
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="form-group row mb-4">
            <label htmlFor="inputPhone" className="col-sm-2 col-form-label">
              Phone
            </label>
            <div className="col-sm-10">
              <input
                required
                type="text"
                className="form-control"
                id="inputPhone"
                placeholder="Phone Number"
                name="inputPhone"
                pattern="\d+"
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="form-group row">
            <label
              htmlFor="disabledStartTime"
              className="col-sm-2 col-form-label"
            >
              Start Time
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                readOnly
                className="form-control bg-secondary text-light"
                id="disabledStartTime"
                name="disabledStartTime"
                value="February 11th, 2022 15:00"
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="form-group row">
            <label
              htmlFor="disabledEndTime"
              className="col-sm-2 col-form-label"
            >
              End Time
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                readOnly
                className="form-control bg-secondary text-light"
                id="disabledEndTime"
                name="disabledEndTime"
                value="February 11th, 2022 20:00"
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="form-group row">
            <label htmlFor="destination" className="col-sm-2 col-form-label">
              Destination
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                readOnly
                className="form-control bg-secondary text-light"
                id="destination"
                name="destination"
                value="Hà Nội"
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="form-group row mb-4">
            <label
              htmlFor="inputNumberOfSeat"
              className="col-sm-2 col-form-label"
            >
              Number Of Seats
            </label>
            <div className="col-sm-10">
              <input
                required
                type="text"
                className="form-control"
                id="inputNumberOfSeat"
                placeholder="Number of seats"
                pattern="^\d+$"
              />
            </div>
          </div>
          <hr className="my-4" />
          <div className="mt-5 d-flex justify-content-center align-items-center">
            <button
              id="cancel-btn"
              type="button"
              className="btn btn-primary py-3 px-4"
              style={{ marginRight: "300px", width: "110px" }}
              onClick={() => handleCancel()}
            >
              Cancel
            </button>
            <button
              id="submit-btn"
              type="button"
              className="btn btn-primary py-3 px-4"
              style={{ width: "110px" }}
              onClick={() => handleSubmitForm()}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          display: isPayment ? "block" : "none",
        }}
      >
        <div
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Your payment is successful
        </div>
        <div style={{ padding: "20px" }}></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          <button
            type="button"
            style={{
              marginRight: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => handleHome()}
          >
            Home
          </button>
          <button
            type="button"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => handlePrintPDF()}
          >
            Print PDF
          </button>
        </div>
      </div>
    </>
  );
};

export default FillForm;
