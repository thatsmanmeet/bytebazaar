import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Provider } from 'react-redux';
import store from './store.js';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import { Toaster } from 'react-hot-toast';
import '@smastrom/react-rating/style.css';
import ProductDetailScreen from './screens/ProductDetailScreen';
import RegisterScreen from './screens/RegisterScreen';
import PrivateRoute from './components/PrivateRoute';
import CartScreen from './screens/CartScreen';
import CategoryScreen from './screens/CategoryScreen';
import AccountScreen from './screens/profile/AccountScreen';
import ReviewScreen from './screens/profile/ReviewScreen';
import OrderScreen from './screens/profile/OrderScreen';
import SellerScreen from './screens/profile/SellerScreen';
import AddressScreen from './screens/profile/AddressScreen';
import OrderDetailsScreen from './screens/OrderDetailsScreen';
import SellerOrdersScreen from './screens/profile/seller/SellerOrdersScreen';
import SellerProductsScreen from './screens/profile/seller/SellerProductsScreen';
import AddProduct from './screens/profile/seller/AddProduct';
import EditProduct from './screens/profile/seller/EditProduct';
import CheckoutScreen from './screens/CheckoutScreen';
import SearchPage from './screens/SearchPage';
import ErrorPage from './screens/ErrorPage';
import RateLimitPage from './screens/RateLimitScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomeScreen />,
        index: true,
      },
      {
        path: '/login',
        element: <LoginScreen />,
      },
      {
        path: '/register',
        element: <RegisterScreen />,
      },
      {
        path: '/product/:id',
        element: <ProductDetailScreen />,
      },
      {
        path: '/category/:id',
        element: <CategoryScreen />,
      },
      {
        path: '/search',
        element: <SearchPage />,
      },
      {
        path: '/429',
        element: <RateLimitPage />,
      },
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          {
            path: '/cart',
            element: <CartScreen />,
          },
          {
            path: '/checkout',
            element: <CheckoutScreen />,
          },
          {
            path: '/orders/:id',
            element: <OrderDetailsScreen />,
          },
          {
            path: '/profile/account',
            element: <AccountScreen />,
          },
          {
            path: '/profile/addresses',
            element: <AddressScreen />,
          },
          {
            path: '/profile/reviews',
            element: <ReviewScreen />,
          },
          {
            path: '/profile/orders',
            element: <OrderScreen />,
          },
          {
            path: '/profile/seller/dashboard',
            element: <SellerScreen />,
          },
          {
            path: '/profile/seller/orders',
            element: <SellerOrdersScreen />,
          },
          {
            path: '/profile/seller/products',
            element: <SellerProductsScreen />,
          },
          {
            path: '/profile/seller/addproduct',
            element: <AddProduct />,
          },
          {
            path: '/profile/seller/editproduct/:id',
            element: <EditProduct />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>
);
