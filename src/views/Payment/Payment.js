/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import paymentAPI from './../../apis/paymentAPI';
import { successToast, errorToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';
import { Modal, Button } from 'react-bootstrap';

const Payment = () => {

  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [transferQRCode, setTransferQRCode] = useState({});

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append('file', image);

    try {
      const res = await paymentAPI.uploadQRCode(formData);
      setTransferQRCode(res.data.image);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    showLoader();
    paymentAPI.getPaymentInfo().then((res) => {
      console.log(res.data.payment);
      if (!res.data.payment) {
        hideLoader();
        return;
      }
      setTransferQRCode(res.data.payment.qrCode);
      hideLoader();
    }).catch((err) => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại");
      hideLoader();
    });
  }, []);

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thanh toán</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Thanh toán</li>
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
                <div className="card-body">
                  <form>
                    <div className='form-group'>
                      <label>Mã QR chuyển khoản</label>
                      <input
                        type="file"
                        className="form-control"
                        placeholder="Chọn file QR chuyển khoản ..."
                        onChange={(e) => uploadImage(e.target.files[0])}
                      />
                    </div>
                    <div className='form-group'>
                      <img src={transferQRCode.url} alt="QR Code" style={{ height: '200px' }} />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        showLoader();
                        paymentAPI.updatePaymentInfo({ transferQRCode }).then((res) => {
                          successToast("Cập nhật thông tin chuyển khoản thành công");
                          hideLoader();
                        }).catch((err) => {
                          errorToast("Có lỗi xảy ra, vui lòng thử lại");
                          hideLoader();
                        });
                      }}
                    >
                      Cập nhật
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loader}
    </div>
  )
}

export default Payment;
