'use client'
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
// import Chart from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const BarChart = ({data}) => {
  const [chartOptions, setChartOptions] = React.useState(null)

    useEffect(() => {
    if (data?.summary?.orderStats?.length > 0) {
      setChartOptions({
        series: [
          {
            name: "Order Count",
            data: data.summary.orderStats.map(item => item.count),
          },
        ],
        options: {
          chart: {
            type: "bar",
            columnWidth: "20px",
            background: "#fff",
            toolbar: {
              show: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
              borderRadius: 5,
              columnWidth: "30px",
              dataLabels: {
                position: "top",
              },
            },
          },
          colors: ["#595959"],
          states: {
            hover: {
              enable: false,
            },
          },
          stroke: {
            show: true,
            width: 1,
            colors: ["#fff"],
          },
          grid: {
            show: true,
            borderColor: "#e0e0e0",
            columnWidth: "20px",
            strokeDashArray: 4,
            position: "back",
          },
          tooltip: {
            shared: true,
            intersect: false,
          },
          xaxis: {
            categories: data.summary.orderStats.map(item => item.date),
          },
        },
      });
    }
  }, [data]);

  if (!chartOptions) return <div>Loading chart...</div>;

  return (
    <div className="bar_chart_order_stats">
      <h3>Order Statistics</h3>
      {chartOptions !== null && (
        <Chart
          key={chartOptions.series[0]}
          options={chartOptions.options}
          series={chartOptions.series}
          type="bar"
          height={305}
        />
      )}
    </div>
  );
};

export default BarChart;
