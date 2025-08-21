import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { validateToken } from './features/auth/authSlice';
import AppRoutes from './routes/AppRoutes';
import { ensureGuestSession, fetchCart } from './features/cart/cartSlice';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Initialize authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated) {
      dispatch(validateToken());
    }
  }, [dispatch, isAuthenticated]);

  // Initialize session/cart for guests and users
  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem('authToken')) {
        await dispatch(ensureGuestSession());
      }
      await dispatch(fetchCart());
    };
    init();
  }, [dispatch, isAuthenticated]);

  // We can set a default theme here for the entire application
  return (
    <div className="min-h-screen flex flex-col bg-base-200">
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