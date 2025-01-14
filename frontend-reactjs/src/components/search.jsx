import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import Select from "react-select";
import { format } from "date-fns";
import PropTypes from "prop-types";

const Search = ({ width, corlorBorder }) => {
  const style = {
    width: width || "1056px", // Sử dụng giá trị width từ prop hoặc giá trị mặc định là 1056px
    border: `2px solid ${corlorBorder}`,
  };
  const [startDate, setStartDate] = useState(new Date());
  const [deparature, setdeparature] = useState("");
  const [destination, setDestination] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/bus-station/list`
        );
        const data = await response.json();
        const fetchedOptions = data.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching bus operators:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    console.log("deparature", typeof deparature.value);
    console.log("destination", destination);
    const formattedDate = format(startDate, "MM/dd/yyyy");
    console.log("data", formattedDate);

    let url = `/list?startPoint=${deparature.value}&endPoint=${
      destination.value
    }&startTime=${format(startDate, "MM/dd/yyyy")}`;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/bus/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startPoint: deparature.value,
        endPoint: destination.value,
        page: 0,
        limit: 100,
        startTime: formattedDate,
      }),
      success: function (data) {
        console.log("DataSearch: ", data);
      },
    });
    window.localStorage.setItem("url", url);
    window.location.href = url;
  };

  return (
    <>
      <div className=" formSearch bg-white pt-4 rounded-3 shadow" style={style}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "10px",
          }}
        >
          <div className="flex items-center flex-row col p-2" id="deparature">
            {/* Nội dung điểm đi ở đây */}
            <FaMapMarkerAlt
              className="m-2 ml-0"
              size={24}
              style={{ color: "#5D5FEF", height: "100%" }}
            />
            <Select
              options={options}
              onChange={setdeparature} // Add onChange handler
              styles={{
                container: (base) => ({
                  ...base,
                  width: `405px`,
                  outline: "none",
                }),
              }}
              placeholder="Select deparature"
            />
          </div>
          <div
            className="flex items-center flex-row p-2"
            id="destination"
            style={{}}
          >
            <FaMapMarkerAlt
              className="m-2 ml-0"
              size={24}
              style={{ color: "#5D5FEF", height: "100%" }}
            />
            {/* Nội dung điểm đến ở đây */}
            <Select
              options={options}
              onChange={setDestination} // Add onChange handler
              styles={{
                container: (base) => ({
                  ...base,
                  width: `405px`,
                  outline: "none",
                }),
              }}
              placeholder="Select Destination"
            />
          </div>
        </div>
        <div className="f1 flex w-100 row p-2">
          <div className="bg-white col setDate">
            {/* Thêm align-items-center */}
            <FaCalendar
              className=""
              style={{ width: "35px", height: "35px", color: "#5D5FEF" }}
            />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="form-control m-0 custom-datepicker"
              placeholderText="Ngày đi"
              dateFormat="dd/MM/yyyy" // Định dạng ngày tháng
              style={{ background: "yellow" }}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="mx-auto btnLogin"
            // style={{ }}
            id="btnSearch"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </>
  );
};
Search.propTypes = {
  width: PropTypes.string,
  corlorBorder: PropTypes.string
};
export default Search;
