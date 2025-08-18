import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../../features/products/productsSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import { addCategoryToProduct, removeCategoryFromProduct } from '../../api/categoryApi';

const ManageProductCategoriesPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  const { currentProduct, loading: productsLoading } = useSelector((state) => state.products);
  const { flower_types, occasions, loading: categoriesLoading } = useSelector((state) => state.categories);

  const productCategoryIds = useMemo(
    () => new Set(currentProduct?.categories?.map(c => c.categoryId)),
    [currentProduct]
  );

  const unassignedFlowerTypes = useMemo(
    () => flower_types.filter(c => !productCategoryIds.has(c.category_id)),
    [flower_types, productCategoryIds]
  );
  const unassignedOccasions = useMemo(
    () => occasions.filter(c => !productCategoryIds.has(c.category_id)),
    [occasions, productCategoryIds]
  );

  useEffect(() => {
    dispatch(fetchProductById(productId))
    if (flower_types.length === 0 && occasions.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, productId, flower_types.length, occasions.length]);

  const handleAdd = async (categoryId) => {
    await addCategoryToProduct(productId, categoryId);
    dispatch(fetchProductById(productId)); // Refetch to update UI
  };

  const handleRemove = async (categoryId) => {
    await removeCategoryFromProduct(productId, categoryId);
    dispatch(fetchProductById(productId)); // Refetch to update UI
  };

  if (productsLoading || categoriesLoading || !currentProduct) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/admin/products" className="btn btn-ghost mb-4">Back to Products</Link>
      <h1 className="text-3xl font-bold mb-6 ml-4">Manage Categories for: {currentProduct.name}</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-4">Assigned Categories</h2>
          <ul className="space-y-2">
            {currentProduct.categories?.map(cat => (
              <li key={cat.categoryId} className="flex justify-between items-center">
                <span>{cat.name}</span>
                <button onClick={() => handleRemove(cat.categoryId)} className="btn btn-xs btn-error">Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Available Flower Types</h2>
            <ul className="space-y-2">
              {unassignedFlowerTypes.map(cat => (
                <li key={cat.category_id} className="flex justify-between items-center">
                  <span>{cat.name}</span>
                  <button onClick={() => handleAdd(cat.category_id)} className="btn btn-xs btn-success">Add</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-base-100 shadow-xl p-6">
            <h2 className="text-xl font-bold mb-4">Available Occasions</h2>
            <ul className="space-y-2">
              {unassignedOccasions.map(cat => (
                <li key={cat.category_id} className="flex justify-between items-center">
                  <span>{cat.name}</span>
                  <button onClick={() => handleAdd(cat.category_id)} className="btn btn-xs btn-success">Add</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProductCategoriesPage;
