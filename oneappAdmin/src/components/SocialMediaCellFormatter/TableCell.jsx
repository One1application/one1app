/* eslint-disable react/prop-types */
import SocialLinks from './SocialLinks';

const TableCell = ({ value, header }) => {
  if (header === 'Social Links' || header === 'One Link Profile' && Array.isArray(value)) {
    return <SocialLinks links={value} />;
  }

  return <span>{value}</span>;
};

export default TableCell;