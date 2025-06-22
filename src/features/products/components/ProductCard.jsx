import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
    // Placeholder data structure - will be replaced with real data from props
    const {
        id = 1,
        name = "Sample Flower",
        price = 29.99,
        image = "/placeholder-flower.jpg",
        category = "Bouquet",
        isInStock = true
    } = product || {};

    return (
        <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <figure className="px-4 pt-4">
                <img 
                    src={image} 
                    alt={name}
                    className="rounded-xl h-48 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title text-lg font-semibold">{name}</h2>
                <p className="text-sm text-base-content/70">{category}</p>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold text-primary">${price}</span>
                    <span className={`badge ${isInStock ? 'badge-success' : 'badge-error'}`}>
                        {isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>
                <div className="card-actions justify-between mt-4">
                    <Link to={`/products/${id}`} className="btn btn-outline btn-sm">
                        View Details
                    </Link>
                    <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm btn-square">
                            <Heart className="h-4 w-4" />
                        </button>
                        <button 
                            className="btn btn-primary btn-sm"
                            disabled={!isInStock}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;