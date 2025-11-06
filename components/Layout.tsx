import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { APP_NAME, APP_AUTHORS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import PlantCareLogo from './PlantCareLogo';

interface NavItem {
  path: string;
  translationKey: string; 
  icon: React.ReactNode;
}

// Icons (ScanIcon, BookIcon, etc. remain, LeafIcon is replaced by image)
const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
  </svg>
);//hi
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503-6.998l4.875-2.172a.75.75 0 01.921.921l-2.172 4.875M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);
const CloudIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
  </svg>
);
const HistoryIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const UsersIcon = () => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM12.75 9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);
const FarmerConnectIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.122 2.122l7.81-7.81a1.5 1.5 0 00-2.122-2.122zM12 12l9 3m-9-3l-9 3" />
  </svg>
);


const navItems: NavItem[] = [
  { path: '/', translationKey: 'navHome', icon: <HomeIcon /> },
  { path: '/scan', translationKey: 'navPlantScan', icon: <ScanIcon /> },
  { path: '/encyclopedia', translationKey: 'navEncyclopedia', icon: <BookIcon /> },
  { path: '/crop-insights', translationKey: 'navCropInsights', icon: <MapIcon /> },
  { path: '/history', translationKey: 'navScanHistory', icon: <HistoryIcon /> },
  { path: '/community', translationKey: 'navCommunityHub', icon: <UsersIcon /> },
  { path: '/farmer-connect', translationKey: 'navFarmerConnect', icon: <FarmerConnectIcon /> },
];

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-green-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-emerald-600 via-emerald-700 to-emerald-800 shadow-xl text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col md:w-64`}>
        <div className="p-6 flex items-center space-x-3 border-b border-emerald-700/40">
          <PlantCareLogo size={40} />
          <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow">{translate(APP_NAME)}</h1>
        </div>
        <nav className="mt-4 flex-grow overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.translationKey}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 my-1 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'hover:bg-white/10 hover:text-emerald-100 text-white'
                }`
              }
            >
              <span className="w-6 h-6 text-emerald-100">{item.icon}</span>
              <span>{translate(item.translationKey)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-emerald-700/40 bg-emerald-800/60">
          <LanguageSwitcher />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="md:hidden bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-2">
             <PlantCareLogo size={32} />
             <h1 className="text-xl font-bold tracking-tight text-white drop-shadow">{translate(APP_NAME)}</h1>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white focus:outline-none p-2" aria-label={sidebarOpen ? "Close menu" : "Open menu"}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-green-50 p-4 sm:p-6">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white text-center p-4 text-sm font-medium shadow-lg">
           {translate('footerText', { authors: APP_AUTHORS })} &copy; {new Date().getFullYear()}
        </footer>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;
