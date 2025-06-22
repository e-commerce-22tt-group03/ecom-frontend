import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';

const ProductList = () => {
    // This will later connect to Redux store
    // const { products, loading, error } = useSelector(state => state.products);
    
    // Mock data for now - will be replaced with Redux state
    const mockProducts = [
        {
            id: 1,
            name: "Red Rose Bouquet",
            price: 45.99,
            image: "/placeholder-rose.jpg",
            category: "Romantic",
            isInStock: true
        },
        {
            id: 2,
            name: "Sunflower Arrangement",
            price: 32.50,
            image: "/placeholder-sunflower.jpg",
            category: "Cheerful",
            isInStock: true
        },
        {
            id: 3,
            name: "Wedding White Lilies",
            price: 78.00,
            image: "/placeholder-lily.jpg",
            category: "Wedding",
            isInStock: false
        }
    ];

    const loading = false;
    const error = null;

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>Error loading products: {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mockProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            {mockProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-base-content/70">No products found</p>
                </div>
            )}
        </div>
    );
};

export default ProductList;