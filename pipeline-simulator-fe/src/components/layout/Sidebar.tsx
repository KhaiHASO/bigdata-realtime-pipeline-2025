import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Zap, 
  Database, 
  BarChart3, 
  Info,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', label: 'Tổng Quan', icon: LayoutDashboard },
  { path: '/kafka', label: 'Giao Diện Kafka', icon: MessageSquare },
  { path: '/spark', label: 'Spark Streaming', icon: Zap },
  { path: '/mongodb', label: 'Bảng Điều Khiển MongoDB', icon: Database },
  { path: '/analytics', label: 'Phân Tích', icon: BarChart3 },
  { path: '/about', label: 'Giới Thiệu', icon: Info },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "bg-white/60 backdrop-blur-xl border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all duration-300 h-screen sticky top-0 rounded-r-3xl m-3",
      isCollapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="p-5 border-b border-white/30 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Mô Phỏng Pipeline</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/30 rounded-xl transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] active:scale-95"
        >
          {isCollapsed ? <Menu size={20} className="text-slate-900" /> : <X size={20} className="text-slate-900" />}
        </button>
      </div>
      <nav className="p-5 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)] text-slate-900 font-medium tracking-tight",
                isActive
                  ? "bg-white/50 border border-white/40 shadow-inner"
                  : "hover:bg-white/30 hover:translate-y-[-2px]"
              )}
            >
              <Icon size={20} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

