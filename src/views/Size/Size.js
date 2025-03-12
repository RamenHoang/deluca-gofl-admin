/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import sizeAPI from './../../apis/sizeAPI';
import { successToast, errorToast } from './../../components/Toasts/Toasts';
import useFullPageLoader from './../../hooks/useFullPageLoader';
import { Modal, Button } from 'react-bootstrap';

const Size = () => {

  const [loader, showLoader, hideLoader] = useFullPageLoader();
  const [dataCate, setDataCate] = useState([]);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newSize, setNewSize] = useState(''); // updated variable name to newSize
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    showLoader();
    sizeAPI.getAll().then((res) => {
      setDataCate(res.data);
      hideLoader();
    }).catch((err) => {
      hideLoader();
      console.log(err);
    })
  }, []);

  let handleDeleteCate = (id) => {
    showLoader();
    sizeAPI.delete(id).then((res) => {
      if (res.data.message === 'CATEGORY_NOT_FOUND') {
        hideLoader();
        errorToast('Kích thước không tồn tại !');
      }
      if (res.data.message === 'SUCCESS') {
        let newDataCate = dataCate.filter(value => value._id !== id);
        setDataCate([...newDataCate]);
        hideLoader();
        successToast('Xóa Kích thước thành công !');
      }
      if (res.data.message === 'PARENT_EXISTS') {
        hideLoader();
        errorToast("Xóa Kích thước con trước !");
      }
    }).catch((err) => {
      hideLoader();
      errorToast('Có lỗi xảy ra, vui lòng thử lại');
    })
  }

  const handleCreateColor = () => {
    showLoader();
    sizeAPI.create({ name: newSize }).then((res) => {
      if (res.data.message === 'SUCCESS') {
        setDataCate([...dataCate, res.data]);
        successToast('Tạo Kích thước thành công !');
      } else {
        errorToast('Có lỗi xảy ra, vui lòng thử lại');
      }
      hideLoader();
      setShowModal(false);
      setNewSize(''); // updated variable name to newSize
    }).catch((err) => {
      hideLoader();
      errorToast('Có lỗi xảy ra, vui lòng thử lại');
    });
  };

  const handleEdit = (id, value) => {
    showLoader();
    sizeAPI.updateById(id, { name: value }).then((res) => {
      if (res.data.message === 'SUCCESS') {
        let updatedDataCate = dataCate.map(item => {
          if (item._id === id) {
            item.name = value; // updating to use the correct parameter
          }
          return item; // returning the correct item
        });
        setDataCate(updatedDataCate);
        hideLoader();
        successToast('Cập nhật Kích thước thành công !');
      } else {
        hideLoader();
        errorToast('Có lỗi xảy ra, vui lòng thử lại');
      }
    }).catch((err) => {
      hideLoader();
      errorToast('Có lỗi xảy ra, vui lòng thử lại');
    });
  };

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Kích thước sản phảm</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">
                    Trang chủ
                  </Link>
                </li>
                <li className="breadcrumb-item active">Kích thước</li>
              </ol>
            </div>
          </div>
        </div>{/* /.container-fluid */}
      </section>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">

              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <h3 className="card-title">
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                      <i className="fas fa-plus-circle"></i> Thêm Kích thước
                    </button>
                  </h3>

                  <div>
                    <form className="form-inline">
                      <input className="form-control mr-sm-2" type="search" placeholder="Nhập tên cần tìm kiếm...." aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                      <button className="btn btn-outline-primary my-2 my-sm-0 p-1" type="button">Tìm kiếm</button>
                    </form>
                  </div>
                </div>

                <div className="card-body">
                  <table id="example1" className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Kích thước</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>

                    <tbody>

                      {
                        dataCate.filter(val => query === '' || val.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ? val : '')
                          .map((v, i) => {
                            const editValue = editValues[v._id] || v.name;

                            return (
                              <tr key={i}>
                                <td>
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValues({ ...editValues, [v._id]: e.target.value })}
                                    onBlur={() => {
                                      if (editValue !== v.name) {
                                        handleEdit(v._id, editValue);
                                      }
                                    }}
                                    className="form-control"
                                    style={{ display: 'inline-block' }}
                                  />
                                </td>
                                <td>
                                  <button className="btn btn-danger" onClick={() => handleDeleteCate(v._id)}>
                                    <i className="fas fa-trash-alt mr-1"></i> Xóa
                                  </button>
                                </td>
                              </tr>
                            )
                          })
                      }

                    </tbody>
                    <tfoot>
                      <tr>
                        <th>Kích thước</th>
                        <th>Hành động</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loader}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton={false}>
          <Modal.Title>Thêm Kích thước</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Kích thước"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateColor}>
            Tạo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Size;
