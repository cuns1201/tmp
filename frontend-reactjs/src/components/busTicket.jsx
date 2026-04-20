import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
const BusTicket = ({ ticket }) => {
  const [checkAuthen, setCheckAuthen] = useState(false);

  const handleDetailBus = (id, rating) => {
    window.location.href = `/bus-detail?bus-operator=${id}?averRating=${rating}`;
  };

  useEffect(() => {
    const isAuthenticated = async () => {
      let userInfo = window.localStorage.getItem("userInfo");

      if (typeof userInfo !== "undefined" && userInfo !== null) {
        userInfo = userInfo ? JSON.parse(userInfo) : {};
        if (!userInfo?.token?.token) {
          return false;
        } else {
          let response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/user/history/0/0`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token.token}`,
              },
            }
          );
          response = await response.json();
          if (!response) return false;
          if (
            typeof response.historyList === "undefined" ||
            response.historyList === null
          ) {
            return false;
          }
          return true;
        }
      } else return false;
    };

    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setCheckAuthen(auth);
    };

    checkAuth();
  }, []);

  const handleBookBus = (id) => {
    window.location.href = "/fill-form?bus-operator=" + id;
  };

  return (
    <>
      <div className="ticket-body">
        <div className="colLeft">
          <img src={ticket.image_url} className="img-fluid rounded" alt="..." />
        </div>
        <div className="colRight">
          <div className="row1">
            <div className="row1Left">
              <span className="nameBus">{ticket.bus_operators_name}</span>
              <span className="operatingBus">
                {ticket.bus_operator_rating} <FontAwesomeIcon icon={faStar} />
              </span>
            </div>
            <div className="row1Right">
              <span
                className="priceTicket"
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  lineHeight: "1",
                  color: "#FF00E7",
                }}
              >
                {ticket.price} đ
              </span>
              <span
                className="coutSeat"
                style={{
                  fontSize: "14px",
                  fontWeight: "300",
                  color: "#E57676",
                }}
              >
                {ticket.left_seats} seats available
              </span>
            </div>
          </div>
          <div className="row2">
            <div className="row2Col1">
              <span className="timeStart time">{ticket.start_point_time}</span>
              <span className="dayStart date">{ticket.start_point_date}</span>
              <span className="locationStart locat">
                {ticket.start_point_name}
              </span>
            </div>
            <div className="row2Col2">
              <span className="timeEnd time">{ticket.end_point_time}</span>
              <span className="dayEnd date">{ticket.end_point_date}</span>
              <span className="locationEnd locat">{ticket.end_point_name}</span>
            </div>
          </div>
          <div className="row3">
            <button
              type="button"
              className="btnLogin btn-success"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() =>
                handleDetailBus(ticket.id, ticket.bus_operator_rating)
              }
            >
              Details
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span
                className="text-primary fw-bold"
                style={{
                  fontSize: "18px",
                  color: "#7749F8",
                  fontWeight: "bold",
                }}
              >
                {ticket.duration}
              </span>
              <span
                className="divider"
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "20px",
                  margin: "0 10px", // Khoảng cách giữa các đoạn văn bản
                  borderLeft: "2px solid #00F2D5", // Đường viền dọc
                }}
              ></span>
              <span
                className="text-primary fw-bold"
                style={{
                  fontSize: "18px",
                  color: "#7749F8",
                  fontWeight: "bold",
                }}
              >
                {ticket.type}
              </span>
            </div>
            <button
              type="button"
              className="btnLogin book-bus book-btn"
              onClick={() => handleBookBus(ticket.id)}
              disabled={checkAuthen ? "" : "disabled"}
              style={{ backgroundColor: "rgb(0, 123, 255)" }}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

BusTicket.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image_url: PropTypes.string.isRequired,
    bus_operators_name: PropTypes.string.isRequired,
    bus_operator_rating: PropTypes.number.isRequired,
    start_point_time: PropTypes.string.isRequired,
    start_point_date: PropTypes.string.isRequired,
    start_point_name: PropTypes.string.isRequired,
    end_point_time: PropTypes.string.isRequired,
    end_point_date: PropTypes.string.isRequired,
    end_point_name: PropTypes.string.isRequired,
    left_seats: PropTypes.number.isRequired,
    price: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
};

export default BusTicket;
