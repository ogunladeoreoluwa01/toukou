import { useState, useEffect } from 'react';

const useFetchData = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchData;
// how to use 
// import React, { useEffect, useState } from 'react';
// import useFetchData from './useFetchData';

// const DataFetchingComponent = () => {
//     const { data, loading, error } = useFetchData('https://api.example.com/data');
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         if (!loading) {
//             setIsLoading(false);
//         }
//     }, [loading]);

//     if (isLoading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>Error: {error.message}</p>;
//     }

//     return (
//         <div>
//             <h1>Fetched Data</h1>
//             <ul>
//                 {data.map((item, index) => (
//                     <li key={index}>{item.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default DataFetchingComponent;

