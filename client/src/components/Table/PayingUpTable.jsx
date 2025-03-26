import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Edit2, Filter, SortAsc, Mail, ArrowDown, ArrowUp } from 'lucide-react';
import  toast  from "react-hot-toast";

import Pagination from '@mui/material/Pagination';

const PayingUpTable = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const itemsPerPage = 10;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRowClick = (id, paymentEnabled) => {
    if (paymentEnabled) {
      navigate(`/app/paying-up?id=${id}`);
    }
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    navigate(`/app/edit-payingup?id=${item.id}`);
  };

  const calculateRevenue = (item) => {
    const price = parseFloat(item.paymentDetails?.totalAmount) || 0;
    const sales = item._count?.payingUpTickets || 0;
    return price * sales;
  };

  // Add sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.paymentDetails?.totalAmount?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Add sorting functionality
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      switch (sortConfig.key) {
        case 'title':
          return sortConfig.direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'price':
          const priceA = parseFloat(a.paymentDetails?.totalAmount) || 0;
          const priceB = parseFloat(b.paymentDetails?.totalAmount) || 0;
          return sortConfig.direction === 'asc' 
            ? priceA - priceB
            : priceB - priceA;
        case 'sales':
          const salesA = a._count?.payingUpTickets || 0;
          const salesB = b._count?.payingUpTickets || 0;
          return sortConfig.direction === 'asc'
            ? salesA - salesB
            : salesB - salesA;
        case 'revenue':
          const revenueA = calculateRevenue(a);
          const revenueB = calculateRevenue(b);
          return sortConfig.direction === 'asc'
            ? revenueA - revenueB
            : revenueB - revenueA;
        case 'createdAt':
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortConfig.direction === 'asc' 
            ? dateA - dateB
            : dateB - dateA;
        case 'updatedAt':
          const updateA = new Date(a.updatedAt);
          const updateB = new Date(b.updatedAt);
          return sortConfig.direction === 'asc' 
            ? updateA - updateB
            : updateB - updateA;
        default:
          return 0;
      }
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, page]);

  const handleExport = () => {
    toast.info('Starting export...', {
      position: "top-right",
      autoClose: 1000,
    });

    try {
      // Convert data to CSV format
      const headers = ['Title', 'Price', 'Sales', 'Revenue', 'Payment Status', 'Created At', 'Updated At'];
      const csvData = [
        headers.join(','),
        ...filteredData.map(item => [
          item.title.replace(/,/g, ';'),
          item.paymentDetails?.totalAmount || 0,
          item._count?.payingUpTickets || 0,
          calculateRevenue(item),
          item.paymentDetails?.paymentEnabled ? 'Enabled' : 'Disabled',
          `"${new Date(item.createdAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}"`,
          `"${new Date(item.updatedAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}"` 
        ].join(','))
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `paying_up_export_${new Date().toLocaleDateString()}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Export completed successfully!', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Export failed. Please try again.', {
        position: "top-right",
        autoClose: 3000,
      });
      console.error('Export error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Create dropdown component for sorting
  const renderSortButton = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-all duration-200"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <SortAsc className="h-4 w-4" />
        <span className="inline">Sort</span>
      </button>
      
      <div className={`${isDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10`}>
        <div className="py-1">
          <button
            onClick={() => handleSort('title')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
          </button>
          <button
            onClick={() => handleSort('price')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
          </button>
          <button
            onClick={() => handleSort('sales')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Sales {sortConfig.key === 'sales' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
          </button>
          <button
            onClick={() => handleSort('revenue')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Revenue {sortConfig.key === 'revenue' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
          </button>
          <button
            onClick={() => handleSort('createdAt')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Created Date {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
          </button>
          <button
            onClick={() => handleSort('updatedAt')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Updated Date {sortConfig.key === 'updatedAt' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full px-4 sm:px-6 lg:px-8">
      {/* Updated Search Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title or price..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
        
          
          {renderSortButton()}
          
          <button 
            onClick={handleExport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Sale</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr 
                  key={item.id}
                  onClick={() => handleRowClick(item.id, item.paymentDetails?.paymentEnabled)}
                  className={`${item.paymentDetails?.paymentEnabled ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{item.paymentDetails?.totalAmount || '0'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item._count?.payingUpTickets || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{calculateRevenue(item)}
                  </td>
                  <td className="px-6 py-4">
                    {item.paymentDetails?.paymentEnabled ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Enabled
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {item.paymentDetails?.paymentEnabled && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(`${window.location.origin}/app/paying-up?id=${item.id}`);
                            toast.success('Link copied to clipboard');
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Share
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleEdit(e, item)}
                        className="inline-flex  items-center text-orange-500  hover:text-orange-600 text-sm font-medium"
                        >
                        Edit
                        <Edit2 className="h-4 w-4 ml-1" />
                       
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((item) => (
          <div
            key={item.id}
            onClick={() => handleRowClick(item.id, item.paymentDetails?.paymentEnabled)}
            className={`bg-white rounded-xl border p-4 ${item.paymentDetails?.paymentEnabled ? 'cursor-pointer' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              {item.paymentDetails?.paymentEnabled ? (
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Enabled
                </span>
              ) : (
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  Disabled
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Price: </span>
                <span>₹{item.paymentDetails?.totalAmount || '0'}</span>
              </div>
              <div>
                <span className="text-gray-500">Sale: </span>
                <span>{item._count?.payingUpTickets || 0}</span>
              </div>
              <div>
                <span className="text-gray-500">Revenue: </span>
                <span>₹{calculateRevenue(item)}</span>
              </div>
              <div>
                <span className="text-gray-500">Created: </span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <div>
                <span className="text-gray-500">Updated: </span>
                <span>{formatDate(item.updatedAt)}</span>
              </div>
              <div className="col-span-2 flex justify-end space-x-3 mt-2 pt-2 border-t">
                {item.paymentDetails?.paymentEnabled && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(`${window.location.origin}/app/paying-up?id=${item.id}`);
                      toast.success('Link copied to clipboard');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Share
                  </button>
                )}
                <button 
                  onClick={(e) => handleEdit(e, item)}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600"
                >
                  Edit
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <div className="flex justify-center mt-6">
          <Pagination 
            count={Math.ceil(filteredData.length / itemsPerPage)} 
            page={page} 
            onChange={(_, value) => setPage(value)}
            size="medium"
            sx={{
              '& .MuiPaginationItem-root': {
                backgroundColor: 'rgb(249, 250, 251)',
                border: '1px solid rgb(229, 231, 235)',
                color: 'rgb(107, 114, 128)',
                '&:hover': {
                  backgroundColor: 'rgb(234, 88, 12)',
                  color: 'white',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgb(234, 88, 12)',
                  color: 'white',
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PayingUpTable; 