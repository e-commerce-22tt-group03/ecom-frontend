import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AdminProductTable from '../../features/products/components/AdminProductTable';
import { deleteProduct, fetchProducts } from '../../features/products/productsSlice';

const ManageProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, pagination, loading, error } = useSelector((state) => state.products);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: limit }));
  }, [dispatch, currentPage]);

  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const resultAction = await dispatch(deleteProduct(productId));
      if (deleteProduct.fulfilled.match(resultAction)) {
        alert('Product deleted successfully!');
        dispatch(fetchProducts({ page: currentPage, limit: limit }));
      } else {
        alert(`Error: ${resultAction.payload || 'Failed to delete product'}`);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 ml-4">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {loading && <div className="text-center p-4"><span className="loading loading-lg loading-spinner"></span></div>}
      {error && <div className="alert alert-error"><span>Error: {error}</span></div>}

      {!loading && !error && (
        <div className="card bg-base-100 shadow-xl p-6">
          {products.length > 0 ? (
            <>
              <AdminProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
              {pagination.totalPages > 1 && (
                <div className="join mt-6 self-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="join-item btn"
                    disabled={currentPage === 1}>«</button>
                  <button className="join-item btn">Page {currentPage} of {pagination.totalPages}</button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="join-item btn"
                    disabled={currentPage === pagination.totalPages}>»</button>
                </div>
              )}
            </>
          ) : (
            <p>No products found. Click "Add New Product" to get started.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
