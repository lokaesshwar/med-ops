import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  CheckSquareOutlined,
  UserOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

interface MenuItemWithRoles extends MenuItem {
  roles?: UserRole[];
}

const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  roles?: UserRole[]
): MenuItemWithRoles => ({
  key,
  icon,
  children,
  label,
  roles,
});

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItemWithRoles[] = [
    getMenuItem(
      'Dashboard',
      '/',
      <DashboardOutlined />,
      undefined,
      [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN]
    ),
    getMenuItem(
      'Tasks',
      '/tasks',
      <CheckSquareOutlined />,
      undefined,
      [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN]
    ),
    getMenuItem(
      'Patients',
      '/patients',
      <UserOutlined />,
      undefined,
      [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN]
    ),
    getMenuItem(
      'Appointments',
      '/appointments',
      <CalendarOutlined />,
      undefined,
      [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.PATIENT]
    ),
    getMenuItem(
      'Telemedicine',
      '/telemedicine',
      <VideoCameraOutlined />,
      undefined,
      [UserRole.DOCTOR, UserRole.PATIENT]
    ),
  ];

  const filteredMenuItems = menuItems
    .filter((item) => !item.roles || (user?.role && item.roles.includes(user.role)))
    .map(({ roles, ...item }) => item);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key as string);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 24px',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        {collapsed ? (
          <MedicineBoxOutlined
            style={{
              fontSize: '24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MedicineBoxOutlined
              style={{
                fontSize: '24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            />
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              MedOps
            </span>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        onClick={handleMenuClick}
        style={{
          borderRight: 0,
          marginTop: '16px',
        }}
      />
    </Sider>
  );
}
