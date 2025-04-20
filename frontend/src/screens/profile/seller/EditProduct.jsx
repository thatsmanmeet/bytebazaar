import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllCategoriesQuery } from '@/slices/categoryApiSlice';
import {
  useGetProductByIdQuery,
  useUpdateProductByIdMutation,
  useUploadProductImagesMutation,
} from '@/slices/productApiSlice';
import { ClipLoader } from 'react-spinners';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router';

function EditProduct() {
  const { id: productId } = useParams();

  const {
    data: productResponse,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductByIdQuery(productId);

  const {
    data: categoryResponse,
    isLoading,
    error,
  } = useGetAllCategoriesQuery();

  const [uploadImages] = useUploadProductImagesMutation();
  const [updateProduct] = useUpdateProductByIdMutation();
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      content: '',
      brand: '',
      stock: 0,
      price: 0,
      category: '',
    },
  });

  useEffect(() => {
    if (productResponse?.data) {
      const p = productResponse.data;
      reset({
        name: p.name,
        content: p.content,
        brand: p.brand,
        stock: p.stock,
        price: p.price,
        category: p.category,
      });
      setImageUrls(p.images || []);
    }
  }, [productResponse?.data, reset]);

  if (isLoading || isProductLoading) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <ClipLoader size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <p className='border border-red-400 p-5 text-xl'>
          {error.data?.message || error?.error || error?.message}
        </p>
      </div>
    );
  }

  if (productError) {
    return (
      <div className='flex items-center justify-center w-full h-screen'>
        <p className='border border-red-400 p-5 text-xl'>
          {productError.data?.message ||
            productError?.error ||
            productError?.message}
        </p>
      </div>
    );
  }

  const categories = categoryResponse.data;

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (const image of files) {
      formData.append('images', image);
    }
    try {
      const res = await uploadImages(formData).unwrap();
      setImageUrls(res.images);
    } catch (err) {
      console.error('Image upload failed:', err);
    }
  };

  const onSubmit = async (data) => {
    if (imageUrls.length === 0) {
      alert('Please upload product images.');
      return;
    }

    const productData = {
      ...data,
      images: imageUrls,
      _id: productResponse.data._id,
    };

    try {
      const res = await updateProduct(productData).unwrap();
      toast.success(res.message);
      reset();
      navigate('/profile/seller/products');
    } catch (err) {
      toast.error(err?.message || err?.data?.message || err?.error);
    }
  };

  return (
    <div className='min-h-screen w-full p-5'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mx-auto max-w-2xl border-2 p-5 flex flex-col gap-4'
      >
        <h1 className='text-2xl font-bold mb-3'>Edit Product</h1>

        <Input
          type='text'
          placeholder='Product Name'
          {...register('name', {
            required: { value: true, message: 'Product name is required' },
          })}
        />
        {errors.name && (
          <p className='text-red-500 text-sm'>{errors.name.message}</p>
        )}

        <Textarea
          placeholder='Describe your product'
          {...register('content', {
            required: {
              value: true,
              message: 'Product description is required',
            },
          })}
        />
        {errors.content && (
          <p className='text-red-500 text-sm'>{errors.content.message}</p>
        )}

        <Input
          type='text'
          placeholder='Brand'
          {...register('brand', {
            required: { value: true, message: 'Brand name is required' },
          })}
        />
        {errors.brand && (
          <p className='text-red-500 text-sm'>{errors.brand.message}</p>
        )}

        <Input
          type='number'
          placeholder='Stock'
          {...register('stock', {
            required: { value: true, message: 'Stock is required' },
            min: { value: 1, message: 'Stock must be at least 1' },
          })}
        />
        {errors.stock && (
          <p className='text-red-500 text-sm'>{errors.stock.message}</p>
        )}

        <Input
          type='number'
          placeholder='Price'
          {...register('price', {
            required: { value: true, message: 'Product price is required' },
            min: { value: 0.01, message: 'Price must be greater than 0' },
          })}
        />
        {errors.price && (
          <p className='text-red-500 text-sm'>{errors.price.message}</p>
        )}

        <Controller
          name='category'
          control={control}
          rules={{ required: 'Category is required' }}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={
                productResponse?.data
                  ? typeof productResponse.data.category === 'object'
                    ? productResponse.data.category._id
                    : productResponse.data.category
                  : ''
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a product category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && (
          <p className='text-red-500 text-sm'>{errors.category.message}</p>
        )}

        <div className='grid w-full items-center gap-1.5'>
          <Label htmlFor='images'>Product Images</Label>
          <Input
            id='images'
            type='file'
            multiple
            onChange={handleImageUpload}
          />
        </div>

        {/* Preview uploaded images */}
        <div className='flex gap-2 flex-wrap'>
          {imageUrls.map((url, index) => (
            <img
              key={`${url}-${index}`}
              src={url}
              alt='Uploaded'
              className='w-24 h-24 object-cover rounded'
            />
          ))}
        </div>

        <Button type='submit'>Submit</Button>
      </form>
    </div>
  );
}

export default EditProduct;
