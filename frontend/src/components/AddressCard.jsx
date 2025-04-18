import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa6';
import { Input } from './ui/input';
import { Button } from './ui/button';

export function AddressCard({ address, onEdit, onDelete }) {
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [addressData, setAddressData] = useState({
    house: null,
    city: null,
    state: null,
    country: null,
    zipcode: null,
    isDefault: false,
  });

  //   console.log(address);

  useEffect(() => {
    setAddressData({
      house: address.house,
      city: address.city,
      state: address.state,
      country: address.country,
      zipcode: address.zipcode,
    });
  }, [address]);

  const editHandler = (data) => {
    onEdit(data);
    // console.log(data);
    setEditFormOpen(false);
  };

  const deleteHandler = (data) => {
    const confirmPrompt = confirm('Do you want to delete this address?');
    if (confirmPrompt) {
      onDelete(data);
    }
  };

  return (
    <div
      className={`mx-auto bg-white ${
        address.isDefault ? 'border-blue-500' : 'border-gray-200'
      } border rounded-xl shadow p-6 mb-6`}
    >
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-xl font-semibold text-gray-800'>{address.house}</h3>
        {address.isDefault && (
          <span className='text-sm font-medium text-blue-600'>Default</span>
        )}
      </div>
      <p className='text-gray-600'>
        {address.city}, {address.state}
      </p>
      <p className='text-gray-600'>
        {address.country} — {address.zipcode}
      </p>
      <div className='mt-4 flex flex-wrap gap-3'>
        {!address.isDefault && (
          <button
            onClick={() =>
              editHandler({ ...addressData, id: address._id, isDefault: true })
            }
            className='flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700'
          >
            <FaStar /> Make Default
          </button>
        )}
        <button
          onClick={() => setEditFormOpen((prev) => !prev)}
          className='flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
        >
          <FaEdit /> Edit
        </button>
        <button
          onClick={() => deleteHandler({ id: address._id })}
          className='flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
        >
          <FaTrashAlt /> Delete
        </button>
      </div>
      {editFormOpen && (
        <div className='flex flex-col gap-3 w-full mt-4'>
          <h4 className='font-2xl font-bold'>Edit Address</h4>
          <Input
            placeholder='house'
            value={addressData.house}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, house: e.target.value }))
            }
            className='p-4'
          />
          <Input
            placeholder='city'
            value={addressData.city}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, city: e.target.value }))
            }
            className='p-4'
          />
          <Input
            placeholder='state'
            value={addressData.state}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, state: e.target.value }))
            }
            className='p-4'
          />
          <Input
            placeholder='country'
            value={addressData.country}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, country: e.target.value }))
            }
            className='p-4'
          />
          <Input
            placeholder='zipcode'
            value={addressData.zipcode}
            onChange={(e) =>
              setAddressData((prev) => ({ ...prev, zipcode: e.target.value }))
            }
            className='p-4'
          />
          <Button
            onClick={() => editHandler({ id: address._id, ...addressData })}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
