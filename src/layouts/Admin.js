import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Admin = (props) => {
    
    return (
        <div className="wrapper">
           <Navbar />
           <Sidebar />
           {props.children}
        </div>
    )
}

export default Admin