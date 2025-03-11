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
                        <td> { v.product ? v.product.p_code : 'N/A' }</td>
                        <td> {v.product ? `${v.product.p_name} / ${v.variant.option_values[0].value} / ${v.variant.option_values[1].value}` : 'N/A'}</td>
                        <td> 
                          <img src={v.variant ? v.variant.image.url : ''} alt="product-detail" style={{ height: '50px' }} />  
                        </td>
                        <td> { v.product ? v.product.p_price : 'N/A' } VNĐ</td>
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
