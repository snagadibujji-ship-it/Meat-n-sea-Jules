import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Dashboard = () => <div className="p-4 text-brand-yellow text-2xl font-bold">Vendor Dashboard</div>;
const Login = () => <div className="p-4">Login Page</div>;
const Inventory = () => <div className="p-4">Inventory</div>;
const Orders = () => <div className="p-4">Orders</div>;
const Analytics = () => <div className="p-4">Analytics</div>;
const Earnings = () => <div className="p-4">Earnings</div>;
const Payouts = () => <div className="p-4">Payouts</div>;
const Marketing = () => <div className="p-4">Marketing</div>;
const Reviews = () => <div className="p-4">Reviews</div>;
const Settings = () => <div className="p-4">Settings</div>;

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col">
        <header className="bg-surface p-4 flex justify-between items-center border-b border-gray-800">
          <div className="text-xl font-bold">
            <span className="text-brand-yellow">Meat n</span>{' '}
            <span className="text-brand-blue">Sea</span>{' '}
            <span className="text-gray-400 text-sm ml-2">Vendor</span>
          </div>
          <nav className="flex gap-4">
            <a href="/" className="hover:text-brand-red">Dashboard</a>
            <a href="/login" className="hover:text-brand-red">Login</a>
          </nav>
        </header>
        <div className="flex flex-1">
          <aside className="w-64 bg-surface border-r border-gray-800 p-4">
            <nav className="flex flex-col gap-2">
              <a href="/" className="hover:text-brand-red">Dashboard</a>
              <a href="/inventory" className="hover:text-brand-red">Inventory</a>
              <a href="/orders" className="hover:text-brand-red">Orders</a>
              <a href="/analytics" className="hover:text-brand-red">Analytics</a>
              <a href="/earnings" className="hover:text-brand-red">Earnings</a>
              <a href="/payouts" className="hover:text-brand-red">Payouts</a>
              <a href="/marketing" className="hover:text-brand-red">Marketing</a>
              <a href="/reviews" className="hover:text-brand-red">Reviews</a>
              <a href="/settings" className="hover:text-brand-red">Settings</a>
            </nav>
          </aside>
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/earnings" element={<Earnings />} />
              <Route path="/payouts" element={<Payouts />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
