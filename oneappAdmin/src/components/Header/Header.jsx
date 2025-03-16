import PropTypes from 'prop-types';
// import { IoSettingsOutline } from 'react-icons/io5';

const Header = ({ title, IconComponent }) => {
  return (
    <div className="flex flex-col bg-white md:py-3 md:px-4 py-3 px-2 rounded-md">
      <div className="flex bg-[#EFF4F5] py-6 px-3 rounded-md items-center justify-between">
        <div className="flex gap-3">
          {IconComponent && <IconComponent className="md:size-8 size-5" />}
          <p className="font-poppins tracking-tight text-[16px] md:text-xl font-bold">
            {title}
          </p>
        </div>
        {/* <div className="w-8 h-8 rounded-full bg-white cursor-pointer flex items-center justify-center relative">
          <IoSettingsOutline className="size-5" />
        </div> */}
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
};

export default Header;