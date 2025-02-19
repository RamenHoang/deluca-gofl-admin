import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import staffAPI from '../../apis/staffAPI';
import { errorToast, successToast } from '../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const StaffAdd = () => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();

  let addStaffFormik = useFormik({
    initialValues: {
      inputStaffUsername: '',
      inputStaffEmail: '',
      inputStaffPass: '',
      inputStaffRePass: '',
      inputStaffAddress: '',
      inputStaffGender: 'male',
      inputStaffDateOfBirth: '',
      inputStaffRole: 'staff',
      inputStaffPhone: ''
    },
    validationSchema: Yup.object({
      inputStaffUsername: Yup.string()
        .required("Bắt buộc nhập họ tên")
        .max(100, "Tên quá dài, nhỏ hơn 100 kí tự"),
      inputStaffEmail: Yup.string()
        .required("Bắt buộc nhập email")
        .email("Không đúng định dạng email"),
      inputStaffPass: Yup.string()
        .required("Bắt buộc nhập mật khẩu")
        .min(6, "Mật khẩu ngắn nhất là 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự"),
      inputStaffRePass: Yup.string()
        .required("Bắt buộc nhập lại mật khẩu")
        .min(6, "Mật khẩu ngắn nhất là 6 kí tự")
        .max(20, "Mật khẩu dài nhất là 20 kí tự")
        .oneOf([Yup.ref("inputStaffPass")], "Mật khẩu phải trùng nhau"),
      inputStaffAddress: Yup.string()
        .max(255, "Địa chỉ quá dài, nhỏ hơn 255 kí tự"),
      inputStaffPhone: Yup.string()
        .required("Bắt buộc nhập số điện thoại")
        .max(11, "Số điện thoại nhỏ hơn 11 số ! ")
    }),
    onSubmit: (values) => {
      let data = {
        username: values.inputStaffUsername,
        gender: values.inputStaffGender,
        email: values.inputStaffEmail,
        password: values.inputStaffPass,
        role: values.inputStaffRole,
        address: values.inputStaffAddress,
        phone: values.inputStaffPhone,
        dateOfBirth: values.inputStaffDateOfBirth
      }

      showLoader();
      staffAPI.addNewStaff(data).then((res) => {
        if (res.data.message === 'NOT_PERMISSION') {
          hideLoader();
          errorToast("Bạn không có quyền thêm nhân viên");
        }
        if (res.data.message === 'EMAIL_EXISTS') {
          hideLoader();
          errorToast("Đã tồn tại email của nhân viên, vui lòng chọn email khác");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Thêm nhân viên thành công");
          history.push({ pathname: '/staffs' });
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại");
      });
    }
  });

  return (

    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Thêm nhân viên</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                                </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/staffs">
                    Nhân viên
                            </Link>
                </li>
                <li className="breadcrumb-item active">Thêm nhân viên</li>
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
                  <h3 className="card-title">Thêm</h3>
                </div>

                <form onSubmit={addStaffFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">

                        <div className="form-group">
                          <label htmlFor="inputStaffUsername">Họ tên (*)</label>
                          <input type="text" className="form-control" name="inputStaffUsername" placeholder="Nhập họ tên nhân viên...."
                            value={addStaffFormik.values.inputStaffUsername}
                            onChange={addStaffFormik.handleChange}
                          />
                          {addStaffFormik.errors.inputStaffUsername && addStaffFormik.touched.inputStaffUsername && (
                            <small className="active-error" >{addStaffFormik.errors.inputStaffUsername}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffEmail">Email (*)</label>
                          <input type="email" className="form-control" name="inputStaffEmail" placeholder="Nhập địa chỉ email...."
                            value={addStaffFormik.values.inputStaffEmail}
                            onChange={addStaffFormik.handleChange}
                          />
                          {addStaffFormik.errors.inputStaffEmail && addStaffFormik.touched.inputStaffEmail && (
                            <small className="active-error" >{addStaffFormik.errors.inputStaffEmail}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffPass">Mật khẩu (*)</label>
                          <input type="password" className="form-control" name="inputStaffPass" placeholder="Nhập mật khẩu...."
                            value={addStaffFormik.values.inputStaffPass}
                            onChange={addStaffFormik.handleChange}
                          />
                          {addStaffFormik.errors.inputStaffPass && addStaffFormik.touched.inputStaffPass && (
                            <small className="active-error" >{addStaffFormik.errors.inputStaffPass}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffRePass">Nhập lại mật khẩu (*)</label>
                          <input type="password" className="form-control" name="inputStaffRePass" placeholder="Nhập lại mật khẩu...."
                            value={addStaffFormik.values.inputStaffRePass}
                            onChange={addStaffFormik.handleChange}
                          />
                          {addStaffFormik.errors.inputStaffRePass && addStaffFormik.touched.inputStaffRePass && (
                            <small className="active-error" >{addStaffFormik.errors.inputStaffRePass}</small>
                          )}
                        </div>


                      </div>

                      <div className="col-6">

                        <div className="form-group">
                          <label htmlFor="inputStaffPhone">Số điện thoại (*)</label>
                          <input type="number" className="form-control" name="inputStaffPhone" placeholder="Nhập số điện thoại..."
                            value={addStaffFormik.values.inputStaffPhone}
                            onChange={addStaffFormik.handleChange}
                          />
                          {addStaffFormik.errors.inputStaffPhone && addStaffFormik.touched.inputStaffPhone && (
                            <small className="active-error" >{addStaffFormik.errors.inputStaffPhone}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffAddress">Địa chỉ (*)</label>
                          <input type="text" className="form-control" name="inputStaffAddress" placeholder="Nhập địa chỉ..."
                            value={addStaffFormik.values.inputStaffAddress}
                            onChange={addStaffFormik.handleChange}
                          />
                          {addStaffFormik.errors.inputStaffAddress && addStaffFormik.touched.inputStaffAddress && (
                            <small className="active-error" >{addStaffFormik.errors.inputStaffAddress}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffGender" className="col-form-label">Giới tính</label>

                          <div className="col-sm-10">
                            <div className="icheck-primary d-inline mr-3">
                              <input type="radio" id="genderMale" name="inputStaffGender" value="male"
                                defaultChecked
                                onChange={addStaffFormik.handleChange}
                              />
                              <label htmlFor="genderMale"> Nam </label>
                            </div>
                            <div className="icheck-primary d-inline">
                              <input type="radio" id="genderFemale" name="inputStaffGender" value="female"
                                onChange={addStaffFormik.handleChange}
                              />
                              <label htmlFor="genderFemale"> Nữ </label>
                            </div>
                          </div>
                          
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffDateOfBirth" className="col-form-label">Ngày sinh </label>
                          <input type="date" className="form-control" name="inputStaffDateOfBirth" placeholder="Nhập ngày sinh..."
                            value={addStaffFormik.values.inputStaffDateOfBirth}
                            onChange={addStaffFormik.handleChange}
                          />

                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffRole">Chức vụ (*)</label>
                          <input type="text" className="form-control" defaultValue="Nhân viên" disabled />
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

export default StaffAdd;
