
import AppRoutes from './routes/AppRoutes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App(){
  // We can set a default theme here for the entire application
  return (
    <div data-theme="bumblebee" className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App;
// This is the main App component that sets up the layout and routes for the application.