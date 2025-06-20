import React, { useEffect, useState, useMemo } from 'react';
import { FaBoxOpen, FaSearch } from 'react-icons/fa';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { getProductsApiService, toggleProductVerificationApiService } from '../../services/api-service';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [productType, setProductType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  const fetchProducts = async (page = 1, filters = { productType, verifiedFilter }) => {
    setIsLoading(true);
    try {
      const response = await getProductsApiService({
        page,
        limit: meta.limit,
        productType: filters.productType,
      });
      setProducts(response.data || []);
      setMeta(response.meta || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, { productType, verifiedFilter });
  };

  const handleFilterChange = (e) => {
    const newProductType = e.target.value;
    setProductType(newProductType);
    fetchProducts(1, { productType: newProductType, verifiedFilter });
  };

  const handleVerifiedFilterChange = (e) => {
    const newVerifiedFilter = e.target.value;
    setVerifiedFilter(newVerifiedFilter);
    fetchProducts(1, { productType, verifiedFilter: newVerifiedFilter });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
  };

  const toggleVerification = async (product) => {
    try {
      await toggleProductVerificationApiService({
        id: product.ProductID,
        productType: product.ProductType,
      });
      setProducts(products.map(p =>
        p.ProductID === product.ProductID
          ? { ...p, Details: { ...p.Details, Verified: !p.Details.Verified } }
          : p
      ));
      if (selectedProduct && selectedProduct.ProductID === product.ProductID) {
        setSelectedProduct({
          ...selectedProduct,
          Details: { ...selectedProduct.Details, Verified: !selectedProduct.Details.Verified },
        });
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
      setError('Failed to toggle verification status');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.Creator.Name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVerified =
        verifiedFilter === '' ||
        (verifiedFilter === 'Verified' && product.Details.Verified) ||
        (verifiedFilter === 'Not Verified' && !product.Details.Verified);
      return matchesSearch && matchesVerified;
    });
  }, [products, searchQuery, verifiedFilter]);

  const tableHeaders = [
    'Creator Name',
    'Creator Email',
    'Product ID',
    'Title',
    'Product Type',
    'Payment Page',
    'Verified',
    'Actions',
  ];

  const tableData = filteredProducts.map((product) => [
    product.Creator.Name,
    product.Creator.Email,
    product.ProductID,
    product.Title,
    product.ProductType,

    product.PaymentPage ? 'Yes' : 'No',
    <div className="flex items-center space-x-2">
      {product.Details.Verified ? (
        <CheckCircleIcon className="h-5 w-5 text-green-600" />
      ) : (
        <XCircleIcon className="h-5 w-5 text-red-600" />
      )}
      <span>{product.Details.Verified ? 'Verified' : 'Not Verified'}</span>
    </div>,
    <div className="flex space-x-2">
      <button
        onClick={() => openProductDetails(product)}
        className="px-3 py-1 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
      >
        View
      </button>
      <button
        onClick={() => toggleVerification(product)}
        className={`px-3 py-1 text-white rounded-lg transition-colors ${product.Details.Verified
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-green-600 hover:bg-green-700'
          }`}
      >
        {product.Details.Verified ? 'Unverify' : 'Verify'}
      </button>
    </div>,
  ]);

  const parseJsonField = (field) => {
    if (!field) return <span className="text-gray-500">N/A</span>;

    // If field is already an object, use it directly
    if (typeof field === 'object' && field !== null) {
      return Object.entries(field).map(([key, value]) => (
        <p key={key} className="ml-2">
          <span className="font-medium capitalize">{key}:</span>{' '}
          {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
        </p>
      ));
    }

    // If field is a string, try parsing it as JSON
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Object.entries(parsed).map(([key, value]) => (
          <p key={key} className="ml-2">
            <span className="font-medium capitalize">{key}:</span>{' '}
            {typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value)}
          </p>
        ));
      } catch {
        // If parsing fails, treat it as a plain string
        return <p className="ml-2">{field}</p>;
      }
    }

    // For other types (e.g., numbers, booleans), convert to string
    return <p className="ml-2">{String(field)}</p>;
  };

  const renderProductDetails = (product) => {
    if (!product) return null;
    const { ProductType, Title, Creator, Details } = product;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
          <button
            onClick={closeProductDetails}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {Title} <span className="text-orange-600">({ProductType})</span>
            </h2>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Creator Information</h3>
              <p>
                <span className="font-medium">Name:</span> {Creator.Name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {Creator.Email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {Creator.Phone || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Verification Status:</span>{' '}
                <span className={Details.Verified ? 'text-green-600' : 'text-red-600'}>
                  {Details.Verified ? 'Verified' : 'Not Verified'}
                </span>
              </p>
            </div>
            {ProductType === 'PayingUp' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">PayingUp Details</h3>
                <div className="mb-4">
                  <p className="font-medium">Description:</p>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: Details.Description || 'N/A' }}
                  />
                </div>
                <div className="mb-4">
                  <p className="font-medium">Category:</p>
                  {parseJsonField(Details.Category)}
                </div>
                <div className="mb-4">
                  <p className="font-medium">Payment Details:</p>
                  {parseJsonField(Details.PaymentDetails)}
                </div>
                <div>
                  <p className="font-medium">Refund Policies:</p>
                  {parseJsonField(Details.RefundPolicies)}
                </div>
              </div>
            )}
            {ProductType === 'Course' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Course Details</h3>
                <p>
                  <span className="font-medium">Price:</span> ${Details.Price || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Validity:</span> {Details.Validity || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span>{' '}
                  {Details.StartDate ? new Date(Details.StartDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{' '}
                  {Details.EndDate ? new Date(Details.EndDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Community:</span> {Details.CommunityName || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Free Group:</span> {Details.FreeGroupName || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Paid Group:</span> {Details.PaidGroupName || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Language:</span> {parseJsonField(Details.Language)}
                </p>
                <p>
                  <span className="font-medium">About:</span> {parseJsonField(Details.About)}
                </p>
              </div>
            )}
            {ProductType === 'Webinar' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Webinar Details</h3>
                <p>
                  <span className="font-medium">Category:</span> {Details.Category || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Occurrence:</span> {Details.Occurrence || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Start Date:</span>{' '}
                  {Details.StartDate ? new Date(Details.StartDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{' '}
                  {Details.EndDate ? new Date(Details.EndDate).toLocaleDateString() : 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Venue:</span> {Details.Venue || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> ${Details.Amount || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span> {Details.Quantity || 'N/A'}
                </p>
              </div>
            )}
            {ProductType === 'Telegram' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Telegram Details</h3>
                <p>
                  <span className="font-medium">Invite Link:</span> {Details.InviteLink || 'N/A'} {/* Changed from ChannelLink */}
                </p>
                <p>
                  <span className="font-medium">Description:</span> {Details.Description || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Genre:</span> {Details.Genre || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Subscription:</span>{' '}
                  {parseJsonField(Details.Subscription)}
                </p>
              </div>
            )}
            {ProductType === 'PremiumContent' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-3">Premium Content Details</h3>
                <p>
                  <span className="font-medium">Category:</span> {Details.Category || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Unlock Price:</span> ${Details.UnlockPrice || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Content:</span> {parseJsonField(Details.Content)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <div className="flex items-center space-x-4">
            <FaBoxOpen className="text-4xl text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-800">Products Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4 flex-wrap mt-5 gap-3 md:mt-0">
            <div className="relative w-full md:w-auto">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by title or creator..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-64"
              />
            </div>
            <select
              value={productType}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
            >
              <option value="">All Products</option>
              <option value="Course">Course</option>
              <option value="Webinar">Webinar</option>
              <option value="Telegram">Telegram</option>
              <option value="PayingUp">PayingUp</option>
              <option value="PremiumContent">PremiumContent</option>
            </select>
            <select
              value={verifiedFilter}
              onChange={handleVerifiedFilterChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
            >
              <option value="">All Verification Status</option>
              <option value="Verified">Verified</option>
              <option value="Not Verified">Not Verified</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-500 text-white px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-600"></div>
            <p className="ml-3 text-lg text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-orange-600 sticky top-0">
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <p className="text-sm text-gray-700">
                Showing {(meta.page - 1) * meta.limit + 1} to{' '}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(meta.page - 1)}
                  disabled={meta.page === 1}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(meta.page + 1)}
                  disabled={meta.page === meta.totalPages}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {renderProductDetails(selectedProduct)}
    </div>
  );
};

export default ProductsPage;