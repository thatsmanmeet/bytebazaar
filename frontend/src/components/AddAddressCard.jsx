import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

function AddAddressCard({ addDataHandler }) {
  const [addressData, setAddressData] = useState({
    house: null,
    city: null,
    state: null,
    country: null,
    zipcode: null,
    isDefault: false,
  });

  const addHandler = (data) => {
    addDataHandler(data);
    setAddressData({
      house: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
      isDefault: false,
    });
  };

  return (
    <div className='flex flex-col gap-3 w-full mt-4'>
      <h4 className='font-2xl font-bold'>Add a new Address</h4>
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
      <Button onClick={() => addHandler({ ...addressData })}>
        Add Address
      </Button>
    </div>
  );
}

export default AddAddressCard;
