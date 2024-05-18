import React from 'react';

const ArrayMapper = ({ array, renderItem }) => {
    return (
        <>
            {array.map((item, index) => (
                <React.Fragment key={index}>
                    {renderItem(item, index)}
                </React.Fragment>
            ))}
        </>
    );
};

export default ArrayMapper;
