import React from 'react';

const Spinner = () => {
    return (
        <div className="d-flex justify-content-center">
            <div className="d-flex">
                <div className="spinner-grow spinner-grow-sm me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow-sm me-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Spinner;