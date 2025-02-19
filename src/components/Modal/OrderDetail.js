import React, { useEffect, useState } from 'react';

const OrderDetail = (props) => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    if (props.data) {
      setProducts(props.data.products);
    }
  }, [props.data]);
  
  return (
    <div className="modal fade" id="modalOrderDetail" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Chi tiết đơn hàng</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="modal-body">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((v, i) => {
                    return (
                      <tr key={i}>
                        <td> { i } </td>
                        <td> { v.product.p_code }</td>
                        <td> { v.product.p_name } </td>
                        <td> 
                          <img src={v.product.p_image_detail.url} alt="product-detail" style={{ height: '50px' }} />  
                        </td>
                        <td> { v.product.p_price } VNĐ</td>
                        <td> { v.quantity }</td>
                        <td> { v.price } VNĐ</td>
                      </tr>
                    )
                  })
                }
              </tbody>
              <tfoot>
                <tr>
                  <th>STT</th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail;
