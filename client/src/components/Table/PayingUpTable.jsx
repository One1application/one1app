import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Edit2,
  Filter,
  SortAsc,
  Mail,
  ArrowDown,
  ArrowUp,Copy
} from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";

const PayingUpTable = ({ data }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  console.log("Data:", data);
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.paymentDetails?.totalAmount?.toString() || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);


  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      switch (sortConfig.key) {
        case "title":
          return sortConfig.direction === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case "price":
          return sortConfig.direction === "asc"
            ? (parseFloat(a.paymentDetails?.totalAmount) || 0) -
                (parseFloat(b.paymentDetails?.totalAmount) || 0)
            : (parseFloat(b.paymentDetails?.totalAmount) || 0) -
                (parseFloat(a.paymentDetails?.totalAmount) || 0);
        case "sales":
          return sortConfig.direction === "asc"
            ? (a._count?.payingUpTickets || 0) -
                (b._count?.payingUpTickets || 0)
            : (b._count?.payingUpTickets || 0) -
                (a._count?.payingUpTickets || 0);
        case "revenue":
          return sortConfig.direction === "asc"
            ? calculateRevenue(a) - calculateRevenue(b)
            : calculateRevenue(b) - calculateRevenue(a);
        case "createdAt":
          return sortConfig.direction === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        case "updatedAt":
          return sortConfig.direction === "asc"
            ? new Date(a.updatedAt) - new Date(b.updatedAt)
            : new Date(b.updatedAt) - new Date(a.updatedAt);
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
    toast("Starting export...", { position: "top-right", autoClose: 1000 });
    try {
      const headers = [
        "Title",
        "Price",
        "Sales",
        "Revenue",
        "Coupon",
        "Payment Status",
        "Created At",
        "Updated At",
      ];
      const csvData = [
        headers.join(","),
        ...filteredData.map((item) =>
          [
            item.title.replace(/,/g, ";"),
            item.paymentDetails?.totalAmount || 0,
            item._count?.payingUpTickets || 0,
            calculateRevenue(item),
           item.discount?.map(d => d.code).join(", ") || 'OFF10',
           item.paymentDetails?.paymentEnabled ? "Enabled" : "Disabled",
            `"${new Date(item.createdAt).toLocaleString()}"`,
            `"${new Date(item.updatedAt).toLocaleString()}"`,
          ].join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute(
        "download",
        `paying_up_export_${new Date().toLocaleDateString()}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Export completed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Export failed. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error("Export error:", error);
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  };

  const renderSortButton = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <SortAsc className="h-4 w-4" />
        Sort
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
          {["title", "price", "sales", "revenue", "createdAt", "updatedAt"].map(
            (key) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                {sortConfig.key === key &&
                  (sortConfig.direction === "asc" ? (
                    <ArrowUp className="inline h-4 w-4" />
                  ) : (
                    <ArrowDown className="inline h-4 w-4" />
                  ))}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 w-full px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-xl border shadow-sm">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by title or price..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        <div className="flex gap-3">
          {renderSortButton()}
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm"
          >
            <Mail className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Title",
                  "Price",
                  "Sale",
                  "Revenue",
                  "Coupon",
                  "Payment",
                  "Actions",
                  "Created At",
                  "Updated At",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() =>
                    handleRowClick(item.id, item.paymentDetails?.paymentEnabled)
                  }
                  className={
                    item.paymentDetails?.paymentEnabled
                      ? "cursor-pointer hover:bg-gray-50"
                      : ""
                  }
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{item.paymentDetails?.totalAmount || "0"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item._count?.payingUpTickets || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    ₹{calculateRevenue(item)}
                  </td>
                   <td className="px-6 py-4 text-sm text-gray-500">
                         {
    item.discount && item.discount.length > 0 ? (
    // coupon with the highest discount percentage
    (() => {
      const highestDiscountCoupon = item.discount.reduce((max, current) => {
      
        return (current.percent > max.percent) ? current : max;
      });

      // highest discount coupon
      return (
        < div className="flex gap-2">
          <span>{highestDiscountCoupon.code}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(highestDiscountCoupon.code);
              toast.success('Coupon copied to clipboard');
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <Copy className="h-4 w-4 ml-1" />
          </button>
        </div>
      );
    })()
  ) : (
    <span>N/A</span>
  )
}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.paymentDetails?.paymentEnabled
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.paymentDetails?.paymentEnabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      {item.paymentDetails?.paymentEnabled && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              `${window.location.origin}/app/paying-up?id=${item.id}`
                            );
                            toast.success("Link copied to clipboard");
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                         <Copy className="h-4 w-4 ml-1"/>
                        </button>
                      )}
                      <button
                        onClick={(e) => handleEdit(e, item)}
                        className="inline-flex items-center text-orange-500 hover:text-orange-600 text-sm"
                      >
                         <Edit2 className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(item.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(item.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

     {/* pagination */}
    {sortedData.length > itemsPerPage && (
             <div className="flex justify-center mt-6">
               <Pagination 
                 count={Math.ceil(sortedData.length / itemsPerPage)} 
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
