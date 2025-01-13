import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import Select from "react-select";
import { format } from "date-fns";

const Search = () => {
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
            const fetchedOptions = data.data.map(item => ({
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
    console.log('deparature', typeof(deparature.value));
    console.log('destination', destination);
    const formattedDate = format(startDate, 'MM/dd/yyyy');
    console.log('data', formattedDate);
    
    let url = `/list?startPoint=${deparature.value}&endPoint=${destination.value}&startTime=${format(startDate,"MM/dd/yyyy")}`;
    
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
        console.log('DataSearch: ', data);
      },
    });
    window.localStorage.setItem("url", url);
    window.location.href = url;
};
  
return (
  <>
    <div
      className=" bg-white pt-4 rounded-3 shadow"
      style={{ height: "220px", width: "700px" }}
    >
      <div className="flex items-center">
        <div className="flex flex-row col p-2" id="deparature">
          {/* Nội dung điểm đi ở đây */}
          <FaMapMarkerAlt className="m-2 ml-0" size={24} />
          <Select
            options={options}
            onChange={setdeparature} // Add onChange handler
            styles={{
              container: base => ({ ...base, width: `${700 / 2 - 56}px` }),
            }}
            placeholder="Select deparature"
          />
        </div>
        <div className="flex flex-row p-2" id="destination">
          <FaMapMarkerAlt className="m-2 ml-0" size={24} />
          {/* Nội dung điểm đến ở đây */}
          <Select
            options={options}
            onChange={setDestination} // Add onChange handler
            styles={{
              container: base => ({ ...base, width: `${700 / 2 - 56}px` }),
            }}
            placeholder="Select Destination"
          />
        </div>
      </div>
      <div className="flex justify-center row p-2">
        <div className="bg-white col w-100 flex items-center">
          {" "}
          {/* Thêm align-items-center */}
          <FaCalendar className="m-2" size={24} />
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            className="form-control flex-fill m-0"
            placeholderText="Ngày đi"
            dateFormat="dd/MM/yyyy" // Định dạng ngày tháng
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="p-2 mx-auto"
          style={{ background: "" }}
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

export default Search;
