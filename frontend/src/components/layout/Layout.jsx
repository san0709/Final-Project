import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    const location = useLocation();

    const hideNavbar =
        location.pathname === '/login' ||
        location.pathname === '/register';

    return (
        <div className="min-h-screen bg-slate-50">
            {!hideNavbar && <Navbar />}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
