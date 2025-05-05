import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthenAdmin from '../authentication/AuthenAdmin.component';
import NotificationChat from '../NotificationChat';
import useChatStore from '../../store/chatStore';

const AdminLayout = ({ children }) => {
  const initializeCustomers = useChatStore((state) => state.initializeCustomers);
  const location = useLocation();

  useEffect(() => {
    initializeCustomers();
  }, [initializeCustomers]);

  const shouldHideNotificationChat = location.pathname === '/admin/chat';
  
  return (
    <div>
      <AuthenAdmin />
      {!shouldHideNotificationChat && <NotificationChat />}
      {children}
    </div>
  );
};

export default AdminLayout;