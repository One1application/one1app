import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, Mail, ArrowDown, ArrowUp,Edit2, Copy, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";
import Pagination from '@mui/material/Pagination';
import Option from '../../Pages/Dashboard/DashboardPages/LockedContentPage/Option';

const LockedContentTable = ({ data, refreshData }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [optionPop, setOptionPop] = useState(false);
  const [page, setPage] = useState(1);
  const [selectId, setSelectId] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const itemsPerPage = 10;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // const [coupons, setCoupons] = useState(item.discount);

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

  // TODO: Update the navigation path if needed for viewing locked content details
  const handleRowClick = (id) => {
    if (id) {
      //  toast.success(id)
        setSelectId(id);
        setOptionPop(true)
        // Example: navigate(`/app/locked-content?id=${id}`);
    }
  };


  // Assuming 'purchases' or similar field exists in the _count object
  const calculateRevenue = (item) => {
    const price = parseFloat(item.unlockPrice) || 0;
    const sales = item._count?.purchases || 0; // <-- Adjust field name if needed
    return price * sales;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.unlockPrice?.toString() || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      switch (sortConfig.key) {
        case 'title':
          return sortConfig.direction === 'asc'
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'category':
          return sortConfig.direction === 'asc'
            ? (a.category || '').localeCompare(b.category || '')
            : (b.category || '').localeCompare(a.category || '');
        case 'price':
          const priceA = parseFloat(a.unlockPrice) || 0;
          const priceB = parseFloat(b.unlockPrice) || 0;
          return sortConfig.direction === 'asc'
            ? priceA - priceB
            : priceB - priceA;
        case 'sales':
          // Adjust '_count.purchases' if your data structure is different
          const salesA = a._count?.purchases || 0;
          const salesB = b._count?.purchases || 0;
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
    toast('Starting export...', {
      position: "top-right",
      autoClose: 1000,
    });

    try {
      // Convert data to CSV format
      const headers = ['Title', 'Category', 'Price', 'Sales', 'Revenue', 'Status', 'Created At', 'Updated At'];
      const csvData = [
        headers.join(','),
        ...filteredData.map(item => [
          item.title.replace(/,/g, ';'), // Replace commas
          item.category || 'N/A',
          item.unlockPrice || 0,
          item._count?.purchases || 0, // <-- Adjust field name if needed
          calculateRevenue(item),
          'Published', // Assuming all fetched items are published/active
          `"${new Date(item.createdAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}"`,
          `"${new Date(item.updatedAt).toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true})}"`
        ].join(','))
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `locked_content_export_${new Date().toLocaleDateString()}.csv`);
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
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };


  // Dropdown component for sorting
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
            onClick={() => handleSort('category')}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
          >
            Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? <><ArrowUp className="h-4 w-4 inline" /> (asc)</> : <><ArrowDown className="h-4 w-4 inline" /> (desc)</>)}
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
      {/* Search Bar with Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title, category, or price..."
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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Sales</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Coupon</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Updated At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  // onClick={() => handleRowClick(item.id)}
                  className='cursor-pointer hover:bg-gray-50' // Always clickable for viewing details
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{item.unlockPrice || '0'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item._count?.purchases || 0} {/* Adjust field name if needed */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{calculateRevenue(item)}
                  </td>
                   <td className="px-6 py-7 text-sm text-gray-500 flex gap-2">
                       {
                   item.discount.code ? (
                  <>
                <span>{item.discount.code}</span>
               <button
                 onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(item.discount.code);
                  toast.success('Coupon copied to clipboard');
                   }}
                   className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                     >
                  <Copy className="h-4 w-4 ml-1" />
               </button>
            
              </>
              ) : (
          <span>N/A</span>
                 )}
                      </td>
                  <td className="px-6 py-4">
                    {/* Assuming status is always 'Published' for items listed here */}
                    <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Published
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                     {/* TODO: Update the share link structure */}
                      <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Example share link - adjust as per your public route structure
                            const shareLink = `${window.location.origin}/app/premium-content?id=${item.id}`;
                            navigator.clipboard.writeText(shareLink);
                            toast.success('Link copied to clipboard');
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Copy className="h-4 w-4 ml-1"/>
                      </button>
                      {/* No Edit Button */}
                           <button onClick={() => handleRowClick(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium" >
        <Trash2 className="h-4 w-4 ml-1" />
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
            // onClick={() => handleRowClick(item.id)}
            className={`bg-white rounded-xl border p-4 cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900">{item.title}</h3>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Published
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Category: </span>
                <span>{item.category || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Price: </span>
                <span>₹{item.unlockPrice || '0'}</span>
              </div>
               <div>
                <span className="text-gray-500">Sales: </span>
                <span>{item._count?.purchases || 0}</span> {/* Adjust field name */}
              </div>
              <div>
                <span className="text-gray-500">Revenue: </span>
                <span>₹{calculateRevenue(item)}</span>
              </div>
               <div>
                <span className="text-gray-500">Coupon: </span>
                <span> {item.discount?.code || "No"}</span>
              </div>
              <div>
                <span className="text-gray-500">Created: </span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
               <div>
                <span className="text-gray-500">Updated: </span>
                <span>{formatDate(item.updatedAt)}</span>
              </div>
              <div className="col-span-2 flex gap-2 justify-end space-x-3 mt-2 pt-2 border-t">
                 {/* TODO: Update the share link structure */}
                 <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Example share link - adjust as per your public route structure
                       const shareLink = `${window.location.origin}/view-content/${item.id}`;
                      navigator.clipboard.writeText(shareLink);
                      toast.success('Link copied to clipboard');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Share
                </button>
                <button onClick={() => handleRowClick(item.id)} className="text-red-600 hover:text-red-700 text-sm font-medium" >
        delete
            </button>
                {/* No Edit Button */}
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
                  '&:hover': {
                      backgroundColor: 'rgb(194, 65, 12)', // Darker orange on hover
                  },
                },
              },
            }}
          />
        </div>
      )}

      {optionPop && <Option selectId={selectId} setOptionPopUp={setOptionPop} refreshData={refreshData} />}
    </div>
  );
};

export default LockedContentTable; 