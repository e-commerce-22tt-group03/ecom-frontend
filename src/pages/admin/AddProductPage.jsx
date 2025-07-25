import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../features/products/components/ProductForm';
import { addProduct } from '../../features/products/productsSlice';

const AddProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.products);

  const handleSubmit = async (productData) => {
    const resultAction = await dispatch(addProduct(productData));
    if (addProduct.fulfilled.match(resultAction)) {
      // On success, navigate to the products list or dashboard
      alert('Product added successfully!');
      navigate('/admin/products');
    } else {
      // On failure, the error is already in the state
      alert(`Error: ${resultAction.payload || 'Failed to add product'}`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  );
};

export default AddProductPage;