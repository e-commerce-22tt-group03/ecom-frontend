import React, { useState } from 'react';
import axios from 'axios';

const AddressForm = ({ onAddressCreated, onCancel }) => {
  const [form, setForm] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/address`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onAddressCreated(response.data.data);
      setForm({
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: '',
      });
    } catch (error) {
      console.error('Error creating address:', error);
      setError(error.response?.data?.message || 'Failed to create address');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      address_line1: '',
      address_line2: '',
      city: '',
      postal_code: '',
      country: '',
    });
    setError(null);
    onCancel();
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 mb-6">
      <div className="card-body p-4">
        <h3 className="text-lg font-medium mb-4">Add New Address</h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address Line 1 *</span>
            </label>
            <input
              name="address_line1"
              value={form.address_line1}
              onChange={handleChange}
              placeholder="Enter your address"
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address Line 2</span>
            </label>
            <input
              name="address_line2"
              value={form.address_line2}
              onChange={handleChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="input input-bordered w-full"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">City *</span>
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Postal Code *</span>
              </label>
              <input
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
                placeholder="Enter postal code"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Country *</span>
            </label>
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Enter country"
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Adding Address...' : 'Add Address'}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-ghost flex-1"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;