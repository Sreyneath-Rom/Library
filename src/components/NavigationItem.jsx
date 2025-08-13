import { Link, useLocation } from 'react-router-dom';

const NavigationItem = ({ item, isIcon }) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;

  return (
    <Link
      to={item.path}
      aria-label={item.label || item.icon}
      className={`flex items-center gap-2 px-3 py-2 border-b-2 border-transparent transition-all duration-300 ${
        isActive
          ? 'border-yellow-600 text-yellow-600 font-semibold'
          : 'hover:border-yellow-600 hover:text-sky-500 text-sky-600'
      }`}
    >
      <span
        className={`material-symbols-outlined transition-colors duration-300 ${
          isActive ? 'text-yellow-600' : 'text-sky-600'
        }`}
      >
        {item.icon}
      </span>
      {!isIcon && <span>{item.label}</span>}
    </Link>
  );
};

export default NavigationItem;