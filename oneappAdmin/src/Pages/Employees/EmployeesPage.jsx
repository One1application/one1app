import Header from "../../components/Header/Header";
import TableWithActions from "../../components/TableComponent/TableWithActions";
import { employeeConfig } from "./employeeConfig";
import { BsPeopleFill } from "react-icons/bs";

const EmployeesPage = () => {
  const { title, buttonTitle, tableHeader, tableData } = employeeConfig;
  

  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="Employees" IconComponent={BsPeopleFill} />
      <TableWithActions
        title={title}
        buttonTitle={buttonTitle}
        tableHeader={tableHeader}
        tableData={tableData}
      />
    </div>
  );
};

export default EmployeesPage;
