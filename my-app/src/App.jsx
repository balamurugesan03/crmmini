import { Layout } from "antd";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeePage from "./pages/EmployeePage";
import ContractorPage from "./pages/ContractorPage";
import CustomerPage from "./pages/CustomerPage";
import TaskPage from "./pages/TaskPage";

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/*" element={
                        <ProtectedRoute>
                            <Layout style={{ minHeight: "100vh" }}>
                                <Layout.Sider>
                                    <Sidebar />
                                </Layout.Sider>
                                <Layout.Content style={{ padding: "20px" }}>
                                    <Routes>
                                        <Route path="/employees" element={<EmployeePage />} />
                                        <Route path="/contractors" element={<ContractorPage />} />
                                        <Route path="/customer" element={<CustomerPage />} />
                                        <Route path="/tasks" element={<TaskPage />} />
                                        <Route path="/" element={<TaskPage />} />
                                    </Routes>
                                </Layout.Content>
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
