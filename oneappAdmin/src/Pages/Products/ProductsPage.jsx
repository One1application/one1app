import Header from "../../components/Header/Header";
import { FaBoxOpen } from "react-icons/fa";
import { productConfig } from './productConfig';
import Table from "../../components/TableComponent/Table";

const ProductsPage = () => {
  
  const { title, tableHeader, tableData  } = productConfig;
  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
      <Header title="Products" IconComponent={FaBoxOpen} />
      <Table
        title={title}
        headers={tableHeader}
        data={tableData}
      />
    </div>
  );
};

export default ProductsPage;
