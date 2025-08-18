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
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full relative">
        <img
          src="/banner.png"
          alt="LazaHoa Banner"
          className="w-full object-cover"
          style={{ height: '50%', maxHeight: '350px' }}
        />
  <div className="absolute inset-0 flex flex-col justify-center items-center text-white bg-black bg-opacity-60">
          <h2 className="text-3xl font-bold mb-6">Why Choose LazaHoa?</h2>
          <p className="text-lg mb-8 text-center max-w-2xl">
            Discover the best flower delivery service with LazaHoa. Enjoy free delivery, quality guarantee, and same day delivery options.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>  
      </div>
      <div className="flex justify-center w-full mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 bg-opacity-80 shadow-lg flex flex-col items-center">
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
      <ProductList />
    </div>
  );
};

export default HomePage;


