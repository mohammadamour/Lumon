import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import useAuthStore from './store/useAuthStore';

import Home from './pages/Home';

// Placeholder pages — will be built in later phases
const Shop     = () => <div className="container-main py-16 text-h3 text-dark">Shop — Coming Soon</div>;
const Login    = () => <div className="container-main py-16 text-h3 text-dark">Login — Coming Soon</div>;
const Register = () => <div className="container-main py-16 text-h3 text-dark">Register — Coming Soon</div>;
const Cart     = () => <div className="container-main py-16 text-h3 text-dark">Cart — Coming Soon</div>;

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Shop />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
