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
      "glass transition-all duration-300 h-screen sticky top-0 shadow-glass rounded-r-3xl m-3",
      isCollapsed ? "w-16" : "w-[240px]"
    )}>
      <div className="p-5 border-b border-white/30 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-[#0A0A0A] tracking-tight">Mô Phỏng Pipeline</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/30 rounded-xl transition-all duration-300 active:scale-95"
        >
          {isCollapsed ? <Menu size={20} className="text-[#0A0A0A]" /> : <X size={20} className="text-[#0A0A0A]" />}
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
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-[#0A0A0A] font-medium tracking-tight",
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

