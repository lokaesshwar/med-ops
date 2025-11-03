import React, { useState } from 'react';
import { Button, Table, Space, Typography, Tag, Select, Card, Radio, Avatar } from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  VideoCameraOutlined,
  PhoneOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useData } from '../contexts/DataContext';
import { Appointment, AppointmentStatus } from '../types';
import { format } from 'date-fns';
import { AppointmentModal } from '../components/AppointmentModal';
import { AppointmentCalendar } from '../components/AppointmentCalendar';
import toast from 'react-hot-toast';

const { Title } = Typography;
const { Option } = Select;

export function Appointments() {
  const { appointments, updateAppointment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    updateAppointment(appointmentId, { status: newStatus });
    toast.success('Appointment status updated');
  };

  const getStatusConfig = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return { color: 'gold', label: 'Scheduled' };
      case AppointmentStatus.CONFIRMED:
        return { color: 'green', label: 'Confirmed' };
      case AppointmentStatus.COMPLETED:
        return { color: 'blue', label: 'Completed' };
      case AppointmentStatus.CANCELLED:
        return { color: 'red', label: 'Cancelled' };
      default:
        return { color: 'default', label: 'Unknown' };
    }
  };

  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const columns: ColumnsType<Appointment> = [
    {
      title: 'Patient',
      key: 'patient',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.patientName}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Doctor',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: 'Date & Time',
      key: 'date',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <CalendarOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            {format(new Date(record.date), 'MMM d, yyyy')}
          </div>
          <div>
            <ClockCircleOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
            {format(new Date(record.date), 'h:mm a')} ({record.duration}min)
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <div>
          {type === 'Telemedicine' ? (
            <>
              <VideoCameraOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
              {type}
            </>
          ) : (
            <>
              <PhoneOutlined style={{ marginRight: '4px', color: '#8c8c8c' }} />
              {type}
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus, record) => {
        const config = getStatusConfig(status);
        return (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record.id, value)}
            style={{ width: 120 }}
            size="small"
          >
            <Option value={AppointmentStatus.SCHEDULED}>
              <Tag color="gold">Scheduled</Tag>
            </Option>
            <Option value={AppointmentStatus.CONFIRMED}>
              <Tag color="green">Confirmed</Tag>
            </Option>
            <Option value={AppointmentStatus.COMPLETED}>
              <Tag color="blue">Completed</Tag>
            </Option>
            <Option value={AppointmentStatus.CANCELLED}>
              <Tag color="red">Cancelled</Tag>
            </Option>
          </Select>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEditAppointment(record)}
          size="small"
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          Appointments
        </Title>
        <Space>
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="list">List</Radio.Button>
            <Radio.Button value="calendar">Calendar</Radio.Button>
          </Radio.Group>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            size="large"
          >
            Book Appointment
          </Button>
        </Space>
      </div>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar appointments={appointments} onEditAppointment={handleEditAppointment} />
      ) : (
        <Card className="medops-card">
          <Table
            columns={columns}
            dataSource={sortedAppointments}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} appointments`,
            }}
            style={{ borderRadius: '8px' }}
          />
        </Card>
      )}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={editingAppointment}
      />
    </div>
  );
}
