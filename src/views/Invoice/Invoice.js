import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReactToPrint from "react-to-print";
import queryString from "query-string";
import "./Invoice.css";
import orderAPI from "./../../apis/orderAPI";
import formatCurrency from "format-currency";

const Invoice = (props) => {
  const invoice = useRef();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    orderAPI
      .getOrderDetailByCode(queryString.parse(props.location.search).code)
      .then((res) => {
        setOrder(res.data.data.order);
        setProducts(res.data.data.products);
      });

    window.scrollTo(0, 0);
  }, [props.location.search]);

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>
                Hóa đơn đơn hàng #
                {queryString.parse(props.location.search).code}
              </h1>
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-warning mt-2">
                    {" "}
                    <i className="fas fa-print"></i> In hóa đơn{" "}
                  </button>
                )}
                content={() => invoice.current}
              />
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <Link to="/orders" className="breadcrumb-item">
                  Đơn hàng #{queryString.parse(props.location.search).code}
                </Link>
                <li className="breadcrumb-item active">
                  Hóa đơn #{queryString.parse(props.location.search).code}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div
              ref={invoice}
              className="offset-xl-2 col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12 padding"
            >
              <div className="card">
                <div className="card-header p-4">
                  <a
                    className="pt-2 d-inline-block"
                    href="http://localhost:3000"
                    data-abc="true"
                  >
                    DELUCA.VN
                  </a>
                  <div className="float-right">
                    <h3 className="mb-0">Hoá đơn #{order.o_code}</h3>
                    {new Date().getDate() +
                      " - " +
                      new Date().getMonth() +
                      " - " +
                      new Date().getFullYear()}
                  </div>
                </div>
                <div className="card-body">
                  <div className="row mb-4">
                    <div className="col-sm-6">
                      <h5 className="mb-3">Chuyển từ:</h5>
                      <h3 className="text-dark mb-1">DELUCA.VN</h3>
                      <div>
                        Địa chỉ: Số 1, Đại Cồ Việt, Quận Hai Bà Trưng, TP.Hà Nội
                      </div>
                      <div>Email: tridv.textbook@gmail.com</div>
                      <div>Điện thoại: +84 964 223 234</div>
                    </div>
                    <div className="col-sm-6 ">
                      <h5 className="mb-3">Đến: </h5>
                      <h3 className="text-dark mb-1">{order.o_nameReceiver}</h3>

                      <div>Địa chỉ: {order.o_shippingAddress}</div>
                      <div>Email: {}</div>
                      <div>Điện thoại: {order.o_phoneReceiver}</div>
                    </div>
                  </div>
                  <div className="table-responsive-sm">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th className="center">#</th>
                          <th>Tên sách</th>
                          <th>Hình ảnh</th>
                          <th className="right">Giá</th>
                          <th className="center">Số lượng</th>
                          <th className="right">Tạm tính</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((v, i) => {
                          return (
                            <tr key={i}>
                              <td className="center">{i + 1}</td>
                              <td className="left strong">
                                {v.product ? `${v.product.p_name} / ${v.variant ? v.variant.color.name : 'N/A'} / ${v.size ? v.size.name : 'N/A'}` : "N/A"}
                              </td>
                              <td className="left">
                                <img
                                  src={v.variant.images[0].url}
                                  style={{ height: "50px" }}
                                  alt="description product"
                                />
                              </td>
                              <td className="right">
                                {formatCurrency(v.price)} đ
                              </td>
                              <td className="center">{v.quantity}</td>
                              <td className="right">
                                {formatCurrency(v.quantity * v.price)} đ
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="row">
                    <div className="col-lg-4 col-sm-5"></div>
                    <div className="col-lg-4 col-sm-5 ml-auto">
                      <table className="table table-clear">
                        <tbody>
                          <tr>
                            <td className="left">
                              <strong className="text-dark">Tạm tính</strong>
                            </td>
                            <td className="right">
                              {formatCurrency(
                                order.o_totalPrice - order.o_shippingFee
                              )}{" "}
                              đ
                            </td>
                          </tr>
                          {/* <tr>
                            <td className="left">
                              <strong className="text-dark">
                                Giảm giá (0%)
                              </strong>
                            </td>
                            <td className="right">0.00 đ</td>
                          </tr> */}
                          <tr>
                            <td className="left">
                              <strong className="text-dark">
                                Phí vận chuyển
                              </strong>
                            </td>
                            <td className="right">
                              {formatCurrency(order.o_shippingFee)} đ
                            </td>
                          </tr>
                          <tr>
                            <td className="left">
                              <strong className="text-dark">Tổng cộng</strong>{" "}
                            </td>
                            <td className="right">
                              <strong className="text-dark">
                                {formatCurrency(order.o_totalPrice)} đ
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white">
                  <p className="mb-0">
                    Số 1, Đại Cồ Việt, Quận Hai Bà Trưng, TP.Hà Nội
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Invoice;
