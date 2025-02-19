/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import categoryAPI from "./../../apis/categoryAPI";
import authorAPI from "./../../apis/authorAPI";
import companyAPI from "./../../apis/companyAPI";
import productAPI from "./../../apis/productAPI";
import { FILE_SIZE, SUPPORTED_FORMATS } from "./../../constants/constants";
import { errorToast, successToast } from "../../components/Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const ProductAdd = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();

  const history = useHistory();
  const [fileName, setFileName] = useState("Chọn ảnh");
  const [previewSource, setPreviewSource] = useState("");
  const [cate, setCate] = useState([]);
  const [author, setAuthor] = useState([]);
  const [company, setCompany] = useState([]);

  useEffect(() => {
    showLoader();
    categoryAPI
      .getAllCategories()
      .then((res) => {
        setCate(res.data.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });

    authorAPI
      .getAllAuthors()
      .then((res) => {
        setAuthor(res.data.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });

    companyAPI
      .getAllCompanies()
      .then((res) => {
        setCompany(res.data.data);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let addProductFormik = useFormik({
    initialValues: {
      inputCateName: "",
      inputProductName: "",
      inputProductCode: "",
      inputProductHot: "false",
      inputProductPrice: "",
      inputProductPromotion: "",
      inputProductQuantity: "",
      inputProductImage: "",
      inputAuthorName: [],
      inputCompanyName: "",
      inputProductDescription: "",
      inputProductDatePublic: "",
    },
    validationSchema: Yup.object({
      inputCateName: Yup.string().required("Bắt buộc chọn danh mục !"),
      inputProductName: Yup.string()
        .required("Bắt buộc nhập tên sản phẩm !")
        .max(255, "Tên sản phẩm quá dài, nhỏ hơn 255 kí tự !"),
      inputProductCode: Yup.string()
        .required("Bắt buộc nhập mã sản phẩm !")
        .max(100, "Mã sản phẩm quá dài, nhỏ hơn 100 kí tự"),
      inputProductHot: Yup.string(),
      inputProductPrice: Yup.number()
        .required("Bắt buộc  nhập giá sản phẩm !")
        .min(0, "Giá tiền lớn hơn 0"),
      inputProductQuantity: Yup.number()
        .required("Bắt buộc nhập số lượng sản phẩm !")
        .min(0, "Giá tiền lớn hơn 0"),
      inputProductImage: Yup.mixed()
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
      inputAuthorName: Yup.array().min(1, "Bắt buộc chọn tác giả"),
      inputCompanyName: Yup.string().required("Bắt buộc chọn nhà  xuất bản !"),
      inputProductDatePublic: Yup.string().required(
        "Bắt buộc chọn ngày phát hành !"
      ),
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("p_name", values.inputProductName);
      formData.append("p_code", values.inputProductCode);
      formData.append("p_hot", values.inputProductHot);
      formData.append("p_price", values.inputProductPrice);
      formData.append("p_promotion", values.inputProductPromotion);
      formData.append("p_quantity", values.inputProductQuantity);
      formData.append("p_image_detail", values.inputProductImage);
      formData.append("p_description", values.inputProductDescription);
      formData.append("category", values.inputCateName);

      for (let i = 0; i < values.inputAuthorName.length; i++) {
        formData.append("author[]", values.inputAuthorName[i]);
      }

      formData.append("company", values.inputCompanyName);
      formData.append("p_datepublic", values.inputProductDatePublic);

      showLoader();
      productAPI
        .addNewProduct(formData)
        .then((res) => {
          if (res.data.message === "PRODUCT_EXISTS") {
            hideLoader();
            errorToast("Mã sản phẩm là duy nhất, đã tồn tại sản phẩm !");
          }
          if (res.data.message === "UPLOAD_FAILED") {
            hideLoader();
            errorToast(
              "Lỗi upload ảnh, vui lòng kiểm tra lại đường truyền mạng !"
            );
          }
          if (res.data.message === "SUCCESS") {
            hideLoader();
            successToast("Thêm sản phẩm thành công !");
            history.push({ pathname: "/products" });
          }
        })
        .catch((err) => {
          hideLoader();
          errorToast("Có lỗi xảy ra, vui lòng thử lại");
        });
    },
  });

  let previewFile = (file) => {
    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
    }
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm sản phẩm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Trang chủ</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">Sản phẩm</Link>
                </li>
                <li className="breadcrumb-item active">Thêm sản phẩm</li>
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
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Thêm</h3>
                </div>
                {/* /.card-header */}

                <form onSubmit={addProductFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="inputCateName">Danh mục (*)</label>
                          <select
                            className="form-control"
                            name="inputCateName"
                            value={addProductFormik.values.inputCateName}
                            onChange={addProductFormik.handleChange}
                          >
                            <option value="">Chọn danh mục...</option>
                            {cate.map((value, index) => {
                              return (
                                <option key={index} value={value._id}>
                                  {value.c_name}
                                </option>
                              );
                            })}
                          </select>

                          {addProductFormik.errors.inputCateName &&
                            addProductFormik.touched.inputCateName && (
                              <small>
                                {addProductFormik.errors.inputCateName}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductName">
                            Tên sản phẩm (*)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="inputProductName"
                            placeholder="Nhập tên sản phẩm...."
                            value={addProductFormik.values.inputProductName}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductName &&
                            addProductFormik.touched.inputProductName && (
                              <small>
                                {addProductFormik.errors.inputProductName}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductCode">
                            Mã sản phẩm (*)
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="inputProductCode"
                            placeholder="Nhập mã sản phẩm...."
                            value={addProductFormik.values.inputProductCode}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductCode &&
                            addProductFormik.touched.inputProductCode && (
                              <small>
                                {addProductFormik.errors.inputProductCode}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductPrice">
                            Giá bìa sản phẩm (*)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="inputProductPrice"
                            placeholder="Nhập tên sản phẩm...."
                            value={addProductFormik.values.inputProductPrice}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProduct &&
                            addProductFormik.touched.inputProductPrice && (
                              <small>
                                {addProductFormik.errors.inputProductPrice}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductPromotion">
                            Giá khuyến mại{" "}
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="inputProductPromotion"
                            placeholder="Nhập giá khuyến mại (nếu có)...."
                            value={
                              addProductFormik.values.inputProductPromotion
                            }
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductPromotion &&
                            addProductFormik.touched.inputProductPromotion && (
                              <small>
                                {addProductFormik.errors.inputProductPromotion}
                              </small>
                            )}
                        </div>
                        <div className="form-group">
                          <label htmlFor="inputProductQuantity">
                            Số lượng sản phẩm (*)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            name="inputProductQuantity"
                            placeholder="Số lượng sản phẩm...."
                            value={addProductFormik.values.inputProductQuantity}
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductQuantity &&
                            addProductFormik.touched.inputProductQuantity && (
                              <small>
                                {addProductFormik.errors.inputProductQuantity}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label
                            htmlFor="inputProductDatePublic"
                            className="col-form-label"
                          >
                            Ngày phát hành (*)
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="inputProductDatePublic"
                            placeholder="Ngày phát hành..."
                            value={
                              addProductFormik.values.inputProductDatePublic ||
                              ""
                            }
                            onChange={addProductFormik.handleChange}
                          />

                          {addProductFormik.errors.inputProductDatePublic &&
                            addProductFormik.touched.inputProductDatePublic && (
                              <small>
                                {addProductFormik.errors.inputProductDatePublic}
                              </small>
                            )}
                        </div>
                      </div>

                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="inputProductAuthor">
                            Tên tác giả (*)
                          </label>
                          <select
                            className="form-control"
                            name="inputAuthorName"
                            multiple
                            value={addProductFormik.values.inputAuthorName}
                            onChange={addProductFormik.handleChange}
                          >
                            {author.map((value, index) => {
                              return (
                                <option key={index} value={value._id}>
                                  {value.a_name}
                                </option>
                              );
                            })}
                          </select>

                          {addProductFormik.errors.inputAuthorName &&
                            addProductFormik.touched.inputAuthorName && (
                              <small>
                                {addProductFormik.errors.inputAuthorName}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputCompanyName">
                            Nhà xuất bản (*)
                          </label>
                          <select
                            className="form-control"
                            name="inputCompanyName"
                            value={addProductFormik.values.inputCompanyName}
                            onChange={addProductFormik.handleChange}
                          >
                            <option value="">Chọn nhà xuất bản....</option>
                            {company.map((value, index) => {
                              return (
                                <option key={index} value={value._id}>
                                  {value.c_name}
                                </option>
                              );
                            })}
                          </select>

                          {addProductFormik.errors.inputCompanyName &&
                            addProductFormik.touched.inputCompanyName && (
                              <small>
                                {addProductFormik.errors.inputCompanyName}
                              </small>
                            )}
                        </div>

                        <div className="form-group row">
                          <label
                            htmlFor="inputProductHot"
                            className="col-sm-2 col-form-label"
                          >
                            Nổi bật ?
                          </label>

                          <div className="col-sm-10 mt-2">
                            <div className="icheck-primary d-inline mr-3">
                              <input
                                type="radio"
                                id="hot"
                                name="inputProductHot"
                                value="true"
                                checked={
                                  addProductFormik.values.inputProductHot ===
                                  "true"
                                }
                                onChange={addProductFormik.handleChange}
                              />
                              <label htmlFor="hot"> Nổi bật </label>
                            </div>
                            <div className="icheck-primary d-inline">
                              <input
                                type="radio"
                                id="noHot"
                                name="inputProductHot"
                                value="false"
                                checked={
                                  addProductFormik.values.inputProductHot ===
                                  "false"
                                }
                                onChange={addProductFormik.handleChange}
                              />
                              <label htmlFor="noHot"> Không nổi bật </label>
                            </div>
                          </div>

                          {addProductFormik.errors.inputProductHot &&
                            addProductFormik.touched.inputProductHot && (
                              <small>
                                {addProductFormik.errors.inputProductHot}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputFile">Hình ảnh (*)</label>
                          <div className="input-group">
                            <div className="custom-file">
                              <input
                                type="file"
                                className="custom-file-input"
                                name="inputProductImage"
                                onChange={(e) => {
                                  addProductFormik.setFieldValue(
                                    "inputProductImage",
                                    e.target.files[0]
                                  );
                                  setFileName(
                                    e.target.files[0]
                                      ? e.target.files[0].name
                                      : "Chọn ảnh"
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

                          {addProductFormik.errors.inputProductImage &&
                            addProductFormik.touched.inputProductImage && (
                              <small>
                                {addProductFormik.errors.inputProductImage}
                              </small>
                            )}
                        </div>

                        <div>
                          {previewSource && (
                            <img
                              src={previewSource}
                              style={{ height: "150px" }}
                              alt="previewImage"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <label htmlFor="inputProductDescription">
                            Mô tả sản phẩm
                          </label>
                          <CKEditor
                            name="inputProductDescription"
                            editor={ClassicEditor}
                            data={
                              addProductFormik.values.inputProductDescription
                            }
                            onChange={(e, editor) => {
                              addProductFormik.setFieldValue(
                                "inputProductDescription",
                                editor.getData()
                              );
                            }}
                          />
                          {addProductFormik.errors.inputProductDescription &&
                            addProductFormik.touched
                              .inputProductDescription && (
                              <small>
                                {
                                  addProductFormik.errors
                                    .inputProductDescription
                                }
                              </small>
                            )}
                        </div>
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

export default ProductAdd;
