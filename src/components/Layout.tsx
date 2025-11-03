import React from 'react';
import { Layout as AntLayout } from 'antd';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const { Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <AntLayout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Sidebar />
      <AntLayout style={{ marginLeft: 256 }}>
        <Header />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#f0f2f5',
          }}
        >
          <div className="fade-in">{children}</div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
