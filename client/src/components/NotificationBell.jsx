import { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useSocket();

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handler = (data) => {
      setNotifications((prev) => [data, ...prev].slice(0, 20));
      setUnreadCount((c) => c + 1);
    };

    socket.on('notification', handler);
    return () => socket.off('notification', handler);
  }, [socketRef]);

  const handleToggle = () => {
    setIsOpen((v) => !v);
    if (!isOpen) setUnreadCount(0);
  };

  return (
    <div className="notification-bell">
      <button className="bell-btn" onClick={handleToggle} title="Notifications">
        🔔
        {unreadCount > 0 && (
          <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <strong>Notifications</strong>
          </div>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications yet</p>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="notification-item">
                <p className="notification-message">{n.message}</p>
                <small className="notification-time">
                  {new Date(n.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
