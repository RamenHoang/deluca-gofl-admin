import React, { useEffect } from 'react';
import user2 from '../../assets/img/user2-160x160.jpg';

const TabUpdateAvatar = ({ dataUser }) => {

  useEffect(() => {
    console.log(dataUser);
  }, [dataUser]);

  return (
    <div className="card card-primary card-outline">
      <div className="card-body box-profile">
        <div className="text-center">
          <img className="profile-user-img img-fluid img-circle" src={user2} alt="User" />
        </div>
        <h3 className="profile-username text-center">{dataUser.username}</h3>
        <p className="text-muted text-center">Developer</p>
      </div>
    </div>
  )
}

export default TabUpdateAvatar;
