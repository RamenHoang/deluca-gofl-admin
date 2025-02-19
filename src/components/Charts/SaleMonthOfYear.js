import React from "react";
import { Line } from "react-chartjs-2";

const SaleMonthOfYear = (props) => {
  return (
    <>
      {props.saleMonthOfYear && (
        <Line
          data={{
            labels: [
              "Tháng 1",
              "Tháng 2",
              "Tháng 3",
              "Tháng 4",
              "Tháng 5",
              "Tháng 6",
              "Tháng 7",
              "Tháng 8",
              "Tháng 9",
              "Tháng 10",
              "Tháng 11",
              "Tháng 12",
            ],
            datasets: [
              {
                label: "VNĐ",
                data: props.saleMonthOfYear,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                lineTension: 0.1,
              },
            ],
          }}
        />
      )}
    </>
  );
};

export default SaleMonthOfYear;
