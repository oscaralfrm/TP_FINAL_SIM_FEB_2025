import React from 'react';

const ManejoErrores = ({ mensaje, onClose }) => {
    if (!mensaje) return null;

    return (
        <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <strong>¡Atención!</strong> {mensaje}
            <button 
                type="button" 
                className="btn-close" 
                aria-label="Close" 
                onClick={onClose}
            ></button>
        </div>
    );
};

export default ManejoErrores;