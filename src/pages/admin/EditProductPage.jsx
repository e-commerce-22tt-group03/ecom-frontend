import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../../features/products/components/ProductForm';
import { fetchProducts, updateProduct } from '../../features/products/productsSlice';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productId } = useParams();

  const { items: products, loading, error } = useSelector((state) => state.products);

  const productToEdit = products.find(p => p.productId === parseInt(productId));
  console.log("Product to edit:", productToEdit);

  // If the products array is empty (e.g., user reloads on this page),
  // dispatch an action to fetch all products to find the one we need.
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const handleSubmit = async (formData) => {
    const productData = {
      name: formData.name,
      base_price: formData.base_price,
      condition: formData.condition,
      stock_quantity: formData.stock_quantity,
      image_url: formData.image_url,
      description: formData.description,
    };

    const resultAction = await dispatch(updateProduct({ productId, productData }));

    if (updateProduct.fulfilled.match(resultAction)) {
      alert('Product updated successfully!');
      dispatch(fetchProducts());
      navigate('/admin/products');
    } else {
      alert(`Error: ${resultAction.payload || 'Failed to update product'}`);
    }
  };

  // Show a loading state while fetching or if the product isn't found yet
  if (loading && !productToEdit) {
    return <div className="text-center p-4"><span className="loading loading-spinner"></span></div>;
  }

  // Handle case where product is not found after loading
  if (!loading && products.length > 0 && !productToEdit) {
    return <div className="text-center text-error font-bold">Product with ID {productId} not found.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      {error && <div className="alert alert-error mb-4">{error}</div>}
      {productToEdit ? (
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={loading}
          initialData={productToEdit}
          isEditMode={true}
        />
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
};

export default EditProductPage;
