import React, { useState } from 'react';
import axios from 'axios';

const AddressCard = ({ address, onUpdate, onDelete, onSetDefault }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    address_line1: address.address_line1,
    address_line2: address.address_line2 || '',
    city: address.city,
    postal_code: address.postal_code,
    country: address.country,
  });
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditForm({
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/address/${address.address_id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdate(response.data.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating address:', error);
      alert(error.response?.data?.message || 'Failed to update address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (address.is_default) {
      alert('Cannot delete default address');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this address?')) {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/address/${address.address_id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onDelete(address.address_id);
      } catch (error) {
        console.error('Error deleting address:', error);
        alert(error.response?.data?.message || 'Failed to delete address');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSetDefault = async () => {
    if (address.is_default) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/address/${address.address_id}/set-default`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSetDefault(address.address_id);
    } catch (error) {
      console.error('Error setting default address:', error);
      alert(error.response?.data?.message || 'Failed to set default address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card bg-base-100 shadow-sm border ${address.is_default ? 'border-primary' : 'border-base-300'} mb-4`}>
      <div className="card-body p-4">
        {address.is_default && (
          <div className="badge badge-primary badge-sm mb-2">Default</div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-control">
              <input
                name="address_line1"
                value={editForm.address_line1}
                onChange={handleChange}
                placeholder="Address Line 1"
                className="input input-bordered input-sm w-full"
                required
              />
            </div>
            <div className="form-control">
              <input
                name="address_line2"
                value={editForm.address_line2}
                onChange={handleChange}
                placeholder="Address Line 2 (Optional)"
                className="input input-bordered input-sm w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="form-control">
                <input
                  name="city"
                  value={editForm.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>
              <div className="form-control">
                <input
                  name="postal_code"
                  value={editForm.postal_code}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="input input-bordered input-sm w-full"
                  required
                />
              </div>
            </div>
            <div className="form-control">
              <input
                name="country"
                value={editForm.country}
                onChange={handleChange}
                placeholder="Country"
                className="input input-bordered input-sm w-full"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button 
                type="submit" 
                className="btn btn-primary btn-sm flex-1"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="btn btn-ghost btn-sm flex-1"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="text-sm">
              <p className="font-medium">{address.address_line1}</p>
              {address.address_line2 && <p>{address.address_line2}</p>}
              <p>{address.city}, {address.postal_code}</p>
              <p>{address.country}</p>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button 
                onClick={handleEdit}
                className="btn btn-ghost btn-sm"
                disabled={loading}
              >
                Edit
              </button>
              {!address.is_default && (
                <button 
                  onClick={handleSetDefault}
                  className="btn btn-outline btn-primary btn-sm"
                  disabled={loading}
                >
                  Set Default
                </button>
              )}
              {!address.is_default && (
                <button 
                  onClick={handleDelete}
                  className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content"
                  disabled={loading}
                >
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;