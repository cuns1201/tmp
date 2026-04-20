import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const HistoryDetail = () => {
  var typeOfBus = ["Limousine", "Normal Seat", "Sleeper Bus"];
  var statusBook = ["Just booked", "Booked", "Canceled payment"];
  var [isDiscard, setIsDiscard] = useState(false);
  var [detailTicket, setDetailTicket] = useState({});
  var tid = getUrlParameter("tid");
  var userInfo = JSON.parse(localStorage.getItem("userInfo"));
  var token = userInfo?.token?.token;
  const navigate = useNavigate();

  function getUrlParameter(name) {
    let results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
      window.location.href
    );
    if (results == null) {
      return null;
    }
    return decodeURI(results[1]) || 0;
  }

  // function canDiscard() {
  //     let currentDate = new Date();

  //     if (Date.parse(currentDate) < Date.parse(detailTicket.buses.start_time) && detailTicket.status != 2) {
  //         isDiscard = true;
  //     } else {
  //         isDiscard = false;
  //     }
  // }

  useEffect(() => {
      const fetchDetail = async () => {
          let response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ticket/get-ticket`, {
              method: "POST",
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  tid,
              }),
          });
          
          response = await response.json();
          setDetailTicket(response);
      };
  
      fetchDetail();
  }, []);

  useEffect(() => {
    if (Object.keys(detailTicket).length > 0) {
      viewDetail(detailTicket);
    }
  }, [detailTicket]);

  function viewDetail(detailTicket) {
    const currentDate = new Date();
    document.getElementById("detail").classList.remove("d-none");

    if (
      Date.parse(currentDate) < Date.parse(detailTicket.buses.start_time) &&
      detailTicket.status !== 2
    ) {
      setIsDiscard(true);
    } else {
      setIsDiscard(false);
    }
  }

  const handleDiscard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/ticket/discard-ticket`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ tid }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert('Discard success');
        setDetailTicket((prevDetailTicket) => ({
          ...prevDetailTicket,
          status: 2,
        }));
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="detail d-none" id="detail">
        <div className="h1 text-center">Detail Ticket</div>
        <table className="table table-hover table-striped" id="detail-ticket">
          <tbody>
            <tr style={{ minHeight: "50px" }}>
              <th className="quarter-width align-middle">Ticker id</th>
              <td className="quarter-width align-middle">
                {detailTicket.seat}
              </td>
              <th className="quarter-width align-middle">Bus operator</th>
              <td className="quarter-width align-middle">
                {detailTicket.buses?.bus_operators?.name}
              </td>
            </tr>
            <tr style={{ minHeight: "50px" }}>
              <th className="quarter-width align-middle">Start point</th>
              <td className="quarter-width align-middle">
                {
                  detailTicket.buses
                    ?.bus_stations_buses_start_pointTobus_stations?.name
                }
              </td>
              <th className="quarter-width align-middle">End point</th>
              <td className="quarter-width align-middle">
                {
                  detailTicket.buses?.bus_stations_buses_end_pointTobus_stations
                    ?.name
                }
              </td>
            </tr>
            <tr style={{ minHeight: "50px" }}>
              <th className="quarter-width align-middle">Start time</th>
              <td className="quarter-width align-middle">
                {detailTicket.buses?.start_time}
              </td>
              <th className="quarter-width align-middle">End time</th>
              <td className="quarter-width align-middle">
                {detailTicket.buses?.end_time}
              </td>
            </tr>
            <tr style={{ minHeight: "50px" }}>
              <th className="quarter-width align-middle">Duration</th>
              <td className="quarter-width align-middle">
                {(Date.parse(detailTicket.buses?.end_time) -
                  Date.parse(detailTicket.buses?.start_time)) /
                  (1000 * 60 * 60)}{" "}
                hours
              </td>
              <th className="quarter-width align-middle">Policy</th>
              <td className="quarter-width align-middle">
                {detailTicket.buses?.policy}
              </td>
            </tr>
            <tr style={{ minHeight: "50px" }}>
              <th className="quarter-width align-middle">Ticket cost</th>
              <td className="quarter-width align-middle">
                {detailTicket.buses?.price} vnđ
              </td>
              <th className="quarter-width align-middle">Type of bus</th>
              <td className="quarter-width align-middle">
                {typeOfBus[detailTicket.buses?.type]}
              </td>
            </tr>
            <tr style={{ minHeight: "50px" }}>
              <th className="quarter-width align-middle">Status</th>
              <td className="quarter-width align-middle" id="status_num">
                {statusBook[detailTicket.status]}
              </td>
              <th className="quarter-width align-middle">Seat positions</th>
              <td className="quarter-width align-middle">
                {detailTicket.seat}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="mt-5 row justify-content-center align-items-center">
          <button
            type="button"
            className="col-md-3 col-6 btn btn-primary py-3 px-4 my-4"
            onClick={() => navigate("/history")}
          >
            Back
          </button>
          <button
            type="button"
            className="col-md-3 col-6 btn btn-primary py-3 px-4 mx-4 d-none"
            id="discard"
            style={{ display: isDiscard ? "block" : "none" }}
            onClick={() => handleDiscard()}
          >
            Discard ticket
          </button>
        </div>
      </div>
    </>
  );
};

export default HistoryDetail;
