import React from 'react';
import './ModalComponent.css'; // Import your CSS file for ModalComponent styling

const ModalComponent = ({ children }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
};

export default ModalComponent;
