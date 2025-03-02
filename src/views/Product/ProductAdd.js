/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import categoryAPI from "./../../apis/categoryAPI";
import optionValueAPI from "./../../apis/optionValueAPI";
import productAPI from "./../../apis/productAPI";
import { FILE_SIZE, SUPPORTED_FORMATS } from "./../../constants/constants";
import { errorToast, successToast } from "../../components/Toasts/Toasts";
import useFullPageLoader from "./../../hooks/useFullPageLoader";

const ProductAdd = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [fileNames, setFileNames] = useState(["Chọn ảnh"]);
  const [previewSources, setPreviewSources] = useState([]);
  const [cate, setCate] = useState([]);
  const [optionValues, setOptionValues] = useState([]);
  const [uniqueOptionNames, setUniqueOptionNames] = useState([]);
  const [optionValueInputs, setOptionValueInputs] = useState([{ values: [], stock: 0, image: null }]);
  const [variantImages, setVariantImages] = useState([]);

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

    optionValueAPI
      .all()
      .then((res) => {
        setOptionValues(res.data);
        const uniqueNames = [...new Set(res.data.map(optionValue => optionValue.option.name))];
        setUniqueOptionNames(uniqueNames);
        hideLoader();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const addOptionValueInput = () => {
    setOptionValueInputs([...optionValueInputs, { values: [], stock: 0, image: null }]);
    setVariantImages([...variantImages, null]);
  };

  const handleOptionValueChange = (index, event, valueIndex = null) => {
    const values = [...optionValueInputs];
    if (event.target.name === "image") {
      values[index][event.target.name] = event.target.files[0];
      const images = [...variantImages];
      images[index] = event.target.files[0];
      setVariantImages(images);
      addProductFormik.setFieldValue("inputVariantImages", images);
    } else if (valueIndex !== null) {
      values[index].values[valueIndex] = event.target.value;
    } else {
      values[index][event.target.name] = event.target.value;
    }
    setOptionValueInputs(values);
  };

  const deleteOptionValueInput = (index) => {
    const values = [...optionValueInputs];
    values.splice(index, 1);
    setOptionValueInputs(values);
    const images = [...variantImages];
    images.splice(index, 1);
    setVariantImages(images);
  };

  let addProductFormik = useFormik({
    initialValues: {
      inputCateName: "",
      inputProductName: "",
      inputProductCode: "",
      inputProductHot: "false",
      inputProductPrice: "",
      inputProductPromotion: "",
      inputProductQuantity: "",
      inputVariantImages: [],
      inputAuthorName: [],
      inputCompanyName: "",
      inputProductDescription: "",
      inputProductDatePublic: "",
      inputRating: 0,
      inputNumberOfRating: 0,
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
      inputVariantImages: Yup.array()
        .min(1, "Bắt buộc chọn ít nhất một hình ảnh sản phẩm")
        .test(
          "fileSize",
          "Kích thước file lớn, vui lòng chọn file khác nhỏ hơn 200 KB có định dạng là ảnh",
          (value) => {
            return value.every(file => file.size <= FILE_SIZE);
          }
        )
        .test(
          "fileFormat",
          "Không hỗ trợ loại file này, lòng chọn file ảnh",
          (value) => {
            return value.every(file => SUPPORTED_FORMATS.includes(file.type));
          }
        ),
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
      formData.append("p_description", values.inputProductDescription);
      formData.append("category", values.inputCateName);
      formData.append("p_datepublic", values.inputProductDatePublic);

      optionValueInputs.forEach((input, index) => {
        input.values.forEach((value, valueIndex) => {
          if (value == "") {
            return;
          }
          formData.append(`variants[${index}][option_values][${valueIndex}]`, value);
        });
        if (input.stock == "") {
          return;
        }
        formData.append(`variants[${index}][stock]`, input.stock);
      });

      values.inputVariantImages.forEach((image) => {
        if (image) {
          formData.append(`variant_images`, image);
        }
      });

      formData.append("rating", values.inputRating);
      formData.append("number_of_rating", values.inputNumberOfRating);

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

  let previewFiles = (files) => {
    const fileReaders = [];
    const sources = [];
    files.forEach((file, index) => {
      let reader = new FileReader();
      fileReaders.push(reader);
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        sources.push(reader.result);
        if (sources.length === files.length) {
          setPreviewSources(sources);
        }
      };
    });
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
                        <div className="form-group row">
                          <label
                            htmlFor="inputProductHot"
                            className="col-12 col-form-label"
                          >
                            Nổi bật ?
                          </label>

                          <div className="col-12 mt-2">
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

                        <div className="form-group row">
                          <div className="col-6">
                            <label htmlFor="inputRating">Đánh giá</label>
                            <input type="number" className="form-control" name="inputRating" placeholder="Nhập đánh giá sản phẩm...." value={addProductFormik.values.inputRating} onChange={addProductFormik.handleChange} />
                          </div>
                          <div className="col-6">
                            <label htmlFor="inputNumberOfRating">Số lần</label>
                            <input type="number" className="form-control" name="inputNumberOfRating" placeholder="Nhập số lần đánh giá sản phẩm...." value={addProductFormik.values.inputNumberOfRating} onChange={addProductFormik.handleChange} />
                          </div>
                        </div>

                        <div className="row form-group">
                          <label htmlFor="optionValues" className="col-12">Biến thể sản phẩm</label>
                          {optionValueInputs.map((input, index) => (
                            <div key={index} className="row form-group col-12 mb-2" style={{ border: "1px solid #ccc", padding: "5px 0px", marginLeft: "5px" }}>
                              <div key={index} className="mb-2 col-6">
                                {uniqueOptionNames.map((optionName, idx) => (
                                  <div className="row form-group" key={idx}>
                                    <label key={idx} className="col-6">
                                      {optionName}
                                    </label>
                                    <select
                                      className="form-control col-6"
                                      name={`value${idx}`}
                                      value={input.values[idx]}
                                      onChange={(event) => handleOptionValueChange(index, event, idx)}
                                    >
                                      <option value="">Chọn giá trị...</option>
                                      {optionValues
                                        .filter(optionValue => optionValue.option.name === optionName)
                                        .map((optionValue, idx) => (
                                          <option key={idx} value={optionValue._id}>
                                            {optionValue.value}
                                          </option>
                                        ))}
                                    </select>
                                  </div>
                                ))}
                                <div className="row form-group">
                                  <label className="col-6">Số lượng</label>
                                  <input
                                    type="number"
                                    className="form-control col-6"
                                    name="stock"
                                    placeholder="Số lượng..."
                                    value={input.stock}
                                    onChange={(event) => handleOptionValueChange(index, event)}
                                  />
                                </div>
                                <div className="row form-group">
                                  <label className="col-6">Hình ảnh</label>
                                  <input
                                    type="file"
                                    className="form-control col-6"
                                    name="image"
                                    onChange={(event) => handleOptionValueChange(index, event)}
                                  />
                                </div>
                                <div className="col-2">
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => deleteOptionValueInput(index)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                              <div key={index} className="mb-2 col-6">
                                {variantImages[index] && (
                                  <img
                                    src={URL.createObjectURL(variantImages[index])}
                                    style={{ height: "150px", marginRight: "10px" }}
                                    alt={`previewImage-${index}`}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={addOptionValueInput}
                          >
                            <i className="fas fa-plus"></i> Thêm biến thể
                          </button>
                        </div>

                        {/* <div className="form-group">
                            <label htmlFor="inputFiles">Hình ảnh (*)</label>
                            <div className="input-group">
                            <div className="custom-file">
                              <input
                              type="file"
                              className="custom-file-input"
                              name="inputProductImages"
                              multiple
                              onChange={(e) => {
                                addProductFormik.setFieldValue(
                                "inputProductImages",
                                Array.from(e.target.files)
                                );
                                setFileNames(
                                Array.from(e.target.files).map(file => file.name)
                                );
                                previewFiles(
                                Array.from(e.target.files)
                                );
                              }}
                              />
                              <label
                              className="custom-file-label"
                              htmlFor="inputFile"
                              >
                              {fileNames.join(", ")}
                              </label>
                            </div>
                            <div className="input-group-append">
                              <span className="input-group-text">Upload</span>
                            </div>
                            </div>

                            {addProductFormik.errors.inputProductImages &&
                            addProductFormik.touched.inputProductImages && (
                              <small>
                              {addProductFormik.errors.inputProductImages}
                              </small>
                            )}
                          </div> */}

                        {/* <div>
                          {previewSources.map((source, index) => (
                            <img
                              key={index}
                              src={source}
                              style={{ height: "150px", marginRight: "10px" }}
                              alt={`previewImage-${index}`}
                            />
                          ))}
                        </div> */}
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

                    <div className="card-footer">
                      <button type="submit" className="btn btn-primary">
                        Thêm
                      </button>
                      <button type="reset" className="btn btn-warning">
                        Làm mới
                      </button>
                    </div>
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
