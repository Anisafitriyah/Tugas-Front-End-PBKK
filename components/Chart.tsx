"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

export default function Chart() {
  const data = {
    labels: ["New Book", "Issued", "New Member", "Not Returned"],
    datasets: [
      {
        label: "Report",
        data: [0, 16, 8, 3],
        borderColor: "#3b82f6",
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
      },
    ],
  };

  return <Line data={data} />;
}
