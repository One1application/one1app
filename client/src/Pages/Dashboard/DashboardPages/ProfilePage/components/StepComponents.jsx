const Step1 = () => {
    return <div className="flex flex-col">
        <h1>Step 1: Basic details</h1>
        <p>We use this information to verify it with your Aadhaar and PAN details. Your oneapp account will use the same info.</p>
        <hr className="border-gray-200 mb-4" />
        <div className="w-full relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              type="text"
              value={name}
              required
              className="w-full p-2 rounded-full  cursor-not-allowed focus:outline-none border border-gray-300 focus:ring-orange-500"
            />
        </div>
        <div className="w-full relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 rounded-full cursor-not-allowed focus:outline-none border border-gray-300 focus:ring-orange-500"
            />
        </div>
    </div>;
  };
  
  // Step2.js
  const Step2 = () => {
    return <div>Step 2: Aadhaar verification with Digilocker</div>;
  };
  
  // Step3.js
  const Step3 = () => {
    return <div>Step 3: PAN card details</div>;
  };
  
  // Step4.js
  const Step4 = () => {
    return <div>Step 4: Individual or Business?</div>;
  };
  
  // Step5.js
  const Step5 = () => {
    return <div>Step 5: Take a selfie with PAN card</div>;
  };
  
  // Step6.js
  const Step6 = () => {
    return <div>Step 6: Bank details and submit bank proof</div>;
  };
  
  export { Step1, Step2, Step3, Step4, Step5, Step6 };
  