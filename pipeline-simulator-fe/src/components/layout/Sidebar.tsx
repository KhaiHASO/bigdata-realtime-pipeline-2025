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
      "bg-card border-r border-border transition-all duration-300 h-screen sticky top-0",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Mô Phỏng Pipeline</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-accent rounded-md"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent"
              )}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

