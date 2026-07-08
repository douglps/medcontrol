import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Pill, Clock, Users } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Kanban', path: '/kanban', icon: CheckSquare },
    { name: 'Medicamentos', path: '/medications', icon: Pill },
    { name: 'Histórico', path: '/history', icon: Clock },
    { name: 'Pacientes', path: '/patients', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <Pill className="text-accent" />
          MedControl
        </h1>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Médico Dr(a).</p>
            <p className="text-xs text-gray-500">CRM 12345</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
