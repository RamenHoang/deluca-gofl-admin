import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import userAPI from './../../apis/userAPI';
import { useHistory } from 'react-router-dom';
import getCookie from './../../utils/getCookie';
import { successToast, errorToast } from './../../components/Toasts/Toasts';

const TabUpdateInfo = ({ userInfo }) => {

  const history = useHistory();

  const userInfoFormik = useFormik({
    initialValues: {
      inputEmail: userInfo.email,
      inputUsername: userInfo.username,
      inputGender: userInfo.gender,
      inputDateOfBirth: userInfo.dateOfBirth,
      inputAddress: userInfo.address,
      inputPhoneNumber: userInfo.phone,
      inputRole: userInfo.role
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      inputEmail: Yup.string()
        .required("Bắt buộc nhập email !")
        .email("Định dạng email !"),
      inputUsername: Yup.string()
        .required("Bắt buộc nhập username !")
        .max(100, "Tên quá dài, bé hơn 100 kí tự !"),
      inputAddress: Yup.string()
        .required("Bắt buộc nhập địa chỉ !")
        .max(255, "Địa chỉ quá dài, bé hơn 255 kí tự")
    }),
    onSubmit: (values) => {
      let data = {
        username: values.inputUsername,
        gender: values.inputGender,
        email: values.inputEmail,
        role: values.inputRole,
        address: values.inputAddress,
        phone: values.inputPhoneNumber,
        dateOfBirth: values.inputDateOfBirth
      }
      userAPI.updateUserInfo(getCookie('currentAdminId'), data).then((res) => {
        if (res.data.message === 'USER_NOT_FOUND') {
          errorToast("Người dùng không tồn tại, vui lòng thử lại");
        }

        if (res.data.message === 'SUCCESS') {
          successToast("Cập nhật thành công !");
          history.go(0);
        }
      }).catch((err) => {
        errorToast("Có lỗi xảy ra, vui lòng thử lại !");
      })
    }
  });

  return (
    <div className="tab-pane active" id="information">
      <form className="form-horizontal" onSubmit={userInfoFormik.handleSubmit}>

        <div className="form-group row">
          <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email (*)</label>
          <div className="col-sm-10">
            <input type="email" className="form-control" name="inputEmail" placeholder="Email" disabled 
              value={userInfoFormik.values.inputEmail || ''} onChange={userInfoFormik.handleChange} />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputUsername" className="col-sm-2 col-form-label">Tên tài khoản (*)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="inputUsername" placeholder="Name" 
            value={userInfoFormik.values.inputUsername || ''} onChange={userInfoFormik.handleChange} />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputGender" className="col-sm-2 col-form-label">Giới tính</label>

          <div className="col-sm-10">
            <div className="icheck-primary d-inline mr-3">
              <input type="radio" id="genderMale" name="inputGender" value="male" 
                checked={userInfoFormik.values.inputGender === "male"}
                onChange={userInfoFormik.handleChange} />
              <label htmlFor="genderMale"> Nam </label>
            </div>
            <div className="icheck-primary d-inline">
              <input type="radio" id="genderFemale" name="inputGender" value="female" 
              checked={userInfoFormik.values.inputGender === "female"}
              onChange={userInfoFormik.handleChange} />
              <label htmlFor="genderFemale"> Nữ </label>
            </div>
          </div>

        </div>

        <div className="form-group row">
          <label htmlFor="inputDateOfBirth" className="col-sm-2 col-form-label">Ngày sinh</label>
          <div className="col-sm-10">
            <input type="date" className="form-control" name="inputDateOfBirth" placeholder="Date Of Birth" 
            value={userInfoFormik.values.inputDateOfBirth || ''} onChange={userInfoFormik.handleChange} />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputAddress" className="col-sm-2 col-form-label">Địa chỉ (*)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="inputAddress" placeholder="Address" 
            value={userInfoFormik.values.inputAddress || ''} onChange={userInfoFormik.handleChange} />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputPhoneNumber" className="col-sm-2 col-form-label">Số điện thoại (*)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="inputPhoneNumber" placeholder="Phone number" 
            value={userInfoFormik.values.inputPhoneNumber || ''} onChange={userInfoFormik.handleChange} />
          </div>
        </div>

        <div className="form-group row">
          <label htmlFor="inputRole" className="col-sm-2 col-form-label">Quyền (*)</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" name="inputRole" placeholder="Role" disabled 
            value={userInfoFormik.values.inputRole || ''} onChange={userInfoFormik.handleChange} />
          </div>
        </div>


        <div className="form-group row">
          <div className="offset-sm-2 col-sm-10">
            <button type="submit" className="btn btn-danger">Cập nhật</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default TabUpdateInfo;
