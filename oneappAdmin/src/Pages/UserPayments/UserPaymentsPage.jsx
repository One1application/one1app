import Header from "../../components/Header/Header";
import { HiOutlineCash } from "react-icons/hi";
import Table from "../../components/TableComponent/Table";
import { userPaymentConfig } from "./userPaymentConfig";
import { formatTableData } from "../../utils/formatter";



const UserPaymentsPage = () => {
  const { title, tableHeader, tableData,config } = userPaymentConfig;

  const formattedTableData = formatTableData(tableData, config);
  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="User Payments" IconComponent={HiOutlineCash} />
      <Table title={title} headers={tableHeader} data={formattedTableData}/>
    </div>
  )
}

export default UserPaymentsPage