import PropTypes from 'prop-types';
import { useEffect, useState } from "react";

const TicketDetail = () => {
    var isDiscard = false;
    var [detailTicket, setDetailTicket] = useState({});
    var tid = getUrlParameter("tid");
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    var token = userInfo?.token?.token;

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

    // canDiscard();

    return (
      <>
        <div className="detail d-none" id="detail">
          {/* <h1>{detailTicket.buses.bus_operators.name}</h1> */}
          <div className="mt-5 row justify-content-center align-items-center">
            <button
              type="button"
              className="col-md-3 col-6 btn btn-primary py-3 px-4 my-4"
              onClick={() => {}}
            >
              Back
            </button>
            <button
              type="button"
              className="col-md-3 col-6 btn btn-primary py-3 px-4 mx-4 d-none"
              id="discard"
              style={{ display: isDiscard ? "block" : "none" }}
              onClick={() => {}}
            >
              Discard ticket
            </button>
          </div>
        </div>
      </>
    );
};

export default TicketDetail;