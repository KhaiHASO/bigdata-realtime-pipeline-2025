import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 animate-\[fadein_0.25s_ease\]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

