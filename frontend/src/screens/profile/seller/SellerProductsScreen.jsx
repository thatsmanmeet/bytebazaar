import React, { useState } from 'react';
import { Link } from 'react-router';
import ProfileScreen from '@/screens/ProfileScreen';
import {
  useDeleteProductByIdMutation,
  useGetSellerProductsQuery,
} from '@/slices/productApiSlice';
import { ClipLoader } from 'react-spinners';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import toast from 'react-hot-toast';

export default function SellerProductsScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: sellerProductsResponse,
    isLoading,
    error,
    refetch,
  } = useGetSellerProductsQuery({}, { refetchOnMountOrArgChange: true });

  const [deleteProductAPI] = useDeleteProductByIdMutation();

  if (isLoading) {
    return (
      <ProfileScreen>
        <div className='w-full min-h-screen flex items-center justify-center'>
          <ClipLoader size={50} />
        </div>
      </ProfileScreen>
    );
  }

  if (error) {
    return (
      <ProfileScreen>
        <div className='w-full min-h-screen flex items-center justify-center'>
          <p>{error?.data?.message || error?.error}</p>
        </div>
      </ProfileScreen>
    );
  }

  const productDeletionHandler = async (productId) => {
    if (!productId) {
      toast.error('Product ID is required for deletion');
      return;
    }
    const confirmPrompt = confirm('Do you want to delete this product? ');
    if (!confirmPrompt) {
      return;
    }
    try {
      const res = await deleteProductAPI(productId).unwrap();
      toast.success(res.message);
      refetch();
    } catch (error) {
      toast.error(error?.message || error?.data?.message || error?.error);
    }
  };

  const products = sellerProductsResponse.data;
  const searchedProducts = searchTerm
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.content.toLowerCase().includes(searchTerm)
      )
    : products;

  return (
    <ProfileScreen>
      <div className='p-5 flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Manage Your Products</h1>
          <Link to='/profile/seller/addproduct'>
            <Button>Add New Product</Button>
          </Link>
        </div>

        <div className='flex items-center gap-2'>
          <Input
            placeholder='Search products...'
            className='max-w-sm'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button>Search</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Product List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className='my-4'>
              <TableCaption>Overview of your listed products</TableCaption>
              <TableHeader className='bg-muted sticky top-0'>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price (₹)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchedProducts.map((product) => {
                  const isLowStock = product.stock < 10;
                  const displayName =
                    product.name.length > 35
                      ? product.name.substr(0, 32) + '...'
                      : product.name;

                  return (
                    <TableRow key={product._id} className='hover:bg-muted'>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              to={`/product/${product._id}`}
                              className='hover:underline'
                            >
                              {displayName}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className='max-w-xs break-words'>
                              {product.name}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {product.price.toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        })}
                      </TableCell>
                      <TableCell className='flex items-center space-x-2'>
                        <span>{product.stock}</span>
                        {isLowStock && <Badge variant='destructive'>Low</Badge>}
                      </TableCell>
                      <TableCell>{product.rating?.toFixed(1) || '—'}</TableCell>
                      <TableCell>{product.numReviews}</TableCell>
                      <TableCell className='flex space-x-2'>
                        <Link to={`/profile/seller/editproduct/${product._id}`}>
                          <Button size='sm'>Edit</Button>
                        </Link>
                        <Button
                          size='sm'
                          variant='destructive'
                          className='text-white'
                          onClick={() => {
                            productDeletionHandler(product._id);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProfileScreen>
  );
}
