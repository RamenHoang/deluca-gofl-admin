/* eslint-disable */
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import companyAPI from './../../apis/companyAPI';
import * as Yup from 'yup';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const CompanyEdit = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  
  const history = useHistory();
  const [company, setCompany] = useState({});

  useEffect(() => {
    let id = props.match.params.id;
    showLoader();
    companyAPI.getCompanyById(id).then((res) => {
      setCompany(res.data.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      errorToast("Có lỗi xảy ra, vui lòng thử lại sau !");
    })
  }, [props.match.params.id]);

  let updateCompanyFormik = useFormik({
    initialValues: {
      inputCompanyName: company.c_name,
      inputCompanyCode: company.c_code,
      inputCompanyDescription: company.c_info
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputCompanyName: Yup.string()
        .required('Bắt buộc nhập tên công ty')
        .max(255, "Tên quá dài, nhỏ hơn 255 kí tự"),
      inputCompanyCode: Yup.string()
        .required("Bắt buộc nhập mã công ty")
        .max(100, "Mã quá dài, nhỏ hơn 100 kí tự")
    }),
    onSubmit: (values) => {
      let data = {
        c_name: values.inputCompanyName,
        c_code: values.inputCompanyCode,
        c_info: values.inputCompanyDescription
      };
      showLoader();
      companyAPI.updateCompanyById(props.match.params.id, data).then((res) => {
        if (res.data.message === 'COMPANY_NOT_FOUND') {
          hideLoader();
          errorToast("Nhà xuất bản không tồn tại");
        }
        if (res.data.message === 'COMPANY_EXISTS') {
          hideLoader();
          errorToast("Mã nhà xuất bản đã tồn tại");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Cập nhật nhà xuất bản thành công");
          history.push({ pathname: '/companies' })
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại sau !");
      })
    }
  })

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật nhà xuất bản</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                            </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/companies" >
                    Nhà xuất bản
                            </Link>
                </li>
                <li className="breadcrumb-item active">Cập nhật nhà xuất bản</li>
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

                <form onSubmit={updateCompanyFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputCompanyName">Tên nhà xuất bản (*)</label>
                          <input type="text" className="form-control" name="inputCompanyName" placeholder="Nhập tên nhà xuất bản...."
                            value={updateCompanyFormik.values.inputCompanyName || ''}
                            onChange={updateCompanyFormik.handleChange}
                          />
                          {updateCompanyFormik.errors.inputCompanyName && updateCompanyFormik.touched.inputCompanyName && (
                            <small className="active-error" >{updateCompanyFormik.errors.inputCompanyName}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputCompanyCode">Mã nhà xuất bản (*)</label>
                          <input type="text" className="form-control" name="inputCompanyCode" placeholder="Nhập mã nhà xuất bản...."
                            value={updateCompanyFormik.values.inputCompanyCode || ''}
                            onChange={updateCompanyFormik.handleChange}
                          />
                          {updateCompanyFormik.errors.inputCompanyName && updateCompanyFormik.touched.inputCompanyName && (
                            <small className="active-error" >{updateCompanyFormik.errors.inputCompanyName}</small>
                          )}
                        </div>
                      </div>

                      <div className="col-6">
                        <div className="form-group">
                          <label htmlFor="inputCompanyDescription">Thông tin thêm</label>
                          <CKEditor
                            name="inputCompanyDescription"
                            editor={ClassicEditor}
                            data={updateCompanyFormik.values.inputCompanyDescription}
                            onChange={(e, editor) => {
                              updateCompanyFormik.setFieldValue("inputCompanyDescription", editor.getData())
                            }}
                          />
                          
                          {updateCompanyFormik.errors.inputCompanyDescription && updateCompanyFormik.touched.inputCompanyDescription && (
                            <small className="active-error" >{updateCompanyFormik.errors.inputCompanyDescription}</small>
                          )}
                        </div>
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

export default CompanyEdit;
