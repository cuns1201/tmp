import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

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
          let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/history/0/0`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${userInfo.token.token}`,
            },
          });
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
  }

  return (
    <>
      <div className="mb-4 card bus-ticket">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <img
                src={ticket.image_url}
                className="img-fluid rounded"
                alt="..."
              />
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-md-9">
                  <h5 className="card-title fw-bold text-black-40">
                    {ticket.bus_operators_name}
                    <span className="ml-2 badge text-bg-warning">
                      {ticket.bus_operator_rating}*
                    </span>
                  </h5>
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="text-success">
                        {ticket.start_point_time}
                      </h5>
                      <p className="text-black-50 mb-0">
                        {ticket.start_point_date}
                      </p>
                      <p className="text-black-50 fw-bold">
                        {ticket.start_point_name}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="text-success">{ticket.end_point_time}</h5>
                      <p className="text-black-50 mb-0">
                        {ticket.end_point_date}
                      </p>
                      <p className="text-black-50 fw-bold">
                        {ticket.end_point_name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 text-end">
                  <h5 className="fw-bold text-primary">{ticket.price} đ</h5>
                  <p className="mb-0">
                    <small className="text-muted">
                      {ticket.left_seats} seats available
                    </small>
                  </p>
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center justify-content-between">
                <div>
                  <button
                    type="button"
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={() => handleDetailBus(ticket.id, ticket.bus_operator_rating)}
                  >
                    Details
                  </button>
                </div>
                <div>
                  <span className="text-primary fw-bold">
                    {ticket.duration}
                  </span>
                  <span className="text-black-50"> | </span>
                  <span className="text-primary fw-bold">{ticket.type}</span>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary book-bus book-btn"
                    onClick={() => handleBookBus(ticket.id)}
                    disabled={checkAuthen ? "" : "disabled"}
                    style={{ backgroundColor: 'rgb(0, 123, 255)' }}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
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