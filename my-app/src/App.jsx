import { useState } from "react";
import { Layout, Input, Badge, Avatar, Dropdown, Space, Typography, Breadcrumb, Drawer } from "antd";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import {
    SearchOutlined,
    BellOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    QuestionCircleOutlined,
    MenuOutlined,
    CloseOutlined
} from "@ant-design/icons";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeePage from "./pages/EmployeePage";
import ContractorPage from "./pages/ContractorPage";
import CustomerPage from "./pages/CustomerPage";
import TaskPage from "./pages/TaskPage";

const { Header, Content } = Layout;
const { Text } = Typography;

function AppHeader({ onMenuClick }) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('employees')) return 'Employees';
        if (path.includes('contractors')) return 'Contractors';
        if (path.includes('customer')) return 'Customers';
        if (path.includes('tasks') || path === '/') return 'Tasks';
        return 'Dashboard';
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'My Profile',
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
            key: 'help',
            icon: <QuestionCircleOutlined />,
            label: 'Help & Support',
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: logout,
        },
    ];

    return (
        <Header
            className="app-header"
            style={{
                background: '#ffffff',
                padding: '0 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e2e8f0',
                height: 64,
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                >
                    <MenuOutlined style={{ fontSize: 18, color: '#64748b' }} />
                </button>

                <Text style={{
                    fontSize: 20,
                    fontWeight: 600,
                    color: '#1e293b',
                    margin: 0
                }}>
                    {getPageTitle()}
                </Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Input
                    className="header-search"
                    placeholder="Search..."
                    prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                    style={{
                        width: 280,
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                    }}
                />

                <Badge count={3} size="small" offset={[-2, 2]}>
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: '#f8fafc',
                    }}>
                        <BellOutlined style={{ fontSize: 18, color: '#64748b' }} />
                    </div>
                </Badge>

                <Dropdown
                    menu={{ items: userMenuItems }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '6px 12px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginLeft: 8,
                        background: '#f8fafc',
                    }}>
                        <Avatar
                            style={{
                                backgroundColor: '#2563eb',
                                fontWeight: 500,
                            }}
                            size={32}
                        >
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <div className="header-user-info" style={{ lineHeight: 1.3 }}>
                            <Text style={{
                                display: 'block',
                                fontWeight: 500,
                                fontSize: 13,
                                color: '#1e293b'
                            }}>
                                {user?.username || 'User'}
                            </Text>
                            <Text style={{
                                display: 'block',
                                fontSize: 11,
                                color: '#64748b',
                                textTransform: 'capitalize'
                            }}>
                                {user?.role || 'Role'}
                            </Text>
                        </div>
                    </div>
                </Dropdown>
            </div>
        </Header>
    );
}

function MainLayout() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Desktop Sidebar */}
            <Layout.Sider
                width={260}
                style={{
                    background: '#0f172a',
                    borderRight: 'none',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    overflow: 'auto',
                    boxShadow: '4px 0 6px -1px rgb(0 0 0 / 0.1)',
                }}
            >
                <Sidebar />
            </Layout.Sider>

            {/* Mobile Sidebar Drawer */}
            <Drawer
                placement="left"
                onClose={closeMobileMenu}
                open={mobileMenuOpen}
                width={280}
                className="sidebar-drawer"
                styles={{ body: { padding: 0 } }}
            >
                <div style={{ position: 'relative', height: '100%' }}>
                    <button
                        className="mobile-sidebar-close"
                        onClick={closeMobileMenu}
                        aria-label="Close menu"
                        style={{ display: 'flex' }}
                    >
                        <CloseOutlined style={{ fontSize: 14 }} />
                    </button>
                    <Sidebar onNavigate={closeMobileMenu} />
                </div>
            </Drawer>

            <Layout className="main-layout" style={{ marginLeft: 260, background: '#f8fafc' }}>
                <AppHeader onMenuClick={toggleMobileMenu} />
                <Content
                    className="main-content"
                    style={{
                        padding: "24px 32px",
                        minHeight: 'calc(100vh - 64px)',
                        overflow: 'auto',
                    }}>
                    <Routes>
                        <Route path="/employees" element={<EmployeePage />} />
                        <Route path="/contractors" element={<ContractorPage />} />
                        <Route path="/customer" element={<CustomerPage />} />
                        <Route path="/tasks" element={<TaskPage />} />
                        <Route path="/" element={<TaskPage />} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
