/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

const StepTwoVerification = ({ onNext, digiLockerInfo, setDigiLockerInfo }) => {
    const handleNextClick = () => {
      if (digiLockerInfo) {
        setTimeout(() => {
          console.log("API call successful for Step Two:", { digiLockerInfo });
          onNext();
        }, 1000);
      } else {
        alert("Please provide your DigiLocker information");
      }
    };
  
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-lg font-semibold text-center">Step 2: DigiLocker Integration</h1>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Please provide your DigiLocker information.
        </p>
        <hr className="border-gray-200 mb-4" />
  
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">DigiLocker Info</label>
            <input
              type="text"
              value={digiLockerInfo}
              onChange={(e) => setDigiLockerInfo(e.target.value)}
              required
              className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default StepTwoVerification;
  