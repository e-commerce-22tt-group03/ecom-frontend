import api from './axiosConfig';

export const fetchAddressesApi = async () => {
  const res = await api.get('/address');
  return res.data?.data || res.data || [];
};

export const createAddressApi = async (data) => {
  const res = await api.post('/address', data);
  return res.data?.data || res.data;
};

export const setDefaultAddressApi = async (addressId) => {
  const res = await api.patch(`/address/${addressId}/set-default`);
  return res.data?.data || res.data;
};
