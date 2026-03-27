import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { QueuePage } from './pages/QueuePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProductManagementPage } from './pages/admin/ProductManagementPage';
import { InvitePage } from './pages/InvitePage';
import { NicknamePage } from './pages/NicknamePage';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { AppAdminLoginPage } from './pages/app-admin/AppAdminLoginPage';
import { AppAdminCallbackPage } from './pages/app-admin/AppAdminCallbackPage';
import { AppAdminDashboardPage } from './pages/app-admin/AppAdminDashboardPage';
import { CircleListPage } from './pages/app-admin/CircleListPage';
import { CircleNewPage } from './pages/app-admin/CircleNewPage';
import { CircleDetailPage } from './pages/app-admin/CircleDetailPage';
import { MemberListPage } from './pages/app-admin/MemberListPage';
import { AppAdminGuard } from './components/AppAdminGuard';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000')
      .then((res) => res.text())
      .then((data) => {
        setMessage(data);
      });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div>
          {/* 既存のAPI疎通確認 */}
          <div
            style={{
              backgroundColor: '#e2e8f0',
              padding: '10px',
              marginBottom: '10px',
              fontSize: '14px',
            }}
          >
            <strong>API Response:</strong> {message || 'Loading...'}
          </div>
          {/* ナビゲーション（モック確認用） */}
          <div
            style={{
              padding: '10px',
              backgroundColor: '#f0f0f0',
              marginBottom: '20px',
            }}
          >
            <nav style={{ display: 'flex', gap: '15px' }}>
              <Link to="/login">ログイン画面</Link>
              <Link to="/admin">ダッシュボード(管理)</Link>
              <span style={{ color: '#ccc' }}>|</span>
              <Link to="/">レジ画面(ホーム)</Link>
              <Link to="/checkout">会計画面</Link>
              <Link to="/queue">引換待機列</Link>
            </nav>
          </div>

          {/* 画面ルーティング */}
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/invite" element={<InvitePage />} />
            <Route path="/nickname" element={<NicknamePage />} />
            <Route path="/" element={<RegisterPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/queue" element={<QueuePage />} />
            <Route path="/success" element={<SuccessPage />} />

            {/* 管理者向け（要認証）のルート */}
            <Route element={<AuthGuard />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route
                path="/admin/products"
                element={<ProductManagementPage />}
              />
            </Route>

            {/* アプリ管理者向けのルート */}
            <Route path="/app-admin/login" element={<AppAdminLoginPage />} />
            <Route
              path="/app-admin/callback"
              element={<AppAdminCallbackPage />}
            />

            <Route element={<AppAdminGuard />}>
              <Route path="/app-admin" element={<AppAdminDashboardPage />} />
              <Route path="/app-admin/circles" element={<CircleListPage />} />
              <Route
                path="/app-admin/circles/new"
                element={<CircleNewPage />}
              />
              <Route
                path="/app-admin/circles/:circleId"
                element={<CircleDetailPage />}
              />
              <Route path="/app-admin/members" element={<MemberListPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
