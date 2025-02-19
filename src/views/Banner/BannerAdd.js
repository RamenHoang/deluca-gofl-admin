import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { FILE_SIZE, SUPPORTED_FORMATS } from "./../../constants/constants";
import { errorToast, successToast } from "../../components/Toasts/Toasts";
import bannerAPI from "./../../apis/bannerAPI";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const BannerAdd = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [fileName, setFileName] = useState("Chọn file");
  const [previewSource, setPreviewSouce] = useState("");

  let previewFile = (file) => {
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSouce(reader.result);
      };
    }
  };

  let addBannerFormik = useFormik({
    initialValues: {
      inputBannerName: "",
      b_image: "",
    },
    validationSchema: Yup.object({
      inputBannerName: Yup.string()
        .required("Bắt buộc nhập tên banner")
        .max(100, "Tên banner quá dài, nhỏ hơn 100 kí tự"),
      b_image: Yup.mixed()
        .required("Bắt buộc chọn hình ảnh sản phẩm")
        .test(
          "fileSize",
          "Kích thước file lớn, vui lòng chọn file khác nhỏ hơn 200 KB có định dạng là ảnh",
          (value) => {
            return value && value.size <= FILE_SIZE;
          }
        )
        .test(
          "fileFormat",
          "Không hỗ trợ loại file này, lòng chọn file ảnh",
          (value) => {
            return value && SUPPORTED_FORMATS.includes(value.type);
          }
        ),
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("b_name", values.inputBannerName);
      formData.append("b_image", values.b_image);

      showLoader();
      bannerAPI
        .addNewBanner(formData)
        .then((res) => {
          if (res.data.message === "UPLOAD_FAILED") {
            hideLoader();
            errorToast("Upload ảnh thất bại");
          }
          if (res.data.message === "SUCCESS") {
            hideLoader();
            successToast("Thêm banner thành công");
            history.push({ pathname: "/banners" });
          }
        })
        .catch((err) => {
          hideLoader();
          errorToast("Có lỗi xảy ra, vui lòng thử lại");
        });
    },
  });
  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm banner</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/banners">Banner</Link>
                </li>
                <li className="breadcrumb-item active">Thêm banner</li>
              </ol>
            </div>
          </div>
        </div>
        {/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              {/* general form elements */}
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Thêm</h3>
                </div>

                <form onSubmit={addBannerFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputBannerName">
                            Tên banner (*)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="inputBannerName"
                            placeholder="Nhập tên banner..."
                            value={addBannerFormik.values.inputBannerName}
                            onChange={addBannerFormik.handleChange}
                          />
                          {addBannerFormik.errors.inputBannerName &&
                            addBannerFormik.touched.inputBannerName && (
                              <small className="active-error">
                                {addBannerFormik.errors.inputBannerName}
                              </small>
                            )}
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputFile">Hình ảnh (*)</label>
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                name="b_image"
                                onChange={(e) => {
                                  console.log(e.target.files[0]);
                                  addBannerFormik.setFieldValue(
                                    "b_image",
                                    e.target.files[0]
                                  );
                                  setFileName(
                                    e.target.files[0]
                                      ? e.target.files[0].name
                                      : "Chọn file"
                                  );
                                  previewFile(
                                    e.target.files[0] ? e.target.files[0] : null
                                  );
                                }}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="inputFile"
                              >
                                {fileName}
                              </label>
                            </div>
                            <div className="input-group-append">
                              <span className="input-group-text">Upload</span>
                            </div>
                          </div>

                          {addBannerFormik.errors.b_image &&
                            addBannerFormik.touched.b_image && (
                              <small className="active-error">
                                {addBannerFormik.errors.b_image}
                              </small>
                            )}
                        </div>

                        {previewSource && (
                          <img
                            src={previewSource}
                            className="img-thumbnail"
                            style={{ height: "150px" }}
                            alt="PreviewImage"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">
                      Thêm
                    </button>
                    <button type="reset" className="btn btn-warning">
                      Làm mới
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loader}
    </div>
  );
};

export default BannerAdd;
