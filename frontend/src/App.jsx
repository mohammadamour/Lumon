import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import useAuthStore from './store/useAuthStore';

// Placeholder Pages
const Home = () => <div className="text-center py-20"><h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to BagistoClone</h1><p className="text-lg text-slate-600">Discover premium products at unbeatable prices.</p></div>;
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
