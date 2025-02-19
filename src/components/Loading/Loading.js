import React from 'react';
import { BounceLoader } from 'react-spinners';
import './Loading.css';

const Loading = () => {
    return (
       <div className="loading-component">
            <BounceLoader size={48} loading css={{ top: '32%', left: '48%' }} />
       </div>
    )
}

export default Loading;
