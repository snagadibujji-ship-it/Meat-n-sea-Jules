import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Home = () => <div className="p-4 text-brand-yellow text-2xl font-bold">Home Page</div>;
const Login = () => <div className="p-4">Login Page</div>;
const Categories = () => <div className="p-4">Categories</div>;
const Cart = () => <div className="p-4">Cart</div>;
const Profile = () => <div className="p-4">Profile</div>;
const Checkout = () => <div className="p-4">Checkout</div>;
const Orders = () => <div className="p-4">Orders</div>;

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <header className="bg-surface p-4 flex justify-between items-center border-b border-gray-800">
          <div className="text-xl font-bold">
            <span className="text-brand-yellow">Meat n</span>{' '}
            <span className="text-brand-blue">Sea</span>
          </div>
          <nav className="flex gap-4">
            <a href="/" className="hover:text-brand-red">Home</a>
            <a href="/cart" className="hover:text-brand-red">Cart</a>
            <a href="/login" className="hover:text-brand-red">Login</a>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
