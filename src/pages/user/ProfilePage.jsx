import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../features/profile/profileSlice';
import ProfileSidebar from '../../features/profile/ProfileSidebar';
import axios from 'axios';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { data, loading, error, updateSuccess } = useSelector(state => state.profile);
  const [editField, setEditField] = useState(null); // 'full_name' or 'email' or null
  const [form, setForm] = useState({ full_name: '', email: '' });
  const [changed, setChanged] = useState(false);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);
  useEffect(() => {
    if (data) setForm({ full_name: data.full_name, email: data.email });
  }, [data]);
  useEffect(() => {
    if (updateSuccess) {
      setEditField(null);
      setChanged(false);
    }
  }, [updateSuccess]);

  const handleEdit = (field) => setEditField(field);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setChanged(true);
  };
  const handleCancel = () => {
    setForm({ full_name: data.full_name, email: data.email });
    setEditField(null);
    setChanged(false);
  };
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(updateProfile(form));
  };

  // Change password handlers
  const handlePasswordChange = e => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    setPasswordError(null);
    setPasswordSuccess(false);
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/password`,
        passwordForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordSuccess(true);
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-screen bg-base-200">
      {/* Sidebar - left fifth */}
      <ProfileSidebar />
      {/* Profile Card - right four-fifths */}
      <div className="w-full md:w-4/5 flex items-start justify-start h-full md:h-screen">
        <div className="w-full max-w-md ml-0 mt-10 md:ml-24">
          <div className="w-full p-3">
            <div className="mb-10 flex flex-col items-start">
              <h2 className="text-lg font-semibold text-base-content">Profile</h2>
            </div>
            {error && <div className="alert alert-error mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label"><span className="label-text">Full Name</span></label>
                {editField === 'full_name' ? (
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    autoFocus
                    onBlur={() => setEditField(null)}
                  />
                ) : (
                  <div
                    className="input input-bordered w-full cursor-pointer flex items-center min-h-[3rem]"
                    tabIndex={0}
                    onClick={() => handleEdit('full_name')}
                  >
                    {form.full_name || <span className="text-base-content/50">Click to add name</span>}
                  </div>
                )}
              </div>
              {/* Email */}
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                {editField === 'email' ? (
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    autoFocus
                    onBlur={() => setEditField(null)}
                  />
                ) : (
                  <div
                    className="input input-bordered w-full cursor-pointer flex items-center min-h-[3rem]"
                    tabIndex={0}
                    onClick={() => handleEdit('email')}
                  >
                    {form.email || <span className="text-base-content/50">Click to add email</span>}
                  </div>
                )}
              </div>
              {/* Save/Cancel Buttons */}
              {changed && (
                <div className="flex gap-2">
                  <button className="btn btn-primary flex-1" type="submit" disabled={loading}>Save Changes</button>
                  <button className="btn btn-ghost flex-1" type="button" onClick={handleCancel}>Cancel</button>
                </div>
              )}
            </form>
            {/* Change Password Section */}
            <div className="divider my-8">Change Password</div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Current Password</span></label>
                <input
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">New Password</span></label>
                <input
                  name="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Confirm New Password</span></label>
                <input
                  name="confirm_password"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>
              {passwordError && <div className="alert alert-error mb-2">{passwordError}</div>}
              {passwordSuccess && <div className="alert alert-success mb-2">Password changed successfully!</div>}
              <button className="btn btn-primary w-full" type="submit" disabled={passwordLoading}>Save Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 