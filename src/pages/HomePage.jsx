import React from 'react';
import ProductList from '../features/products/components/ProductList';
import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Delivery",
      description: "Free shipping on orders over $50"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guarantee",
      description: "Fresh flowers guaranteed"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Same Day Delivery",
      description: "Order before 2PM for same day delivery"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-96 bg-gradient-to-r from-pink-100 to-purple-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-gray-800">
              Welcome to <span className="text-primary">LazaHoa</span>
            </h1>
            <p className="py-6 text-gray-600">
              Discover beautiful, fresh flowers for every occasion. 
              From romantic roses to cheerful sunflowers, we have the perfect bouquet for you.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LazaHoa?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body items-center text-center">
                  <div className="text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="card-title">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <ProductList />
    </div>
  );
};

export default HomePage;


