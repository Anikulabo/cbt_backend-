import "./top.css";
import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { Students } from "./studenttables";
import { Dropdown } from "react-bootstrap";
export const PieChart = ({ data, tabledata }) => {
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
    <div className="container-fluid" style={{ marginTop: "15px" }}>
      <div className="row">
        <div className="col-md-4">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="card-title text-uppercase mb-4">
                Overall Performance
              </h5>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <p className="mb-0">Department:</p>
                <Dropdown show={isOpen} align="end">
                  <Dropdown.Toggle
                    variant="secondary"
                    id="dropdown-basic"
                    onClick={toggleDropdown}
                  >
                    {all.department}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={(event) => changedept(event)}>
                      science
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(event) => changedept(event)}>
                      art
                    </Dropdown.Item>
                    <Dropdown.Item onClick={(event) => changedept(event)}>
                      commercial
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <canvas ref={chartRef} width="400" height="400"></canvas>
              <div className="legend mt-3">
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: "rgba(144, 241, 144, 0.5)" }}
                  ></span>
                  <span className="legend-label">Excellent</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: "rgba(0, 0, 255, 0.473)" }}
                  ></span>
                  <span className="legend-label">Average</span>
                </div>
                <div className="legend-item">
                  <span
                    className="legend-dot"
                    style={{ backgroundColor: "rgba(240, 162, 162, 0.555)" }}
                  ></span>
                  <span className="legend-label">Poor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <Students
                headers={[
                  "Image",
                  "Username",
                  "Department",
                  "Subject",
                  "Status",
                  "Action",
                ]}
                data={tabledata}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
