import { useEffect, useState } from 'react';

const EditShippingAddressModal = ({ order, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        address_line1: order.address_line1 || '',
        address_line2: order.address_line2 || '',
        city: order.city || '',
        postal_code: order.postal_code || '',
        country: order.country || '',
      });
    }
  }, [order, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Shipping Address</h3>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <label className="label"><span className="label-text">Address Line 1</span></label>
            <input type="text" name="address_line1" value={formData.address_line1} onChange={handleChange} className="input input-bordered w-full" />
          </div>
          <div>
            <label className="label"><span className="label-text">Address Line 2 (Optional)</span></label>
            <input type="text" name="address_line2" value={formData.address_line2} onChange={handleChange} className="input input-bordered w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text">City</span></label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="input input-bordered w-full" />
            </div>
            <div>
              <label className="label"><span className="label-text">Postal Code</span></label>
              <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} className="input input-bordered w-full" />
            </div>
          </div>
          <div>
            <label className="label"><span className="label-text">Country</span></label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="input input-bordered w-full" />
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShippingAddressModal;
