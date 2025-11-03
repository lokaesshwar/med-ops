import React from 'react';
import { Row, Col, Card, Statistic, Typography, List, Avatar, Tag, Empty } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  VideoCameraOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { TaskStatus, AppointmentStatus } from '../types';
import { format } from 'date-fns';

const { Title, Text } = Typography;

export function Dashboard() {
  const { tasks, patients, appointments } = useData();
  const { user } = useAuth();

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === TaskStatus.DONE).length,
    pending: tasks.filter((t) => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
  };

  const appointmentStats = {
    today: appointments.filter(
      (a) => format(new Date(a.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length,
    upcoming: appointments.filter(
      (a) => a.status === AppointmentStatus.SCHEDULED && new Date(a.date) > new Date()
    ).length,
    completed: appointments.filter((a) => a.status === AppointmentStatus.COMPLETED).length,
  };

  const upcomingAppointments = appointments
    .filter((a) => a.status === AppointmentStatus.SCHEDULED && new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentTasks = tasks
    .filter((t) => t.status !== TaskStatus.DONE)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      default:
        return 'green';
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          Welcome back, {user?.name}! 👋
        </Title>
        <Text type="secondary">{format(new Date(), 'EEEE, MMMM d, yyyy')}</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="medops-card" hoverable>
            <Statistic
              title="Total Patients"
              value={patients.length}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <Text type="success" style={{ fontSize: '14px' }}>
                  <ArrowUpOutlined /> Active
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="medops-card" hoverable>
            <Statistic
              title="Today's Appointments"
              value={appointmentStats.today}
              prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {appointmentStats.upcoming} upcoming
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="medops-card" hoverable>
            <Statistic
              title="Pending Tasks"
              value={taskStats.pending}
              prefix={<CheckSquareOutlined style={{ color: '#faad14' }} />}
              suffix={
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {taskStats.inProgress} in progress
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="medops-card" hoverable>
            <Statistic
              title="Telemedicine Sessions"
              value={0}
              prefix={<VideoCameraOutlined style={{ color: '#722ed1' }} />}
              suffix={<Text type="secondary" style={{ fontSize: '14px' }}>Available now</Text>}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarOutlined />
                <span>Upcoming Appointments</span>
              </div>
            }
            className="medops-card"
          >
            {upcomingAppointments.length === 0 ? (
              <Empty description="No upcoming appointments" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={upcomingAppointments}
                renderItem={(appointment) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<CalendarOutlined />}
                          style={{ backgroundColor: '#1890ff' }}
                        />
                      }
                      title={appointment.patientName}
                      description={
                        <div>
                          <ClockCircleOutlined style={{ marginRight: '4px' }} />
                          {format(new Date(appointment.date), 'MMM d, yyyy h:mm a')}
                        </div>
                      }
                    />
                    <div>
                      <Tag color="blue">{appointment.duration}min</Tag>
                    </div>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquareOutlined />
                <span>Recent Tasks</span>
              </div>
            }
            className="medops-card"
          >
            {recentTasks.length === 0 ? (
              <Empty description="No pending tasks" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <List
                dataSource={recentTasks}
                renderItem={(task) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<CheckSquareOutlined />}
                          style={{
                            backgroundColor:
                              task.priority === 'high'
                                ? '#ff4d4f'
                                : task.priority === 'medium'
                                ? '#faad14'
                                : '#52c41a',
                          }}
                        />
                      }
                      title={task.title}
                      description={
                        <div>
                          <ClockCircleOutlined style={{ marginRight: '4px' }} />
                          Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </div>
                      }
                    />
                    <Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
