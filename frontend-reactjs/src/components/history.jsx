import { useEffect, useState } from 'react';

const History = () => {
    // var page = 0;
    var limit = 5;
    var typeOfBus = ["Limousine", "Normal Seat", "Sleeper Bus"];
    var statusBook = ["Just booked", "Booked", "Canceled payment"];
    var userInfo = JSON.parse(localStorage.getItem("userInfo"));
    var token = userInfo?.token?.token;
    var uid = userInfo?.user?.id;

    const [currentHistoryData, setCurrentHistoryData] = useState([]);
    const [page, setPage] = useState(0);

    const loadMore = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/history/${page}/${limit}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ uid }),
            });

            const data = await response.json();
            console.log("result:", data);

            if (data.historyList[0]) {
                setCurrentHistoryData(prevData => [...prevData, ...data.historyList]);
            } else {
                alert("You reach the final history");
            }
        } catch (error) {
            console.log("Error", error);
        }

        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        loadMore();
    }, []);

    const handleViewDetail = (id) => {
        window.location.href = "/ticket-detail?tid=" + id;
    };

    return (
      <>
        <div className="history-list">
          <div className="h1 text-center">Vexere history</div>
          <div id="hList" className="">
            <div className="table-responsive">
              <table id="history-list" className="table table-striped mt-5">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">id</th>
                    <th scope="col">House</th>
                    <th scope="col">Start point</th>
                    <th scope="col">End point</th>
                    <th scope="col">Start time</th>
                    <th scope="col">End time</th>
                    <th scope="col">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHistoryData
                    .map(
                      (item, index) => 
                    <tr key={index}>
                        <td scope='row' width ='2%'>{index + 1}</td>
                        <td>{item.id}</td>
                        <td>{item.buses.bus_operators.name}</td>
                        <td>{
                          item.buses
                            .bus_stations_buses_start_pointTobus_stations.name
                        }</td>
                        <td>{
                          item.buses.bus_stations_buses_end_pointTobus_stations
                            .name
                        }</td>
                        <td>{item.buses.start_time}</td>
                        <td>{item.buses.end_time}</td>
                        <td><span className="text-primary" onClick={() => handleViewDetail(item.id)} role="button">View</span></td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="d-grid gap-2 col-3 mx-auto">
              <a
                className="btn btn-outline-primary float-center"
                id="load-more"
                onClick={() => loadMore()}
              >
                Load more
              </a>
            </div>
          </div>
        </div>
      </>
    );
};

export default History;