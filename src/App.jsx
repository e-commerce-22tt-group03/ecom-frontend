import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { validateToken } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  // Initialize authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated) {
      dispatch(validateToken());
    }
  }, [dispatch, isAuthenticated]);

  // We can set a default theme here for the entire application
  return (
    <div data-theme="bumblebee" className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App;
// This is the main App component that sets up the layout and routes for the application.