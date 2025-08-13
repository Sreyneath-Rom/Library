import { useState } from 'react';
import { Link } from 'react-router-dom';
import { navItems, navItemsRight } from '../config/NavConfig';
import NavigationItem from './NavigationItem';
import Notifications from './Notification';

const Navigation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className="w-full bg-white shadow-md sticky top-0 z-50"
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
            onClick={closeMenu}
          >
            <span className="material-symbols-outlined text-3xl text-yellow-600">menu_book</span>
            <span className="text-2xl font-bold text-yellow-600">Library</span>
          </Link>
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-400">search</span>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search..."
              className="w-full sm:w-60 lg:w-50 pl-10 pr-10 py-1 border border-sky-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 cursor-pointer hover:text-sky-600">mic</span>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="hidden md:flex items-center gap-4 ml-20">
            {navItems.map(item => (
              <NavigationItem key={item.label} item={item} onClick={closeMenu} />
            ))}
          </div>
          <div className="relative">
            <span
              className="material-symbols-outlined text-sky-500 hover:text-sky-600 cursor-pointer relative"
              onClick={toggleNotifications}
              role="button"
              tabIndex={0}
              aria-expanded={showNotifications}
              aria-label="Toggle notifications"
            >
              notifications
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                3
              </span>
            </span>
            {showNotifications && (
              <Notifications className="absolute right-0 top-10 z-50" />
            )}
          </div>
          <button
            className="md:hidden text-sky-500 hover:text-sky-600"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden px-4 pb-4 space-y-4 transition-all duration-300"
        >
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sky-400">search</span>
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-10 py-1 border border-sky-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 cursor-pointer hover:text-sky-600">mic</span>
          </div>
          <div className="flex flex-col gap-2">
            {navItems.map(item => (
              <NavigationItem key={item.label} item={item} onClick={closeMenu} />
            ))}
          </div>
          <div className="flex gap-4">
            {navItemsRight.map(item => (
              <NavigationItem key={item.icon} item={item} isIcon onClick={closeMenu} />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;