import React, { useEffect, useState } from 'react';
import ProfileSidebar from '../../features/profile/ProfileSidebar';
import AddressCard from '../../features/address/AddressCard';
import AddressForm from '../../features/address/AddressForm';
import axios from 'axios';

const ManageAddressPage = () => {
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/address`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddress(response.data.data);
    } catch (error) {
      console.error('Error fetching Address:', error);
      setError(error.response?.data?.message || 'Failed to fetch Address');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressCreated = (newAddress) => {
    setAddress(prev => [...prev, newAddress]);
    setShowAddForm(false);
  };

  const handleAddressUpdated = (updatedAddress) => {
    setAddress(prev => 
      prev.map(addr => 
        addr.address_id === updatedAddress.address_id ? updatedAddress : addr
      )
    );
  };

  const handleAddressDeleted = (addressId) => {
    setAddress(prev => prev.filter(addr => addr.address_id !== addressId));
  };

  const handleSetDefault = (addressId) => {
    setAddress(prev => 
      prev.map(addr => ({
        ...addr,
        is_default: addr.address_id === addressId
      }))
    );
  };

  const canAddMore = address.length < 10;

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-base-200">
      {/* Sidebar - left fifth */}
      <ProfileSidebar />
      
      {/* Main Content - right four-fifths */}
      <div className="w-full md:w-4/5 flex items-start justify-start h-full md:h-screen">
        <div className="w-full max-w-2xl ml-0 mt-10 md:ml-24">
          <div className="w-full p-3">
            {/* Header */}
            <div className="mb-10 flex flex-col items-start">
              <h2 className="text-lg font-semibold text-base-content">Manage Shipping Address</h2>
              <p className="text-sm text-base-content/70 mt-1">
                Add, edit, or remove your shipping address. You can have up to 10 address.
              </p>
            </div>

            {/* Add New Address Button */}
            {!showAddForm && canAddMore && address.length > 0 && (
              <div className="mb-6">
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="btn btn-primary"
                >
                  Add New Address
                </button>
              </div>
            )}

            {/* Address Form */}
            {showAddForm && (
              <AddressForm 
                onAddressCreated={handleAddressCreated}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="alert alert-error mb-4">
                {error}
                <button 
                  onClick={fetchAddress}
                  className="btn btn-ghost btn-sm ml-2"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Address List */}
            {!loading && !error && (
              <>
                {address.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-base-content/50 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-lg">No address found</p>
                      <p className="text-sm">Add your first shipping address to get started</p>
                    </div>
                    {!showAddForm && (
                      <button 
                        onClick={() => setShowAddForm(true)}
                        className="btn btn-primary"
                      >
                        Add Your First Address
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Address count info */}
                    <div className="text-sm text-base-content/70 mb-4">
                      {address.length} of 10 Address used
                      {!canAddMore && (
                        <span className="text-warning ml-2">
                          (Maximum reached - delete an address to add more)
                        </span>
                      )}
                    </div>

                    {/* Address Cards */}
                    {address.map((address) => (
                      <AddressCard
                        key={address.address_id}
                        address={address}
                        onUpdate={handleAddressUpdated}
                        onDelete={handleAddressDeleted}
                        onSetDefault={handleSetDefault}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAddressPage;