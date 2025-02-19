import React, { useState } from 'react';
import Loading from '../components/Loading/Loading';

const useFullPageLoader = () => {
    const [loading, setLoading] = useState(false);

    return [
        loading ? <Loading /> : null,
        () => setLoading(true), //Show loading
        () => setLoading(false) //hide loadin
    ]
}

export default useFullPageLoader
