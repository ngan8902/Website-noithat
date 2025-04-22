import React from "react";
import Sidebar from "../components/sales/Sidebar";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts";

export default function Dashboard() {
  const [bestSellers, setBestSellers] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/dashboard/best-sellers`);
        setBestSellers(data);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm bán chạy:", error);
      }
    };

    const fetchTopCustomers = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/dashboard/top-customers`);
        setTopCustomers(data);
      } catch (error) {
        console.error("Lỗi khi tải khách hàng chi tiêu nhiều:", error);
      }
    };

    fetchBestSellers();
    fetchTopCustomers();
  }, []);

  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchDailyRevenue = async () => {
      try {
        let query = "";
        if (startDate && endDate) {
          query = `?start=${startDate}&end=${endDate}`;
        }

        const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/dashboard/daily-revenue${query}`);
        const formattedData = res.data.map(item => {
          const formattedDate = `${item.weekday} (${item._id})`;
          return {
            ...item,
            formattedDate
          };
        });
        setDailyRevenue(formattedData);

      } catch (err) {
        console.error("Lỗi khi tải doanh thu hàng ngày:", err);
      }
    };

    fetchDailyRevenue();
  }, [startDate, endDate]);

  const [barData, setBarData] = useState([]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2024 + 1 }, (_, i) => 2024 + i).reverse();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_URL_BACKEND}/dashboard/monthly-revenue?year=${selectedYear}`);
        const formattedData = res.data.map(item => {
          const month = Number(item._id.split("-")[1]);
          return {
            ...item,
            name: `Tháng ${month}`,
          };
        });
        setBarData(formattedData);
      } catch (err) {
        console.error("Lỗi khi tải doanh thu theo tháng:", err);
      }
    };

    fetchMonthlyRevenue();
  }, [selectedYear]);

  return (
    <>
    <div className="d-flex app-container">
      <Sidebar />
      <div className="content p-4 main-content">
        <div className="p-4 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">

            <div className="bg-white p-6 rounded-2xl shadow col-span-1 md:col-span-2 xl:col-span-3">
              <h2 className="text-xl font-semibold mb-4 text-indigo-600">
                📊 Doanh thu theo tháng
              </h2>
              <div 
                className="flex justify-end items-center mb-4"
                style={{marginLeft: "80%"}}
              >
                <label className="mr-2 text-sm font-medium">Chọn năm: </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border px-3 py-1 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={barData} barSize={35}>
                  <defs>
                    <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#8884d8" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1_000_000}tr`} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const { orders, totalRevenue } = payload[0].payload;
                        return (
                          <div className="bg-white p-2 rounded shadow text-sm border border-gray-200">
                            <p className="font-semibold">{label}</p>
                            <p>🛒 {orders} đơn hàng</p>
                            <p>💰 Tổng tiền: {(totalRevenue / 1_000_000).toLocaleString("vi-VN")} triệu</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="totalRevenue" fill="url(#barColor)" radius={[8, 8, 0, 0]}>
                    <LabelList
                      dataKey="totalRevenue"
                      position="top"
                      formatter={(value) => `${(value / 1_000_000).toFixed(1)}tr`}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 text-center mt-2">
                Doanh thu (triệu đồng) trong năm
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-lg font-semibold mb-2 text-green-600">
                📅 Doanh thu theo ngày
              </h2>
              <div 
                className="flex items-center gap-3 mb-4"
                style={{marginLeft: "45%"}}
              >
                <label className="text-sm font-medium">Từ ngày: </label>
                <input
                  type="date"
                  className="border px-3 py-1 rounded"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <label className="text-sm font-medium ml-3">Đến ngày: </label>
                <input
                  type="date"
                  className="border px-3 py-1 rounded"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />

                <button
                  className="btn btn-primary text-sm text-blue-500 hover:underline ml-4"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Trong 7 ngày
                </button>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dailyRevenue}>
                  <XAxis dataKey="formattedDate" />
                  <YAxis 
                    label={{ value: "Số đơn", angle: -90, position: "insideLeft" }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const { orders, totalRevenue } = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded shadow text-sm border border-gray-200">
                            <p className="font-semibold">{label}</p>
                            <p>🛒 {orders} đơn hàng</p>
                            <p>💰 {(totalRevenue / 1_000_000).toLocaleString("vi-VN")} triệu</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#2ecc71"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                    name="Đơn hàng"
                  />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 text-center mt-2">
                Doanh thu theo ngày
              </p>
            </div>

            <div className="container mt-4">
              <div className="row">
                {/* Sản phẩm bán chạy */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="card-title text-danger fw-bold mb-3">
                        🔥 Top sản phẩm bán chạy
                      </h5>
                      <ul className="list-group list-group-flush">
                        {bestSellers.map((item, idx) => (
                          <li
                            key={idx}
                            className="list-group-item d-flex justify-content-between align-items-center bg-light rounded mb-2 border-0 shadow-sm transition-all"
                            onMouseEnter={e => {
                              e.currentTarget.style.backgroundColor = "#ffe6e6";
                              e.currentTarget.style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.backgroundColor = "#f8f9fa";
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <span><i className="bi bi-box me-2 text-danger"></i>{item.name}</span>
                            <span className="fw-bold text-dark">{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Khách hàng chi tiêu nhiều */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="card-title text-primary fw-bold mb-3">
                        👑 Top khách hàng chi tiêu
                      </h5>
                      <ul className="list-group list-group-flush">
                      {topCustomers.map((customer, idx) => (
                        <li
                          key={idx}
                          className="list-group-item d-flex justify-content-between align-items-center bg-light rounded mb-2 border-0 shadow-sm transition-all"
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = "#e6f0ff";
                            e.currentTarget.style.transform = "scale(1.02)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = "#f8f9fa";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          <div>
                            <div><i className="bi bi-person-fill text-warning me-2"></i>{customer.fullname}</div>
                            <small className="text-muted">📞 {customer.phone}</small>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-dark">
                              {Number(customer.totalSpent).toLocaleString("vi-VN")}₫
                            </div>
                            <small className="text-muted">{customer.orders} đơn</small>
                          </div>
                        </li>
                      ))}
                    </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}
