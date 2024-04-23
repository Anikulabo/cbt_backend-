import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Dropdown } from "react-bootstrap";
export const PieChart = ({ data }) => {
  const [all, setAll] = useState({
    display: false,
    department: "science",
  });
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // Ref to store the chart instance

  const changedept = (event) => {
    const dept = event.target.innerText;
    setAll({ ...all, department: dept });
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown visibility
  };

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data[all.department].labels,
          datasets: [
            {
              label: "My First Dataset",
              data: data[all.department].values,
              backgroundColor: [
                "rgba(144, 241, 144, 0.5)",
                "rgba(0, 0, 255, 0.473)",
                "rgba(240, 162, 162, 0.555)",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
            datalabels: {
              color: "#000",
              formatter: (value, context) => {
                const total = context.dataset.data.reduce(
                  (acc, cur) => acc + cur,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(2) + "%";
                return percentage;
              },
              font: {
                size: "16",
              },
            },
          },
          cutout: "70%",
        },
      });
    }
  }, [data[all.department]]);

  return (
    <div
      className="col-4"
      style={{
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        marginTop: "15px",
        padding: "15px",
        paddingRight: "15px",
        borderRadius: "5px",
        marginLeft: "15px",
      }}
    >
      <div className="container-fluid">
        {" "}
        {/* container-fluid inside col-3 */}
        <div className="row">
          <div className="col-3">
            <p
              style={{
                fontWeight: "bolder",
                textTransform: "Capitalize",
              }}
            >
              Overall Performance
            </p>
          </div>
          <div className="col-3"></div>
          <div className="col-6">
            {/* Clicking this will toggle the dropdown */}
            <Dropdown
              show={isOpen}
              align="end"
              style={{ position: "relative", right: "3" }}
            >
              {" "}
              {/* Dropdown component */}
              <Dropdown.Toggle
                variant="secondary"
                id="dropdown-basic"
                onClick={toggleDropdown}
                className="bg-light text-dark"
              >
                {" "}
                {/* Dropdown toggle button */}
                {all.department}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={(event) => changedept(event)}>
                  science
                </Dropdown.Item>{" "}
                {/* Dropdown items */}
                <Dropdown.Item onClick={(event) => changedept(event)}>
                  art
                </Dropdown.Item>
                <Dropdown.Item onClick={(event) => changedept(event)}>
                  commercial
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        <div className="row">
          <div className="col-1.5"></div>
          <div className="col-0">
            <canvas ref={chartRef} width="400" height="400"></canvas>{" "}
          </div>
          <div className="col-1.5"></div>
        </div>
      </div>{" "}
      {/* Closing container-fluid */}
    </div>
  );
};
