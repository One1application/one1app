/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { Search, Download, Filter, Table as TableIcon } from "lucide-react";
import { Pagination } from "@mui/material";
import { MdTableChart } from "react-icons/md";
import { StoreContext } from "../../context/StoreContext/StoreContext";

const TableComponent = ({
  title,
  headers,
  data = [],
  page,
  CurrentPage,
  TotalPages,
}) => {
  
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const rowsPerPage = 10;

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];
  
  // Transform data into an array of arrays
  const transformedData = safeData.map((row, idx) => [idx + 1 ,row.id, row.createdAt, row.amount, 'email', 'phone', row.productType, row.modeOfPayment, row.status]);
  // Processed Data: Filtered and Sorted
  const processedData = transformedData
    .filter((row) =>
      row.some((cell) =>
        cell.toString().toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[headers.indexOf(sortConfig.key)];
      const bValue = b[headers.indexOf(sortConfig.key)];

      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

  // Pagination: Get current page data
  const startIndex = (CurrentPage - 1) * rowsPerPage;
  const paginatedData = processedData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Handle Sorting
  const handleSort = (header) => {
    setSortConfig((prevConfig) => ({
      key: header,
      direction:
        prevConfig.key === header && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Handle Export Logic
  const handleExport = () => {
    const csvContent = [
      headers.join(","),
      ...processedData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle Pagination
  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  // Determine the status color
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "text-green-600 font-bold";
      case "pending":
        return "text-yellow-600 font-bold";
      case "failed":
        return "text-red-600 font-bold";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className=" p-4 rounded-xl max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {page === "Wallet" ? (
            <MdTableChart className="text-[#FA6E25] size-8"></MdTableChart>
          ) : (
            <TableIcon className="text-blue-600 h-8 w-8" />
          )}
          <h2
            className={`${
              page === "Wallet" ? "md:text-2xl text-xl" : "text-2xl"
            } font-bold text-gray-800 font-poppins tracking-tight`}
          >
            {title}
          </h2>
        </div>

        {/* Filter and Export Section */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search table..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10 pr-4 py-2 border border-orange-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-300"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Section */}
      {paginatedData.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-orange-500 bg-orange-300 shadow-lg">
          <table className="min-w-full divide-y divide-orange-500">
            <thead className="bg-orange-300 ">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(header)}
                    className="px-1 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-orange-200 transition duration-300 group"
                  >
                    <div className="flex items-center justify-between font-poppins ">
                      {header}
                      <Filter className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-200 font-poppins text-sm tracking-tight"
                >
                
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-1 py-4 whitespace-nowrap text-sm ${
                        headers[cellIndex].toLowerCase() === "status"
                          ? getStatusClass(cell)
                          : "text-gray-700"
                      }`}
                    >
                      {cell}
                    </td> 
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          count={TotalPages}
          page={CurrentPage}
          onChange={handlePageChange}
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

      {/* Summary Section */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <p className="font-poppins tracking-tight text-sm text-orange-500">
          Showing {paginatedData.length} of {processedData.length} filtered
          entries 
        </p>
        <p className="hidden md:block font-poppins tracking-tight text-orange-500">
          Tip: Click column headers to sort
        </p>
      </div>
    </div>
  );
};

// Default props for data
TableComponent.defaultProps = {
  data: [],
};

export default TableComponent;
