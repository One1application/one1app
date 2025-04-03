/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Mail,
  ChevronRight,
  Phone,
  DollarSign,
  List,
  ShoppingCart,
  Check,
  IndianRupee,
} from "lucide-react";
import  toast  from "react-hot-toast";
import Pagination from "@mui/material/Pagination";

const AudienceTableComponent = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // State for sorting and dropdown visibility
  const [sortDirection, setSortDirection] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Reference for clicking outside
  const dropdownRef = useState(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRowClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleExport = () => {
    toast('Starting export...', {
      position: "top-right",
      autoClose: 1000,
    });

    try {
      // Convert data to CSV format
      const headers = ['Customer Name', 'Email', 'Phone Number', 'Purchased Products', 'Amount Spent', 'Active Subscriptions'];
      const csvData = [
        headers.join(','),
        ...data.map(item => [
          item.name.replace(/,/g, ';'),
          item.email.replace(/,/g, ';'),
          item.phone,
          item.purchasedProducts.join(';'),
          item.amountSpent,
          item.activeSubscriptions
        ].join(','))
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `audience_export_${new Date().toLocaleDateString()}.csv`);
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

  const sortOptions = [
    { id: 'alphabetical', label: 'Name (A to Z)', icon: <ArrowUpDown className="h-4 w-4" /> },
    { id: 'amountAsc', label: 'Amount (Low to High)', icon: <IndianRupee className="h-4 w-4" /> },
    { id: 'amountDesc', label: 'Amount (High to Low)', icon: <IndianRupee className="h-4 w-4" /> },
  ];

  // Filter and sort data
  const filteredData = useMemo(() => {
    return data.filter(
      (event) =>
        event.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.phone?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.amountSpent?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.activeSubscriptions?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    if (sortDirection === "alphabetical") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortDirection === "amountAsc") {
      sorted.sort((a, b) => a.amountSpent - b.amountSpent);
    } else if (sortDirection === "amountDesc") {
      sorted.sort((a, b) => b.amountSpent - a.amountSpent);
    }
    return sorted;
  }, [filteredData, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, page]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleSortChange = (direction) => {
    setSortDirection(direction);
    setDropdownOpen(false);
  };

  return (
    <div className="space-y-4 w-full px-4 sm:px-6 lg:px-8">
      {/* Search and Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg border">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Improved Filter Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center justify-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors duration-200 ${
                dropdownOpen
                  ? "bg-gray-100 text-gray-900 border-gray-300"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Sort by</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSortChange(option.id)}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <span className="flex items-center flex-1">
                        {option.icon}
                        <span className="ml-3">{option.label}</span>
                      </span>
                      {sortDirection === option.id && (
                        <Check className="h-4 w-4 text-orange-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleExport}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors duration-200"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y-0 divide-gray-200">
          <thead className="bg-orange-300">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Purchased Products
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount Spent (in Rupees)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Subscriptions
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y-0 divide-gray-200">
            {paginatedData.map((event, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(event.path)}
                className="cursor-pointer transform transition-all duration-200  mb-3"
              >
                <td className="bg-white   px-4 py-4 text-sm">
                  <div className="font-medium text-gray-900">{event.name}</div>
                </td>
                <td className="bg-white border-t border-b px-4 py-4 text-sm text-gray-500">
                  {event.email}
                </td>
                <td className="bg-white border-t border-b px-4 py-4 text-sm text-gray-500">
                  {event.phone}
                </td>
                <td className="bg-white border-t border-b px-4 py-4 text-sm text-gray-500">
                  {event.purchasedProducts.join(", ")}
                </td>
                <td className="bg-white border-t border-b px-4 py-4 text-sm text-gray-500">
                  {event.amountSpent}
                </td>
                <td className="bg-white border  px-4 py-4 text-sm">
                  {event.activeSubscriptions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="block md:hidden">
        {paginatedData.map((event, index) => (
          <div
            key={index}
            onClick={() => handleRowClick(event.path)}
            className="border rounded-lg mb-4 bg-white p-4 shadow-md cursor-pointer transform transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900 text-lg">{event.name}</h3>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="text-gray-500 h-4 w-4" />
                <span className="text-gray-500">Email:</span>
                <span className="font-medium">{event.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-gray-500 h-4 w-4" />
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium">{event.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-gray-500 h-4 w-4" />
                <span className="text-gray-500">Purchased Products:</span>
                <span className="font-medium">
                  {event.purchasedProducts.join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="text-gray-500 h-4 w-4" />
                <span className="text-gray-500">Amount Spent:</span>
                <span className="font-medium">{event.amountSpent}</span>
              </div>
              <div className="flex items-center gap-2">
                <List className="text-gray-500 h-4 w-4" />
                <span className="text-gray-500">Active Subscriptions:</span>
                <span className="font-medium">{event.activeSubscriptions}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={Math.ceil(sortedData.length / itemsPerPage)}
          page={page}
          onChange={handleChangePage}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              backgroundColor: "rgb(212 212 212)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgb(234, 88, 12)",
              },
              "&.Mui-selected": {
                backgroundColor: "rgb(234, 88, 12)",
                color: "#fff",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AudienceTableComponent;