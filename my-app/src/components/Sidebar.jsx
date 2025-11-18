import { Menu, Typography, Space, Button } from "antd";
import { TeamOutlined, UserOutlined, ProjectOutlined, CheckSquareOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const { Text } = Typography;

export default function Sidebar() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #434343' }}>
                <Text style={{ color: '#fff', fontSize: '14px' }}>
                    Welcome, {user?.username}
                </Text>
                <br />
                <Text style={{ color: '#bfbfbf', fontSize: '12px' }}>
                    Role: {user?.role}
                </Text>
            </div>
            
            <Menu theme="dark" mode="inline" style={{ flex: 1, borderRight: 0 }}>
                <Menu.Item key="1" icon={<CheckSquareOutlined />}>
                    <Link to="/tasks">Tasks</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<TeamOutlined />}>
                    <Link to="/employees">Employees</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<UserOutlined />}>
                    <Link to="/contractors">Contractors</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<ProjectOutlined />}>
                    <Link to="/customer">Customer</Link>
                </Menu.Item>
            </Menu>
            
            <div style={{ padding: '16px', borderTop: '1px solid #434343' }}>
                <Button 
                    type="text" 
                    icon={<LogoutOutlined />} 
                    onClick={handleLogout}
                    style={{ color: '#fff', width: '100%', textAlign: 'left' }}
                >
                    Logout
                </Button>
            </div>
        </div>
    );
}
