import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import  { useFormik } from 'formik';
import  * as Yup from 'yup';
import staffAPI from '../../apis/staffAPI';
import  { errorToast, successToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';

const StaffEdit = (props) => {
  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const history = useHistory();
  const [staff, setStaff] = useState({});

  useEffect(() => {
    let id = props.match.params.id;
    staffAPI.getStaffById(id).then((res) => {
      setStaff(res.data.data);
    }).catch((err) => {
      console.log(err);
    })
  }, [props.match.params.id]);

  let updateStaffFormik = useFormik({
    initialValues: {
      inputStaffUsername: staff.username,
      inputStaffEmail: staff.email,
      inputStaffAddress: staff.address,
      inputStaffGender: staff.gender,
      inputStaffDateOfBirth: staff.dateOfBirth,
      inputStaffRole: staff.role,
      inputStaffPhone: staff.phone
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputStaffUsername: Yup.string()
        .required("Bắt buộc nhập họ tên")
        .max(100, "Tên quá dài, nhỏ hơn 100 kí tự"),
      inputStaffEmail: Yup.string()
        .required("Bắt buộc nhập email")
        .email("Không đúng định dạng email"),
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
        role: values.inputStaffRole,
        address: values.inputStaffAddress,
        phone: values.inputStaffPhone,
        dateOfBirth: values.inputStaffDateOfBirth
      }
      showLoader();
      staffAPI.updateStaffById(props.match.params.id, data).then((res) => {
        if (res.data.message === 'NOT_PERMISSION') {
          hideLoader();
          errorToast("Bạn không có quyền cập nhật thông tin nhân viên !");
        }
        if (res.data.message === 'USER_NOT_FOUND') {
          hideLoader();
          errorToast("Nhân viên không tồn tại, vui lòng thử lại !");
        }
        if (res.data.message === 'SUCCESS') {
          hideLoader();
          successToast("Cập nhật thông tin nhân viên thành công !");
          history.push({ pathname: '/staffs' });
        }
      }).catch((err) => {
        hideLoader();
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      })
    }
  });

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Cập nhật nhân viên</h1>
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
                <li className="breadcrumb-item active">Cập nhật nhân viên</li>
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

                <form onSubmit={updateStaffFormik.handleSubmit}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">

                        <div className="form-group">
                          <label htmlFor="inputStaffUsername">Họ tên (*)</label>
                          <input type="text" className="form-control" name="inputStaffUsername" placeholder="Nhập họ tên nhân viên...."
                            value={updateStaffFormik.values.inputStaffUsername || ''}
                            onChange={updateStaffFormik.handleChange}
                          />
                          {updateStaffFormik.errors.inputStaffUsername && updateStaffFormik.touched.inputStaffUsername && (
                            <small className="active-error" >{updateStaffFormik.errors.inputStaffUsername}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffEmail">Email (*)</label>
                          <input type="email" className="form-control" name="inputStaffEmail" placeholder="Nhập địa chỉ email...." disabled
                            value={updateStaffFormik.values.inputStaffEmail || ''}
                            onChange={updateStaffFormik.handleChange}
                          />
                          {updateStaffFormik.errors.inputStaffEmail && updateStaffFormik.touched.inputStaffEmail && (
                            <small className="active-error" >{updateStaffFormik.errors.inputStaffEmail}</small>
                          )}
                        </div>

                      </div>

                      <div className="col-6">

                        <div className="form-group">
                          <label htmlFor="inputStaffPhone">Số điện thoại (*)</label>
                          <input type="number" className="form-control" name="inputStaffPhone" placeholder="Nhập số điện thoại..."
                            value={updateStaffFormik.values.inputStaffPhone || ''}
                            onChange={updateStaffFormik.handleChange}
                          />
                          {updateStaffFormik.errors.inputStaffPhone && updateStaffFormik.touched.inputStaffPhone && (
                            <small className="active-error" >{updateStaffFormik.errors.inputStaffPhone}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffAddress">Địa chỉ (*)</label>
                          <input type="text" className="form-control" name="inputStaffAddress" placeholder="Nhập địa chỉ..."
                            value={updateStaffFormik.values.inputStaffAddress || ''}
                            onChange={updateStaffFormik.handleChange}
                          />
                          {updateStaffFormik.errors.inputStaffAddress && updateStaffFormik.touched.inputStaffAddress && (
                            <small className="active-error" >{updateStaffFormik.errors.inputStaffAddress}</small>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffGender" className="col-form-label">Giới tính</label>

                          <div className="col-sm-10">
                            <div className="icheck-primary d-inline mr-3">
                              <input type="radio" id="genderMale" name="inputStaffGender" value="male"
                                checked={updateStaffFormik.values.inputStaffGender === 'male'}
                                onChange={updateStaffFormik.handleChange}
                              />
                              <label htmlFor="genderMale"> Nam </label>
                            </div>
                            <div className="icheck-primary d-inline">
                              <input type="radio" id="genderFemale" name="inputStaffGender" value="female"
                                checked={updateStaffFormik.values.inputStaffGender === 'female'}
                                onChange={updateStaffFormik.handleChange}
                              />
                              <label htmlFor="genderFemale"> Nữ </label>
                            </div>
                          </div>

                        </div>

                        <div className="form-group">
                          <label htmlFor="inputStaffDateOfBirth" className="col-form-label">Ngày sinh </label>
                          <input type="date" className="form-control" name="inputStaffDateOfBirth" placeholder="Nhập ngày sinh..."
                            value={updateStaffFormik.values.inputStaffDateOfBirth || ''}
                            onChange={updateStaffFormik.handleChange}
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

export default StaffEdit;
