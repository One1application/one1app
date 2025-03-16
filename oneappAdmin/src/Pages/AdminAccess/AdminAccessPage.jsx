import { RiAdminFill } from "react-icons/ri";
import Header from "../../components/Header/Header";
import { adminAccessConfig } from "./adminAccessConfig";
import TableWithActions from "../../components/TableComponent/TableWithActions";

const AdminAccessPage = () => {
  const { title, buttonTitle, tableHeader, tableData } = adminAccessConfig;

  console.log(tableData);
  

  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="Admin Access" IconComponent={RiAdminFill} />
      <TableWithActions
        title={title}
        buttonTitle={buttonTitle}
        tableHeader={tableHeader}
        tableData={tableData}
      />
    </div>
  );
};

export default AdminAccessPage;
