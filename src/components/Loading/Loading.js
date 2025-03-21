import React from 'react';
import { BounceLoader } from 'react-spinners';
import './Loading.css';

const Loading = () => {
    return (
       <div className="loading-component">
            <BounceLoader size={48} loading cssOverride={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)"
             }} />
       </div>
    )
}

export default Loading;
