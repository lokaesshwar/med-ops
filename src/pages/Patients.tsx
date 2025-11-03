import React, { useState } from 'react';
import { Button, Input, Table, Space, Typography, Popconfirm, Tag, Avatar, Card } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useData } from '../contexts/DataContext';
import { Patient } from '../types';
import { format } from 'date-fns';
import { PatientModal } from '../components/PatientModal';
import toast from 'react-hot-toast';

const { Title } = Typography;

export function Patients() {
  const { patients, deletePatient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    deletePatient(patient.id);
    toast.success('Patient deleted successfully');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const columns: ColumnsType<Patient> = [
    {
      title: 'Patient',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <MailOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            {record.email}
          </div>
          <div>
            <PhoneOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            {record.phone}
          </div>
        </div>
      ),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
          {format(new Date(date), 'MMM d, yyyy')}
        </div>
      ),
    },
    {
      title: 'Blood Type',
      dataIndex: 'bloodType',
      key: 'bloodType',
      render: (bloodType: string) => (
        <Tag color="red" style={{ fontWeight: 500 }}>
          {bloodType}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditPatient(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Patient"
            description={`Are you sure you want to delete ${record.name}?`}
            onConfirm={() => handleDeletePatient(record)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          Patients
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          size="large"
        >
          Add Patient
        </Button>
      </div>

      <Card className="medops-card">
        <div style={{ marginBottom: '16px' }}>
          <Input
            placeholder="Search patients by name or email..."
            prefix={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ borderRadius: '8px' }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} patients`,
          }}
          style={{ borderRadius: '8px' }}
        />
      </Card>

      <PatientModal isOpen={isModalOpen} onClose={handleCloseModal} patient={editingPatient} />
    </div>
  );
}
