/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Search,
  Download,
  Filter,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { Pagination } from "@mui/material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TableCell from '../SocialMediaCellFormatter/TableCell';


const TableWithActions = ({ title, buttonTitle, tableHeader, tableData }) => {
  const [filterText, setFilterText] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(tableData);
  const [modalOpen, setModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editRowIndex, setEditRowIndex] = useState(null);
  const [editRowData, setEditRowData] = useState({});
  const [newRowData, setNewRowData] = useState(tableHeader.map(() => ""));
  const rowsPerPage = 10;

  // Processed Data: Filtered and Sorted
  const processedData = data
    .filter((row) =>
      row.some((cell) => {
        if (Array.isArray(cell)) {
          // Handle social links array
          return cell.some(social => 
            social.platform.toLowerCase().includes(filterText.toLowerCase()) ||
            social.link.toLowerCase().includes(filterText.toLowerCase())
          );
        }
        return cell.toString().toLowerCase().includes(filterText.toLowerCase());
      })
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const columnIndex = tableHeader.indexOf(sortConfig.key);
      const aValue = a[columnIndex];
      const bValue = b[columnIndex];

      // Skip sorting for social links
      if (Array.isArray(aValue) || Array.isArray(bValue)) return 0;

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
    const processDataForExport = (data) => {
      return data.map(row => 
        row.map(cell => {
          if (Array.isArray(cell)) {
            // Convert social links array to string
            return cell.map(social => `${social.platform}: ${social.link}`).join('; ');
          }
          return cell;
        })
      );
    };

    const csvContent = [
      tableHeader.join(","),
      ...processDataForExport(processedData).map((row) => row.join(",")),
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

  // Handle Delete Row
  const handleDelete = () => {
    setData((prevData) => prevData.filter((_, index) => index !== rowToDelete));
    setDeleteModalOpen(false);
    setRowToDelete(null);
  };

  const confirmDelete = (rowIndex) => {
    setRowToDelete(rowIndex);
    setDeleteModalOpen(true);
  };

  // Handle Edit Row
  const handleEdit = (rowIndex) => {
    setEditRowIndex(rowIndex);
    setEditRowData(data[rowIndex]);
    setModalOpen(true);
  };

  // Save Edit
  const saveEdit = () => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[editRowIndex] = editRowData;
      return newData;
    });
    setModalOpen(false);
  };

  // Handle Add New Row
  const handleAddNewRow = () => {
    setData((prevData) => [...prevData, newRowData]);
    setAddModalOpen(false);
    setNewRowData(tableHeader.map(() => ""));
  };

  // Render input field based on header type
  const renderInputField = (header, value, onChange) => {
    if (header === 'Social Links') {
      return (
        <div className="space-y-2">
          {Array.isArray(value) ? value.map((social, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                placeholder="Platform"
                value={social.platform || ''}
                onChange={(e) => {
                  const newValue = [...value];
                  newValue[idx] = { ...newValue[idx], platform: e.target.value };
                  onChange(newValue);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              />
              <input
                type="text"
                placeholder="Link"
                value={social.link || ''}
                onChange={(e) => {
                  const newValue = [...value];
                  newValue[idx] = { ...newValue[idx], link: e.target.value };
                  onChange(newValue);
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 w-1/2"
              />
            </div>
          )) : null}
          <button
            onClick={() => onChange([...(value || []), { platform: '', link: '' }])}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            + Add Social Link
          </button>
        </div>
      );
    }

    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    );
  };

  return (
    <div className="p-4 rounded-xl w-full mx-auto border bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <h2 className="text-xl font-bold text-gray-800 font-poppins tracking-tight w-full text-center md:text-left">
          {title}
        </h2>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full">
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
          <div className="flex flex-row space-x-4 justify-center">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">{buttonTitle}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {paginatedData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {tableHeader.map((header, index) => (
                  <th
                    key={index}
                    onClick={() => handleSort(header)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition duration-300 group"
                  >
                    <div className="flex items-center justify-between font-poppins">
                      {header}
                      <Filter className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors duration-200 font-poppins text-sm tracking-tight"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-4 text-gray-700 whitespace-nowrap">
                      <TableCell value={cell} header={tableHeader[cellIndex]} />
                    </td>
                  ))}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-4">
                    <button
                      onClick={() => handleEdit(rowIndex)}
                      className="text-green-500 hover:text-green-700"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => confirmDelete(rowIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No data available</p>
          </div>
        )}
      </div>

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

      {/* Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Edit Row</h2>
          {tableHeader.map((header, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {header}
              </label>
              {renderInputField(header, editRowData[index], (value) => {
                setEditRowData((prevData) => {
                  const updatedData = [...prevData];
                  updatedData[index] = value;
                  return updatedData;
                });
              })}
            </div>
          ))}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={saveEdit}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Save
            </button>
          </div>
        </Box>
      </Modal>

      {/* Add New Row Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Add New Row</h2>
          {tableHeader.map((header, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {header}
              </label>
              {renderInputField(header, newRowData[index], (value) => {
                setNewRowData((prevData) => {
                  const updatedData = [...prevData];
                  updatedData[index] = value;
                  return updatedData;
                });
              })}
            </div>
          ))}
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setAddModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNewRow}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              Add
            </button>
          </div>
        </Box>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
          <p>Are you sure you want to delete this row? This action cannot be undone.</p>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TableWithActions;