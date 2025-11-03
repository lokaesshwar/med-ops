import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Alert } from 'antd';
import { MailOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

export function Login() {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const { user, login, loading } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError('');
    try {
      const success = await login(values.email, values.password);
      if (success) {
        toast.success('Welcome to MedOps!');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Card
        style={{
          maxWidth: 420,
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        className="glass-effect"
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <MedicineBoxOutlined
              style={{
                fontSize: '48px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '16px',
              }}
            />
            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
              MedOps
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Hospital Management System
            </Text>
          </div>

          {error && (
            <Alert message={error} type="error" showIcon closable onClose={() => setError('')} />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email Address"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{
                  height: '44px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '16px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
              Demo Accounts:
            </Text>
            <Space direction="vertical" size={2} style={{ width: '100%' }}>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>Doctor: doctor@medops.com</Text>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>Nurse: nurse@medops.com</Text>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>Admin: admin@medops.com</Text>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>Patient: patient@medops.com</Text>
              <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>Password: any</Text>
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  );
}
