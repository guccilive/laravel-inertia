import React, { useState, useCallback, useRef, useEffect, forwardRef } from 'react';
import Notification from '@/Components/Notification';

const NotificationContainer = forwardRef((props, ref) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setNotifications(prevNotifications => [
            ...prevNotifications,
            { id, message, type, duration }
        ]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prevNotifications => 
            prevNotifications.filter(notification => notification.id !== id)
        );
    }, []);

    useEffect(() => {
        if (ref) {
            ref.current = addNotification;
        }
    }, [addNotification, ref]);

    return (
        <div className="fixed top-0 right-0 p-4 w-full max-w-xs">
            {notifications.map(notification => (
                <Notification 
                    key={notification.id} 
                    message={notification.message} 
                    type={notification.type} 
                    duration={notification.duration}
                    onClose={() => removeNotification(notification.id)} 
                />
            ))}
        </div>
    );
});

export default NotificationContainer;
