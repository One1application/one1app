import Header from "../../components/Header/Header";
import { HiOutlineCash } from "react-icons/hi";
import { oneLinkConfig } from "./oneLinkConfig";
import TableWithActions from "../../components/TableComponent/TableWithActions";
import { formatTableData } from "../../utils/formatter";

const UserPaymentsPage = () => {
  const { title, buttonTitle, tableHeader, tableData,config } = oneLinkConfig;

  const formattedTableData = formatTableData(tableData, config);
  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="One Link" IconComponent={HiOutlineCash} />
      <TableWithActions
        title={title}
        buttonTitle={buttonTitle}
        tableHeader={tableHeader}
        tableData={formattedTableData}
      />
    </div>
  )
}

export default UserPaymentsPage