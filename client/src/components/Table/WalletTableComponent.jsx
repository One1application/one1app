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
  type,
  onPageChange,
  isLoading = false,
}) => {
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [expandedTransactionIds, setExpandedTransactionIds] = useState({});

  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];

  // Toggle Transaction ID display
  const toggleTransactionId = (idx) => {
    setExpandedTransactionIds((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Transform data for rendering
  const transformedData = safeData.map((row, idx) => {
    if (type === "transactions") {
      const transactionId = row.phonePayTransId || "-";
      const truncatedId =
        transactionId !== "-" ? `${transactionId.substring(0, 8)}...` : "-";
      return [
        idx + 1,
        {
          value: transactionId,
          truncated: truncatedId,
          index: idx, // Store index for toggling
        },
        row.amount ? ` ₹${row.amount}` : "-",
        row.amountAfterFee ? ` ₹${row.amountAfterFee}` : "-",
        row.buyer?.email || "-",
        row.buyer?.phone || "-",
        row.productType
          ? row.productType.charAt(0).toUpperCase() +
          row.productType.slice(1).toLowerCase()
          : "-",
        row.modeOfPayment || "-",
        row.status || "-",
        row.createdAt
          ? new Date(row.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "-",
      ];
    } else {
      let accountInfo = "-";
      if (row.upi && row.upi.upiId) {
        accountInfo = `UpiId: ${row.upi.upiId}`;
      } else if (row.bankDetails && row.bankDetails.accountNumber) {
        accountInfo = `Acc No: ${row.bankDetails.accountNumber}`;
      }
      let accountName = "-";
      if (row.upi && row.upi.bankDetails?.accountHolderName) {
        accountName = row.upi.bankDetails.accountHolderName;
      } else if (row.bankDetails && row.bankDetails.accountHolderName) {
        accountName = row.bankDetails.accountHolderName;
      }
      return [
        idx + 1,
        accountName,
        accountInfo,
        row.modeOfWithdrawal
          ? row.modeOfWithdrawal.charAt(0).toUpperCase() +
          row.modeOfWithdrawal.slice(1).toLowerCase()
          : "-",
        row.amount ? ` ₹${row.amount}` : "-",
        row.status || "-",
        row.createdAt
          ? new Date(row.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          : "-",
      ];
    }
  });

  // Processed Data: Filtered and Sorted
  const processedData = transformedData
    .filter((row) =>
      row.some((cell) => {
        // Handle object cells (e.g., transactionId { value, truncated })
        const cellValue =
          typeof cell === "object" && cell !== null && "value" in cell
            ? cell.value
            : cell;
        return cellValue.toString().toLowerCase().includes(filterText.toLowerCase());
      })
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const key = sortConfig.key;
      // Use index-based access for sort key
      const aValue =
        typeof a[key] === "object" && a[key] !== null && "value" in a[key]
          ? a[key].value
          : a[key] || "";
      const bValue =
        typeof b[key] === "object" && b[key] !== null && "value" in b[key]
          ? b[key].value
          : b[key] || "";
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });

  // Pagination: Get current page data
  const paginatedData = processedData;

  // Handle Sorting
  const handleSort = (headerIndex) => {
    setSortConfig((prevConfig) => ({
      key: headerIndex,
      direction:
        prevConfig.key === headerIndex && prevConfig.direction === "ascending"
          ? "descending"
          : "ascending",
    }));
  };

  // Handle Export Logic
  const handleExport = () => {
    const csvContent = [
      headers.join(","),
      ...processedData.map((row) =>
        row
          .map((cell) =>
            typeof cell === "object" && cell !== null && "value" in cell
              ? cell.value
              : cell
          )
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Render cell content safely
  const renderCell = (cell, cellIndex, rowIndex) => {
    const isStatusColumn =
      cellIndex === headers.length - 2 || cellIndex === headers.length - 1;

    // Handle transactionId object
    if (
      type === "transactions" &&
      cellIndex === 1 &&
      typeof cell === "object" &&
      cell !== null &&
      "value" in cell &&
      "truncated" in cell
    ) {
      const isExpanded = expandedTransactionIds[cell.index];
      return (
        <span
          className="cursor-pointer hover:underline"
          onClick={() => toggleTransactionId(cell.index)}
        >
          {isExpanded ? cell.value : cell.truncated}
        </span>
      );
    }

    // Handle status column
    if (isStatusColumn) {
      return (
        <span
          className={`px-2 py-1 rounded text-xs ${cell === "COMPLETED" || cell === "SUCCESS"
              ? "bg-green-100 text-green-800"
              : cell === "FAILED" || cell === "FAILURE"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {cell}
        </span>
      );
    }

    // Default case: render cell as is
    return cell;
  };

  return (
    <div className="p-4 rounded-xl max-w-full mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          {page === "Wallet" ? (
            <MdTableChart className="text-[#FA6E25] size-8" />
          ) : (
            <TableIcon className="text-blue-600 h-8 w-8" />
          )}
          <h2
            className={`${page === "Wallet" ? "md:text-2xl text-xl" : "text-2xl"
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
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-orange-500 shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-orange-500 text-sm font-medium">Loading data...</p>
        </div>
      ) : paginatedData.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-orange-500 bg-orange-300 shadow-lg">
          <table className="min-w-full divide-y divide-orange-500">
            <thead className="bg-orange-300">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(index)}
                    className="px-1 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-orange-200 transition duration-300 group"
                  >
                    <div className="flex items-center justify-between font-poppins">
                      <div className="text-center w-full">{header}</div>
                      <Filter className="h-4 w-4 sm:h-6 sm:w-6 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
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
                      className={`px-3 py-4 whitespace-nowrap text-sm text-center ${headers[cellIndex] === "Status"
                          ? "hidden sm:table-cell"
                          : "text-gray-700"
                        }`}
                    >
                      {renderCell(cell, cellIndex, rowIndex)}
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
          onChange={(_, page) => {
            console.log("Changing to page:", page);
            if (typeof onPageChange === "function") {
              onPageChange(page);
            }
          }}
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
          Showing {paginatedData.length} of {processedData.length} filtered entries
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