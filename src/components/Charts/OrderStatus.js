import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const OrderStatus = (props) => {
  return (
    <>
      {props.statisticalOrderStatus && (
        <Pie
          data={{
            labels: [
              "Đặt hàng thành công",
              "Tiếp nhận",
              "Đang giao hàng",
              "Đã giao hàng",
              "Đã hủy",
            ],
            datasets: [
              {
                // label: 'My First Dataset',
                data: props.statisticalOrderStatus,
                backgroundColor: [
                  "#007bff",
                  "#6c757d",
                  "#17a2b8",
                  "#28a745",
                  "#dc3545",
                ],
                hoverOffset: 4,
              },
            ],
          }}
        />
      )}
    </>
  );
};

export default OrderStatus;
