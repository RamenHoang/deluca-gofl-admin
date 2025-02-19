/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import bannerAPI from '../../apis/bannerAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const Banner = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    showLoader();
    bannerAPI.getAllBanners().then((res) => {
      setBanners(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, reload lại trang");
    })
  }, []);

  let handleDeleteBanner = (id) => {
    showLoader();
    bannerAPI.deleteBannerById(id).then((res) => {
      if (res.data.message === 'BANNER_NOT_FOUND') {
        hideLoader();
        errorToast("Banner không tồn tại, kiểm tra lại");
      }
      if (res.data.message === 'DESTROY_IMAGE_FAILED') {
        hideLoader();
        errorToast("Gỡ ảnh không thành công, kiểm tra lại đường truyền mạng")
      }
      if (res.data.message === 'SUCCESS') {
        let newBanners = banners.filter(b => b._id !== id);
        setBanners([...newBanners]);
        hideLoader();
        successToast("Xóa banner thành công");
      }
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại");
    })
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Banner</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Banner</li>
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
                    <Link to="/banners/add">
                      <button className="btn btn-primary">
                        <i className="fas fa-plus-circle"></i> Thêm banner
                      </button>
                    </Link>
                  </h3>
                </div>

                <div className="card-body">
                  <table id="example1" className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Tên banner</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>
                      {banners.map((v, i) => {
                        return (
                          <tr key={i}>
                            <td>{i}</td>
                            <td>{v.b_name}</td>
                            <td>
                              <img src={v.b_image.url} alt="Banner" className="img-thumbnail" style={{ height: '100px' }} />
                            </td>
                            <td>
                              <button className="btn btn-danger" onClick={() => handleDeleteBanner(v._id)}>
                                <i className="fas fa-trash-alt mr-1"></i> Xóa
                              </button>
                              <Link to={`/banners/edit/${v._id}`}>
                                <button className="btn btn-warning">
                                  <i className="fas fa-edit mr-1"></i> Sửa
                                </button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th>STT</th>
                        <th>Tên banner</th>
                        <th>Hình ảnh</th>
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
      { loader }
    </div>
  )
}

export default Banner;
