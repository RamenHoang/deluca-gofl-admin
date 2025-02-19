/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orderAPI from '../../apis/orderAPI';
import OrderDetail from '../../components/Modal/OrderDetail';
import formatDate from '../../utils/formatDate';
import { errorToast, successToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Order = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState([]);
  const [orderDetail, setOrderDetail] = useState();

  useEffect(() => {
    orderAPI.getAllOrders().then(res => {
      setOrders(res.data.data);
    }).catch(err => {
      console.log(err);
    })
  }, []);

  let viewOrderDetail = (orderId) => {
    showLoader();
    orderAPI.getOrderDetailByOrder(orderId).then(res => {
      setOrderDetail(res.data.data);
      hideLoader();
    }).catch(err => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    })
  };

  let handleChangeStatusOrder = (id, data) => {
    showLoader();
    orderAPI.changeStatusOrder(id, { o_status: data }).then(res => {
      if (res.data.message === 'SUCCESS') {

        let index = orders.findIndex(v => v._id === id);
        let newOrders = [...orders];

        delete newOrders[index].o_status;

        newOrders[index] = {
          ...newOrders[index],
          o_status: data
        }

        setOrders([...newOrders]);
        hideLoader();
        successToast("Thay đổi trạng thái đơn hàng thành công !");
      }
    }).catch(err => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    });
  }

  const filterOrder = (orders) => {
    return orders.filter(val => query === "" || val.o_code.toLowerCase().indexOf(query.toLowerCase()) > -1
      || val.o_nameReceiver.toLowerCase().indexOf(query.toLowerCase()) > -1
      || val.o_shippingAddress.toLowerCase().indexOf(query.toLowerCase()) > -1
      || val.o_phoneReceiver.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : '')
  }

  const filterByStatus = (e) => {
    setStatus(e.target.value);
    showLoader();
    orderAPI.filterByStatus(e.target.value).then(res => {
      setOrders(res.data.data);
      hideLoader();
    }).catch(err => {

    });
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Quản lý đơn hàng</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Quản lý đơn hàng</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">

                  </h3>
                  <div>
                    <form className="form-inline">
                      <input className="form-control mr-sm-2" type="search" placeholder="Nhập từ khóa tìm kiếm...." aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <select className="form-control" value={status} onChange={filterByStatus} >
                        <option value="" >Tình trạng đơn hàng...</option>
                        <option value="Đặt hàng thành công">Đặt hàng thành công</option>
                        <option value="Tiếp nhận">Tiếp nhận</option>
                        <option value="Đang giao hàng">Đang giao hàng</option>
                        <option value="Đã giao hàng">Đã giao hàng</option>
                        <option value="Đã hủy">Đã hủy</option>
                      </select>
                      <button className="btn btn-outline-success ml-2 my-2 my-sm-0 p-1" type="button">
                        <i className="fas fa-search"></i>
                        Tìm kiếm
                      </button>
                    </form>
                  </div>
                </div>
                <div className="card-body">
                  <table id="example1" className="table table-bordered table-hover table-responsive">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Thông tin người nhận</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thời gian đặt hàng</th>
                        <th style={{ width: '25%' }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filterOrder(orders).map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{i}</td>
                            <td>{v.o_code}</td>
                            <td>
                              <ul>
                                <li>Người nhận: {v.o_nameReceiver}</li>
                                <li>Số điện thoại: {v.o_phoneReceiver}</li>
                                <li>Địa chỉ: {v.o_shippingAddress}</li>
                              </ul>
                            </td>
                            <td> {v.o_totalPrice} VNĐ </td>
                            <td>
                              {v.o_status === "Đặt hàng thành công" ? (<span className="badge bg-light">Đặt hàng thành công</span>) : ''}
                              {v.o_status === "Tiếp nhận" ? (<span className="badge bg-secondary">Tiếp nhận</span>) : ''}
                              {v.o_status === "Đang giao hàng" ? (<span className="badge bg-info">Đang giao hàng</span>) : ''}
                              {v.o_status === "Đã giao hàng" ? (<span className="badge bg-success">Đã giao hàng</span>) : ''}
                              {v.o_status === "Đã hủy" ? (<span className="badge bg-danger">Đã hủy</span>) : ''}
                            </td>
                            <td> {formatDate(v.createdAt)} </td>
                            <td>

                              <div className="btn-group" role="group" aria-label="Basic example">

                                {v.o_status === 'Đã hủy' ? '' : (<Link to={`/invoice?code=${v.o_code}`} className="btn btn-warning"><i className="fas fa-print"></i> Hóa đơn</Link>)}

                                <button onClick={() => viewOrderDetail(v._id)} className="btn btn-info" data-toggle="modal" data-target="#modalOrderDetail">
                                  <i className="fas fa-eye mr-1"></i>
                                  Chi tiết
                                </button>

                                {
                                  v.o_status === "Đã hủy" || v.o_status === "Đã giao hàng" ? '' : (
                                    <div className="btn-group">
                                      <button type="button" className="btn btn-success">Action</button>
                                      <button type="button" className="btn btn-success dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className="sr-only">Toggle Dropdown</span>
                                      </button>
                                      <div className="dropdown-menu">
                                        <span style={{ cursor: 'pointer' }} className="dropdown-item" onClick={() => handleChangeStatusOrder(v._id, "Tiếp nhận")} >
                                          <i className="fas fa-shipping-fast mr-2"></i>Tiếp nhận
                                        </span>
                                        <span style={{ cursor: 'pointer' }} className="dropdown-item" onClick={() => handleChangeStatusOrder(v._id, "Đang giao hàng")} >
                                          <i className="fas fa-shipping-fast mr-2"></i>Đang giao hàng
                                        </span>
                                        <span style={{ cursor: 'pointer' }} className="dropdown-item" onClick={() => handleChangeStatusOrder(v._id, "Đã giao hàng")} >
                                          <i className="fas fa-clipboard-check mr-2"></i>
                                          Đã giao hàng
                                        </span>
                                        <span style={{ cursor: 'pointer' }} className="dropdown-item" onClick={() => handleChangeStatusOrder(v._id, "Đã hủy")} >
                                          <i className="fas fa-trash-alt mr-2"></i>
                                          Hủy đơn hàng
                                        </span>
                                      </div>
                                    </div>
                                  )
                                }
                              </div>
                            </td>
                          </tr>
                        )
                      })
                      }
                    </tbody>
                    <tfoot>
                      <tr>
                        <th>STT</th>
                        <th>Mã đơn hàng</th>
                        <th>Thông tin người nhận</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Thời gian đặt hàng</th>
                        <th>Hành động</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrderDetail data={orderDetail} />
      {loader}
    </div>
  )
}

export default Order;
