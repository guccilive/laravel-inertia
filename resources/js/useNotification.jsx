import { useEffect, useRef } from 'react';
import NotificationContainer from './NotificationContainer';

const useNotification = (success) => {
    const notificationRef = useRef(null);

    useEffect(() => {
        if (success && notificationRef.current) {
            notificationRef.current(success, 'success');
        }
    }, [success]);

    return notificationRef;
};

export default useNotification;
