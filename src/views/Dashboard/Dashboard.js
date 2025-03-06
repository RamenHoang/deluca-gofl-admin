import React, { useEffect, useState } from "react";
import dashboardAPI from "../../apis/dashboardAPI";
import { Link } from "react-router-dom";
import formatCurrency from "format-currency";
import OrderStatus from "./../../components/Charts/OrderStatus";
import ItemBox from "../../components/ItemBox/ItemBox";
import SaleMonthOfYear from "../../components/Charts/SaleMonthOfYear";

const Dashboard = () => {
  const [countAllOrders, setCountAllOrders] = useState(0);
  const [countNewOrders, setCountNewOrders] = useState(0);
  const [countUserRegister, setCountUserRegister] = useState(0);
  const [countAllProducts, setCountAllProducts] = useState(0);
  const [salesDay, setSalesDay] = useState(0);
  const [salesMonth, setSalesMonth] = useState(0);
  const [salesYear, setSalesYear] = useState(0);
  const [statisticalOrderStatus, setStatisticalOrderStatus] = useState([]);
  const [saleMonthOfYear, setSaleMonthOfYear] = useState([]);
  const [productsBestSeller, setProductBestSeller] = useState([]);

  useEffect(() => {
    dashboardAPI
      .countAllOrders()
      .then((res) => {
        setCountAllOrders(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .countNewOrders()
      .then((res) => {
        setCountNewOrders(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .countUserRegister()
      .then((res) => {
        setCountUserRegister(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .countAllProducts()
      .then((res) => {
        setCountAllProducts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .salesDay()
      .then((res) => {
        setSalesDay(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .salesMonth()
      .then((res) => {
        setSalesMonth(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    dashboardAPI
      .salesYear()
      .then((res) => {
        setSalesYear(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .statisticalOrderStatus()
      .then((res) => {
        setStatisticalOrderStatus(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .saleMonthOfYear()
      .then((res) => {
        setSaleMonthOfYear(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dashboardAPI
      .productsBestSeller()
      .then((res) => {
        setProductBestSeller(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="content-wrapper">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Bảng điều khiển</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item active">Trang chủ</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <ItemBox
              color={"primary"}
              icon={"fas fa-shopping-cart"}
              title={"TỔNG SỐ ĐƠN HÀNG"}
              count={countAllOrders}
              detail={
                <small>
                  <Link to="/orders" className="font-weight-bold">
                    {" "}
                    (Chi tiết)
                  </Link>
                </small>
              }
            />

            <ItemBox
              color={"danger"}
              icon={"fas fa-shopping-cart"}
              title={"ĐƠN HÀNG MỚI"}
              count={countNewOrders}
              detail={
                <small>
                  <Link to="/orders" className="font-weight-bold">
                    {" "}
                    (Chi tiết)
                  </Link>
                </small>
              }
            />

            <ItemBox
              color={"warning"}
              icon={"fas fa-users"}
              title={"NGƯỜI DÙNG ĐĂNG KÍ"}
              count={countUserRegister}
              detail={
                <small>
                  <Link to="/customers" className="font-weight-bold">
                    {" "}
                    (Chi tiết)
                  </Link>
                </small>
              }
            />

            <ItemBox
              color={"info"}
              icon={"fab fa-product-hunt"}
              title={"TỔNG SỐ SẢN PHẨM"}
              count={countAllProducts}
              detail={
                <small>
                  <Link to="/products" className="font-weight-bold">
                    {" "}
                    (Chi tiết)
                  </Link>
                </small>
              }
            />

            <ItemBox
              color={"success"}
              icon={"fas fa-dollar-sign"}
              title={"DOANH THU NGÀY"}
              count={`${formatCurrency(salesDay)} VNĐ`}
            />

            <ItemBox
              color={"secondary"}
              icon={"fas fa-dollar-sign"}
              title={"DOANH THU THÁNG NÀY"}
              count={`${formatCurrency(salesMonth)} VNĐ`}
            />

            <ItemBox
              color={"light"}
              icon={"fas fa-dollar-sign"}
              title={"DOANH THU NĂM NAY"}
              count={`${formatCurrency(salesYear)} VNĐ`}
            />

            <div className="col-12 col-sm-7 col-md-7">
              <div className="card card-info">
                <div className="card-header">
                  <h3 className="card-title">
                    Biểu đồ doanh thu tháng trong năm
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <SaleMonthOfYear saleMonthOfYear={saleMonthOfYear} />
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-5 col-md-5">
              <div className="card card-blue">
                <div className="card-header">
                  <h3 className="card-title">Biểu đồ trạng thái đơn hàng</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <OrderStatus
                    statisticalOrderStatus={statisticalOrderStatus}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-7 col-md-7">
              <div className="card card-warning">
                <div className="card-header">
                  <h3 className="card-title">TOP sản phẩm bán chạy</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>

                <div className="card-body">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Đã bán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsBestSeller &&
                        productsBestSeller.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td>{i}</td>
                              <td>{v.productDetail[0]?.p_name}</td>
                              <td>
                                <img
                                  src={v.productDetail[0]?.variants[0].image.url}
                                  alt="product best seller"
                                  style={{ width: "50px" }}
                                />
                              </td>
                              <td>{v.quantity}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
