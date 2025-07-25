import { Link } from 'react-router-dom';

const ManageProductsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Link to="/admin/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>
      <p>This is where the admin product list (e.g., a table) will go. You can view, edit, and delete products from here.</p>
      {/* The admin product table component will be added here later */}
    </div>
  );
};

export default ManageProductsPage;