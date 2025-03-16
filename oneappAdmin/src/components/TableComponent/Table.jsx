/* eslint-disable react/prop-types */
import { useState } from "react";
import { Search, Download, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Pagination } from "@mui/material";

const Table = ({ title, headers, data }) => {
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const rowsPerPage = 10;

  // Processed Data: Filtered and Sorted
  const processedData = data
    .filter((row) =>
      row.some((cell) =>
        (typeof cell === "string" || typeof cell === "number" ? cell : "")
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase())
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
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + rowsPerPage);

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
      ...processedData.map((row) =>
        row
          .map((cell) =>
            typeof cell === "object" && cell?.label
              ? cell.label
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
      case "Approved":
          return "text-green-600 font-bold";
      default:
        return "text-gray-600";
    }
  };

  // Toggle row expansion for mobile view
  const toggleRowExpansion = (rowIndex) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowIndex]: !prev[rowIndex],
    }));
  };

  return (
    <div className="p-4 rounded-xl max-w-full mx-auto border bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <h2 className="text-xl font-bold text-gray-800 font-poppins tracking-tight">{title}</h2>
        </div>

        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search table..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-300"
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

      {/* Desktop Table View */}
      {paginatedData.length > 0 ? (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      onClick={() => handleSort(header)}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition duration-300 group"
                    >
                      <div className="flex items-center justify-between font-poppins">
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
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          ["status", "Product Verification"].includes(headers[cellIndex].toLowerCase())
                            ? getStatusClass(cell)
                            : "text-gray-700"
                        }`}
                      >
                        {typeof cell === "object" && cell?.label ? (
                          cell.link ? (
                            <a
                              href={cell.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-500 underline"
                            >
                              {cell.label}
                            </a>
                          ) : (
                            "NIL"
                          )
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table View */}
          <div className="md:hidden space-y-4">
            {paginatedData.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="bg-white border rounded-lg shadow-sm overflow-hidden"
              >
                <div
                  onClick={() => toggleRowExpansion(rowIndex)}
                  className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                >
                  <span className="font-bold">{row[2]}</span>
                  {expandedRows[rowIndex] ? <ChevronUp /> : <ChevronDown />}
                </div>

                {expandedRows[rowIndex] && (
                  <div className="p-4">
                    {headers.map((header, cellIndex) => (
                      <div
                        key={cellIndex}
                        className="flex justify-between border-b py-2 last:border-b-0"
                      >
                        <span className="font-medium text-gray-600">{header}:</span>
                        <span
                          className={`text-right ${
                            ["status", "product verification"].includes(header.toLowerCase())
                              ? getStatusClass(row[cellIndex])
                              : "text-gray-800"
                          }`}
                        >
                          {typeof row[cellIndex] === "object" && row[cellIndex]?.label ? (
                            row[cellIndex].link ? (
                              <a
                                href={row[cellIndex].link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 underline"
                              >
                                {row[cellIndex].label}
                              </a>
                            ) : (
                              "NIL"
                            )
                          ) : (
                            row[cellIndex]
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          count={Math.ceil(processedData.length / rowsPerPage)}
          page={currentPage}
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
    </div>
  );
};

export default Table;
