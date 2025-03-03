/* eslint-disable */
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import productAPI from './../../apis/productAPI';
import categoryAPI from './../../apis/categoryAPI';
import optionValueAPI from './../../apis/optionValueAPI';
import useFullPageLoader from './../../hooks/useFullPageLoader';
import { FILE_SIZE, SUPPORTED_FORMATS } from "./../../constants/constants";

const ProductEdit = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [productItem, setProductItem] = useState({});
  const [cate, setCate] = useState([]);
  const [optionValues, setOptionValues] = useState([]);
  const [uniqueOptionNames, setUniqueOptionNames] = useState([]);
  const [optionValueInputs, setOptionValueInputs] = useState([{ values: [], stock: 0, image: {} }]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    let id = props.match.params.id;
    showLoader();
    productAPI.getProductById(id).then((res) => {
      setProductItem(res.data.data);
      setOptionValueInputs(res.data.data.variants.map(variant => ({
        _id: variant._id,
        values: variant.option_values.map(option_value => option_value._id),
        stock: variant.stock,
        image: variant.image
      })));
      hideLoader();
    }).catch((err) => {
      errorToast("Có lỗi xảy ra, vui lòng thử lại !");
    });

    categoryAPI.getAllCategories().then((res) => {
      setCate(res.data.data);
      hideLoader();
    }).catch((err) => {
      console.log(err);
    });

    optionValueAPI.all().then((res) => {
      const uniqueNames = [...new Set(res.data.map(optionValue => optionValue.option.name))];
      setUniqueOptionNames(uniqueNames);
      setOptionValues(res.data);
      hideLoader();
    }).catch((err) => {
      console.log(err);
    });
  }, [props.match.params.id]);

  const addOptionValueInput = () => {
    setOptionValueInputs([...optionValueInputs, { values: [], stock: 0, image: {} }]);
  };

  const handleOptionValueChange = (index, event, valueIndex = null) => {
    const values = [...optionValueInputs];

    if (event.target.name === "image") {
      const file = event.target.files[0];

      if (file.size > FILE_SIZE) {
        errorToast("Kích thước file lớn, vui lòng chọn file khác nhỏ hơn 500 KB có định dạng là ảnh");
        return;
      }

      if (!SUPPORTED_FORMATS.includes(file.type)) {
        errorToast("Định dạng file không hợp lệ, vui lòng chọn file có định dạng là ảnh");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        values[index][event.target.name] = reader.result;
        setOptionValueInputs(values);
      };
    } else if (valueIndex !== null) {
      values[index].values[valueIndex] = event.target.value;
      setOptionValueInputs(values);
    } else {
      values[index][event.target.name] = event.target.value;
      setOptionValueInputs(values);
    }
  };

  const deleteOptionValueInput = (index) => {
    const values = [...optionValueInputs];
    values.splice(index, 1);
    setOptionValueInputs(values);
  };

  let updateProductFormik = useFormik({
    initialValues: {
      inputCateName: productItem.category ? productItem.category._id : '',
      inputProductName: productItem.p_name,
      inputProductCode: productItem.p_code,
      inputProductHot: productItem.p_hot,
      inputProductPrice: productItem.p_price,
      inputProductPromotion: productItem.p_promotion,
      inputProductQuantity: productItem.p_quantity,
      inputProductDatePublic: productItem.p_datepublic,
      inputProductDescription: productItem.p_description,
      inputRating: productItem.rating || 0,
      inputNumberOfRating: productItem.number_of_rating || 0
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputCateName: Yup.string()
        .required("Bắt buộc chọn danh mục !"),
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
      inputProductDatePublic: Yup.string()
        .required("Bắt buộc chọn ngày phát hành !")
    }),
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append('p_name', values.inputProductName);
      formData.append('p_code', values.inputProductCode);
      formData.append('p_price', values.inputProductPrice);
      formData.append('p_promotion', values.inputProductPromotion);
      formData.append('p_quantity', values.inputProductQuantity);
      formData.append('p_datepublic', values.inputProductDatePublic);
      formData.append('p_description', values.inputProductDescription);
      formData.append('category', values.inputCateName);
      formData.append('p_hot', values.inputProductHot);

      optionValueInputs.forEach((input, index) => {
        if (input._id) {
          formData.append(`variants[${index}][_id]`, input._id);
        }
        input.values.forEach((value, idx) => {
          formData.append(`variants[${index}][option_values][${idx}]`, value);
        });
        formData.append(`variants[${index}][stock]`, input.stock);

        if (typeof input.image === "object") {
          formData.append(`variants[${index}][image]`, JSON.stringify(input.image));
        } else {
          formData.append(`variants[${index}][image]`, input.image);
        }
      });

      formData.append('rating', values.inputRating);
      formData.append('number_of_rating', values.inputNumberOfRating);

      showLoader();
      productAPI.updateProductById(props.match.params.id, formData).then((res) => {
        if (res.data.message === 'PRODUCT_NOT_FOUND') {
          hideLoader();
          errorToast("Sản phẩm không tồn tại");
        }
        if (res.data.message === 'DESTROY_IMAGE_FAILED') {
          hideLoader();
          errorToast("Xóa ảnh thất bại, kiểm tra đường truyền mạng");
        }

        if (res.data.message === 'UPLOAD_FAILED') {
          hideLoader();
          errorToast("Cập nhật ảnh thất bại, kiểm tra đường truyền mạng");
        }

        if (res.data.message === 'EXISTS_CODE') {
          hideLoader();
          errorToast("Mã sản phẩm đã tồn tại");
        }

        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Cập nhật sản phẩm thành công !");
          history.push({ pathname: '/products' });
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại");
      })
    }
  });

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật sản phẩm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">
                    Sản phẩm
                  </Link>
                </li>
                <li className="breadcrumb-item active">Cập nhật sản phẩm</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary">

                <div className="card-header">
                  <h3 className="card-title">Cập nhật</h3>
                </div>

                <form onSubmit={updateProductFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 col-sm-6">

                        <div className="form-group">
                          <label htmlFor="inputCateName">Danh mục (*)</label>
                          <select className="form-control"
                            name="inputCateName"
                            value={updateProductFormik.values.inputCateName}
                            onChange={updateProductFormik.handleChange}
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

                          {updateProductFormik.errors.inputCateName &&
                            updateProductFormik.touched.inputCateName && (
                              <small>
                                {updateProductFormik.errors.inputCateName}
                              </small>
                            )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductName">Tên sản phẩm (*)</label>
                          <input type="text" className="form-control" name="inputProductName" placeholder="Nhập tên sản phẩm...."
                            value={updateProductFormik.values.inputProductName || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductName && updateProductFormik.touched.inputProductName && (
                            <small className="active-error">{updateProductFormik.errors.inputProductName}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductCode">Mã sản phẩm (*)</label>
                          <input type="text" className="form-control" name="inputProductCode" placeholder="Nhập mã sản phẩm...."
                            value={updateProductFormik.values.inputProductCode || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductCode && updateProductFormik.touched.inputProductCode && (
                            <small className="active-error">{updateProductFormik.errors.inputProductCode}</small>
                          )}

                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductPrice">Giá bìa sản phẩm (*)</label>
                          <input type="number" className="form-control" name="inputProductPrice" placeholder="Nhập giá bìa sản phẩm...."
                            value={updateProductFormik.values.inputProductPrice || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductPrice && updateProductFormik.touched.inputProductPrice && (
                            <small className="active-error">{updateProductFormik.errors.inputProductPrice}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductPromotion">Giá khuyến mại (nếu có)</label>
                          <input type="number" className="form-control" name="inputProductPromotion" placeholder="Nhập giá khuyến mại...."
                            value={updateProductFormik.values.inputProductPromotion || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                          {updateProductFormik.errors.inputProductPromotion && updateProductFormik.touched.inputProductPromotion && (
                            <small className="active-error">{updateProductFormik.errors.inputProductPromotion}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductQuantity">Số lượng sản phẩm (*)</label>
                          <input type="number" className="form-control" name="inputProductQuantity" placeholder="Số lượng sản phẩm...."
                            value={updateProductFormik.values.inputProductQuantity || ''}
                            onChange={updateProductFormik.handleChange}
                          />
                          {updateProductFormik.errors.inputProductQuantity && updateProductFormik.touched.inputProductQuantity && (
                            <small className="active-error">{updateProductFormik.errors.inputProductQuantity}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputProductDatePublic" className="col-form-label">Ngày phát hành (*)</label>
                          <input type="date" className="form-control" name="inputProductDatePublic" placeholder="Ngày phát hành..."
                            value={updateProductFormik.values.inputProductDatePublic || ''}
                            onChange={updateProductFormik.handleChange}
                          />

                        </div>

                      </div>

                      <div className="col-6">

                        <div className="form-group row">
                          <label htmlFor="inputProductHot" className="col-12 col-form-label">Nổi bật ?</label>

                          <div className="col-12 mt-2">
                            <div className="icheck-primary d-inline mr-3">
                              <input type="radio" id="hot" name="inputProductHot" value="true"
                                checked={updateProductFormik.values.inputProductHot === "true" || ''}
                                onChange={updateProductFormik.handleChange}
                              />
                              <label htmlFor="hot"> Nổi bật </label>
                            </div>
                            <div className="icheck-primary d-inline">
                              <input type="radio" id="noHot" name="inputProductHot" value="false"
                                checked={updateProductFormik.values.inputProductHot === "false" || ''}
                                onChange={updateProductFormik.handleChange}
                              />
                              <label htmlFor="noHot"> Không nổi bật </label>
                            </div>
                          </div>
                        </div>

                        <div className="form-group row">
                          <div className="col-6">
                            <label htmlFor="inputRating">Đánh giá</label>
                            <input type="number" className="form-control" name="inputRating" placeholder="Nhập đánh giá sản phẩm...." value={updateProductFormik.values.inputRating} onChange={updateProductFormik.handleChange} />
                          </div>
                          <div className="col-6">
                            <label htmlFor="inputNumberOfRating">Số lần</label>
                            <input type="number" className="form-control" name="inputNumberOfRating" placeholder="Nhập số lần đánh giá sản phẩm...." value={updateProductFormik.values.inputNumberOfRating} onChange={updateProductFormik.handleChange} />
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
                                {typeof input.image === "string" && (
                                  <img
                                    src={input.image}
                                    style={{ height: "150px", marginRight: "10px" }}
                                    alt={`previewImage-${index}`}
                                  />
                                )}
                                {typeof input.image === "object" && input.image.url && (
                                  <img
                                    src={input.image.url}
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-12">
                        <label htmlFor="inputProductDescription">Mô tả sản phẩm</label>
                        <CKEditor
                          name="inputProductDescription"
                          editor={ClassicEditor}
                          data={updateProductFormik.values.inputProductDescription}
                          onChange={(e, editor) => {
                            updateProductFormik.setFieldValue("inputProductDescription", editor.getData())
                          }}
                        />
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

      {loader}
    </div>
  )
}

export default ProductEdit;
