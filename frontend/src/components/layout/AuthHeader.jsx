import { Link, useLocation } from 'react-router-dom';

const AuthHeader = () => {
    const location = useLocation();

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">
                    ZenChat
                </h1>

                {/* <div className="space-x-4 ">
                    {location.pathname !== '/login' && (
                        <Link
                            to="/login"
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                            Login
                        </Link>
                    )}
                    {location.pathname !== '/register' && (
                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                            Register
                        </Link>
                    )}
                </div> */}
            </div>
        </header>
    );
};

export default AuthHeader;
