/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, SortAsc, Mail, ChevronRight, Edit2, ArrowDown, ArrowUp } from 'lucide-react';
import  toast  from "react-hot-toast";

import Pagination from '@mui/material/Pagination';

const Table = ({ data }) => {
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

  const handleRowClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleEdit = (e, item) => {
    e.stopPropagation();
    toast('Editing: ' + item.title);
  };

  // Add sort handler
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExport = () => {
    toast('Starting export...', {
      position: "top-right",
      autoClose: 1000,
    });

    try {
      // Convert data to CSV format
      const headers = ['Title', 'Price', 'Sales', 'Revenue', 'Payment Status', 'Created At', 'Updated At'];
      const csvData = [
        headers.join(','),
        ...data.map(event => [
          event.title.replace(/,/g, ';'),
          event.price || 'N/A',
          event._count?.telegramSubscriptions || 0,
          event.revenue || 'N/A',
          (event.paymentDetails?.paymentEnabled || event.paymentEnabled) ? 'Enabled' : 'Disabled',
          `"${new Date(event.createdAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}"`,
          `"${new Date(event.updatedAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}"` 
        ].join(','))
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `table_export_${new Date().toLocaleDateString()}.csv`);
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = useMemo(() => {
    return data.filter(event => 
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.price?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.sale?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.revenue?.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return sortConfig.direction === 'asc' 
            ? priceA - priceB
            : priceB - priceA;
        case 'sales':
          const salesA = parseInt(a.sale) || 0;
          const salesB = parseInt(b.sale) || 0;
          return sortConfig.direction === 'asc'
            ? salesA - salesB
            : salesB - salesA;
        case 'revenue':
          const revenueA = parseFloat(a.revenue) || 0;
          const revenueB = parseFloat(b.revenue) || 0;
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

  const handleChangePage = (event, value) => {
    setPage(value);
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
      {/* Search and Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
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

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sale</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((event, index) => (
              <tr 
                key={index}
                onClick={() => handleRowClick(`/app/telegram?id=${event.id}`)}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-sm">
                  <div className="font-medium text-gray-900">{event.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {"variable"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {event._count?.telegramSubscriptions || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {"variable"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {event.paymentDetails?.paymentEnabled || event.paymentEnabled ? (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Enabled
                    </span>
                  ) : (
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Disabled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(event.shareLink);
                        toast.success('Link copied to clipboard');
                      }}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      Share
                    </button>
                    <button 
                      onClick={(e) => handleEdit(e, event)}
                      className="inline-flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors duration-200"
                    >
                      Edit
                      <Edit2 className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(event.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {formatDate(event.updatedAt)}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedData.map((event, index) => (
          <div
            key={index}
            onClick={() => handleRowClick(event.path)}
            className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">{event.title}</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 block">Price</span>
                <span className="font-medium text-gray-900">{event.price}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Sale</span>
                <span className="font-medium text-gray-900">{event.sale}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Revenue</span>
                <span className="font-medium text-gray-900">{event.revenue}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Payment</span>
                {event.paymentEnabled ? (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Enabled
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Disabled
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Created</span>
                <span className="font-medium text-gray-900">{formatDate(event.createdAt)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Updated</span>
                <span className="font-medium text-gray-900">{formatDate(event.updatedAt)}</span>
              </div>
              <div className="col-span-2 flex items-center space-x-4 mt-2 pt-4 border-t border-gray-100">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(event.shareLink);
                    toast.success('Link copied to clipboard');
                  }}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                >
                  Share
                </button>
                <button 
                  onClick={(e) => handleEdit(e, event)}
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors duration-200"
                >
                  Edit
                  <Edit2 className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <Pagination 
          count={Math.ceil(filteredData.length / itemsPerPage)} 
          page={page} 
          onChange={handleChangePage} 
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
                '&:hover': {
                  backgroundColor: 'rgb(194, 65, 12)',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Table;