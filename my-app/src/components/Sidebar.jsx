import { Menu, Typography, Avatar, Space } from "antd";
import {
    TeamOutlined,
    UserOutlined,
    ProjectOutlined,
    CheckSquareOutlined,
    DashboardOutlined,
    AppstoreOutlined
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Text, Title } = Typography;

export default function Sidebar({ onNavigate }) {
    const { user } = useAuth();
    const location = useLocation();

    const getSelectedKey = () => {
        const path = location.pathname;
        if (path.includes('tasks') || path === '/') return '1';
        if (path.includes('employees')) return '2';
        if (path.includes('contractors')) return '3';
        if (path.includes('customer')) return '4';
        return '1';
    };

    const handleMenuClick = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    const menuItems = [
        {
            key: 'main',
            label: <Text style={{ color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>MAIN MENU</Text>,
            type: 'group',
            children: [
                {
                    key: '1',
                    icon: <CheckSquareOutlined style={{ fontSize: 18 }} />,
                    label: <Link to="/tasks" style={{ fontSize: 14 }} onClick={handleMenuClick}>Tasks</Link>,
                },
                {
                    key: '2',
                    icon: <TeamOutlined style={{ fontSize: 18 }} />,
                    label: <Link to="/employees" style={{ fontSize: 14 }} onClick={handleMenuClick}>Employees</Link>,
                },
                {
                    key: '3',
                    icon: <UserOutlined style={{ fontSize: 18 }} />,
                    label: <Link to="/contractors" style={{ fontSize: 14 }} onClick={handleMenuClick}>Contractors</Link>,
                },
                {
                    key: '4',
                    icon: <ProjectOutlined style={{ fontSize: 18 }} />,
                    label: <Link to="/customer" style={{ fontSize: 14 }} onClick={handleMenuClick}>Customers</Link>,
                },
            ],
        },
    ];

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0f172a',
        }}>
            {/* Logo Section */}
            <div style={{
                padding: '24px 20px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
                    }}>
                        <AppstoreOutlined style={{ fontSize: 20, color: '#fff' }} />
                    </div>
                    <div>
                        <Title level={5} style={{
                            color: '#f8fafc',
                            margin: 0,
                            fontSize: 16,
                            fontWeight: 600,
                            letterSpacing: '-0.01em',
                        }}>
                            TaskFlow Pro
                        </Title>
                        <Text style={{
                            color: '#64748b',
                            fontSize: 11,
                            fontWeight: 500,
                        }}>
                            Management System
                        </Text>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
                <Menu
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    style={{
                        background: 'transparent',
                        border: 'none',
                    }}
                    items={menuItems}
                    theme="dark"
                />
            </div>

            {/* User Profile Section */}
            <div style={{
                padding: '16px 20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.02)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                }}>
                    <Avatar
                        style={{
                            backgroundColor: '#2563eb',
                            fontWeight: 600,
                            fontSize: 14,
                        }}
                        size={36}
                    >
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{
                            color: '#f8fafc',
                            fontSize: 13,
                            fontWeight: 500,
                            display: 'block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {user?.username || 'User'}
                        </Text>
                        <Text style={{
                            color: '#64748b',
                            fontSize: 11,
                            display: 'block',
                            textTransform: 'capitalize',
                        }}>
                            {user?.role || 'Role'}
                        </Text>
                    </div>
                    <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
                    }} />
                </div>
            </div>
        </div>
    );
}
