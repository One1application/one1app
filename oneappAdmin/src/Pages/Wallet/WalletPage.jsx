import { FaWallet } from 'react-icons/fa'
import Header from '../../components/Header/Header'

const Wallet = () => {
  return (
    <div className="max-w-full min-h-screen md:px-5 md:py-3 px-2 py-2 bg-gradient-to-b from-gray-100 to-white space-y-3">
    <Header title="Wallet" IconComponent={FaWallet} />
  </div>
  )
}

export default Wallet
