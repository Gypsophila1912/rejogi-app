import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { RegisterPage } from './pages/RegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { DiscountPage } from './pages/DiscountPage';

function App() {
  return (
    <Router>
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <Link to="/">レジ画面(ホーム)</Link>
          <Link to="/checkout">会計画面</Link>
          <Link to="/discount">割引券ページ</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/discount" element={<DiscountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
