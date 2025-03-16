import Header from "../../components/Header/Header";
import TableWithActions from "../../components/TableComponent/TableWithActions";
import { BsPeopleFill } from "react-icons/bs";
import { userConfig } from "./userConfig";

const UsersPage = () => {
  const { title, buttonTitle, tableHeader, tableData } = userConfig;
  

  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="Users" IconComponent={BsPeopleFill} />
      <TableWithActions
        title={title}
        buttonTitle={buttonTitle}
        tableHeader={tableHeader}
        tableData={tableData}
      />
    </div>
  );
};

export default UsersPage;
