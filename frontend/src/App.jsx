import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import useAuthStore from './store/useAuthStore';

import Home from './pages/Home';

const Shop = () => <div className="text-2xl font-semibold">Shop Page (Coming Soon)</div>;
const Login = () => <div className="text-2xl font-semibold">Login Page (Coming Soon)</div>;
const Register = () => <div className="text-2xl font-semibold">Register Page (Coming Soon)</div>;
const Cart = () => <div className="text-2xl font-semibold">Cart (Coming Soon)</div>;

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
