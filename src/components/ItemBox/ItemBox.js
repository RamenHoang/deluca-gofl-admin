import React from 'react';

const ItemBox = (props) => {
  return (
    <div className="col-12 col-sm-6 col-md-3">
      <div className="info-box">
        <span className={`info-box-icon bg-${props.color} elevation-1`}><i className={props.icon}></i></span>
        <div className="info-box-content">
          <span className="info-box-text">{ props.title }</span>
          <span className="info-box-number">
            {props.count}
            { props.detail }
          </span>
        </div>
      </div>
    </div>
  )
}

export default ItemBox;
