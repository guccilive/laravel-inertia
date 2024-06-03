import React, { useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const typeStyles = {
        info: 'bg-blue-100 border-blue-400 text-blue-700',
        success: 'bg-green-100 border-green-400 text-green-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        error: 'bg-red-100 border-red-400 text-red-700',
    };

    return (
        <div className={`flex items-center p-4 border-l-4 ${typeStyles[type]} mb-4`} role="alert">
            <div className="flex-1">
                <p>{message}</p>
            </div>
            <button 
                onClick={onClose} 
                className="ml-4 text-gray-500 hover:text-gray-900 focus:outline-none"
            >
                <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.36 5.652a.5.5 0 00-.707.707L9.293 10l-3.64 3.641a.5.5 0 00.707.707L10 10.707l3.641 3.641a.5.5 0 00.707-.707L10.707 10l3.641-3.641a.5.5 0 000-.707z"/>
                </svg>
            </button>
        </div>
    );
};

export default Notification;
