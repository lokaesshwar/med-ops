import React from 'react';
import { Layout, Avatar, Badge, Dropdown, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { Header: AntHeader } = Layout;

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MedOps
        </h1>
      </div>

      <Space size="large">
        <Badge count={3} size="small">
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '18px' }} />}
            style={{ fontSize: '18px' }}
          />
        </Badge>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }}>
            <Avatar
              size={36}
              icon={<UserOutlined />}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontWeight: 500, fontSize: '14px' }}>{user?.name}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', textTransform: 'capitalize' }}>
                {user?.role}
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
