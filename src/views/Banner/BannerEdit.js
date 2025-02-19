/* eslint-disable */
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import bannerAPI from './../../apis/bannerAPI';
import { errorToast, successToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const BannerEdit = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [banner, setBanner] = useState({});

  const [fileName, setFileName] = useState('Chọn file');
  const [previewSource, setPreviewSouce] = useState('');

  useEffect(() => {
    showLoader();
    bannerAPI.getBannerById(props.match.params.id).then((res) => {
      setBanner(res.data.data);
      hideLoader();
    }).catch((err) => {
      console.log(err);
      hideLoader();
    })
  }, [props.match.params.id]);

  let updateBannerFormik = useFormik({
    initialValues: {
      inputBannerName: banner.b_name,
      inputBannerImage: ''
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputBannerName: Yup.string()
        .required("Bắt buộc nhập tên banner")
        .max(100, "Tên banner quá dài, nhỏ hơn 100 kí tự"),
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append('b_name', values.inputBannerName);
      formData.append('b_image', values.inputBannerImage);

      showLoader();
      bannerAPI.updateBannerById(props.match.params.id, formData).then((res) => {
        if (res.data.message === 'BANNER_NOT_FOUND') {
          hideLoader();
          errorToast("Banner không tồn tại");
        }
        if (res.data.message === 'DESTROY_IMAGE_FAILED') {
          hideLoader();
          errorToast("Xóa ảnh cũ không thành công, kiểm tra đường truyền mạng");
        }
        if (res.data.message === 'UPLOAD_FAILED') {
          hideLoader();
          errorToast("Cập nhật ảnh mới không thành công, kiểm tra đường truyền mạng");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Cập nhật thành công");
          history.push({ pathname: '/banners' });
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại");
      })
    }
  });

  let previewFile = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSouce(reader.result);
    }
  }

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật banner</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                              </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/banners" >
                    Banner
                              </Link>
                </li>
                <li className="breadcrumb-item active">Cập nhật banner</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content" >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* general form elements */}
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Thêm</h3>
                </div>

                <form onSubmit={updateBannerFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputBannerName">Tên banner (*)</label>
                          <input type="text" className="form-control" name="inputBannerName" placeholder="Nhập tên banner..."
                            value={updateBannerFormik.values.inputBannerName || ''}
                            onChange={updateBannerFormik.handleChange}
                          />
                          {updateBannerFormik.errors.inputBannerName && updateBannerFormik.touched.inputBannerName && (
                            <small className="active-error" >{updateBannerFormik.errors.inputBannerName}</small>
                          )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="currImage">Hình ảnh hiện tại</label>
                          <div className="row">
                            <img src={banner.b_image ? banner.b_image.url : ''} alt="currImage" style={{ height: '150px' }} />
                          </div>
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputFile">Hình ảnh mới</label>
                          <div className="input-group">
                            <div className="custom-file">
                              <input type="file" className="custom-file-input" name="inputBannerImage"
                                onChange={(e) => {
                                  updateBannerFormik.setFieldValue('inputBannerImage', e.target.files[0]);
                                  setFileName(e.target.files[0] ? e.target.files[0].name : 'Chọn file')
                                  previewFile(e.target.files[0] ? e.target.files[0] : null)
                                }}
                              />
                              <label className="custom-file-label" htmlFor="inputFile">{fileName}</label>
                            </div>
                            <div className="input-group-append">
                              <span className="input-group-text">Upload</span>
                            </div>
                          </div>

                          {updateBannerFormik.errors.inputBannerImage && updateBannerFormik.touched.inputBannerImage && (
                            <small className="active-error" >{updateBannerFormik.errors.inputBannerImage}</small>
                          )}
                        </div>

                        {previewSource && (
                          <img src={previewSource} className="img-thumbnail" style={{ height: '150px' }} alt="PreviewImage" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Cập nhật</button>
                    <button type="reset" className="btn btn-warning">Làm mới</button>
                  </div>
                </form>

              </div>
            </div>
          </div>
        </div>
      </section>
      { loader }
    </div>
  )
}

export default BannerEdit;
