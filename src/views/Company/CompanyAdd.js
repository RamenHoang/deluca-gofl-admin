import { useFormik } from 'formik';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import companyAPI from './../../apis/companyAPI';
import useFullPageLoader from './../../hooks/useFullPageLoader';
const CompanyAdd = () => {

  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();

  let addCompanyFormik = useFormik({
    initialValues: {
      inputCompanyName: '',
      inputCompanyCode: '',
      inputCompanyDescription: ''
    },
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
      }
      showLoader();
      companyAPI.addNewCompany(data).then((res) => {
        if (res.data.message === 'COMPANY_EXISTS') {
          hideLoader();
          errorToast("Nhà xuất bản đã tồn tại");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Thêm nhà xuất bản thành công");
          history.push({ pathname: '/companies' });
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
              <h1>Thêm nhà xuất bản</h1>
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
                <li className="breadcrumb-item active">Thêm nhà xuất bản</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content" >
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Thêm</h3>
                </div>

                <form onSubmit={addCompanyFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="inputCompanyName">Tên nhà xuất bản (*)</label>
                          <input type="text" className="form-control" name="inputCompanyName" placeholder="Nhập tên nhà xuất bản...."
                            value={addCompanyFormik.values.inputCompanyName}
                            onChange={addCompanyFormik.handleChange}
                          />
                          {addCompanyFormik.errors.inputCompanyName && addCompanyFormik.touched.inputCompanyName && (
                            <small className="active-error" >{addCompanyFormik.errors.inputCompanyName}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputCompanyCode">Mã nhà xuất bản (*)</label>
                          <input type="text" className="form-control" name="inputCompanyCode" placeholder="Nhập mã nhà xuất bản...."
                            value={addCompanyFormik.values.inputCompanyCode}
                            onChange={addCompanyFormik.handleChange}
                          />
                          {addCompanyFormik.errors.inputCompanyCode && addCompanyFormik.touched.inputCompanyCode && (
                            <small className="active-error" >{addCompanyFormik.errors.inputCompanyCode}</small>
                          )}
                        </div>

                      </div>
                      <div className="col-6 col-sm-6">
                        <div className="form-group">
                          <label htmlFor="inputCompanyDescription">Thông tin thêm</label>
                          <CKEditor
                            name="inputCompanyDescription"
                            editor={ClassicEditor}
                            data={addCompanyFormik.values.inputCompanyDescription}
                            onChange={(e, editor) => {
                              addCompanyFormik.setFieldValue("inputCompanyDescription", editor.getData())
                            }}
                          />
                          
                          {addCompanyFormik.errors.inputCompanyDescription && addCompanyFormik.touched.inputCompanyDescription && (
                            <small className="active-error" >{addCompanyFormik.errors.inputCompanyDescription}</small>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button type="submit" className="btn btn-primary">Thêm</button>
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

export default CompanyAdd;
