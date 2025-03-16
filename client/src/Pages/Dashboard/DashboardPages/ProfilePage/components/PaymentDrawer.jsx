import { useState } from "react";
import { PaymentKYCSteps } from "../../../../../utils/constants/constants";
import { Step3, Step4, Step5, Step6 } from "./StepComponents"; // Adjust the import path as necessary
import { FiCheckCircle } from "react-icons/fi";
import StepOneVerification from "./KYCVerificationForm/StepOneVerification";
import StepTwoVerification from "./KYCVerificationForm/StepTwoVerification";

const stepComponents = [StepOneVerification, StepTwoVerification, Step3, Step4, Step5, Step6];

const PaymentDrawer = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isKYCStarted, setIsKYCStarted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [digiLockerInfo, setDigiLockerInfo] = useState("");

  const handleKYCProcessStarted = () => {
    setIsKYCStarted(true);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (firstName && lastName) {
        setTimeout(() => {
          console.log("API call successful for Step One:", { firstName, lastName });
          setCurrentStep((prev) => Math.min(prev + 1, PaymentKYCSteps.length - 1)); 
        }, 1000);
      } else {
        alert("Please fill in both fields");
      }
    } else if (currentStep === 1) {
      if (digiLockerInfo) {
        setTimeout(() => {
          console.log("API call successful for Step Two:", { digiLockerInfo });
          setCurrentStep((prev) => Math.min(prev + 1, PaymentKYCSteps.length - 1));
        }, 1000);
      } else {
        alert("Please provide your DigiLocker information");
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, PaymentKYCSteps.length - 1));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const CurrentStepComponent = stepComponents[currentStep];

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 text-center">KYC Verification</h1>
      <hr className="border-gray-200 mb-4" />
      <div className="w-72 md:w-96">
        {isKYCStarted ? (
          <>
            <CurrentStepComponent
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              digiLockerInfo={digiLockerInfo}
              setDigiLockerInfo={setDigiLockerInfo}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
            />
            <div className="flex justify-between mt-4">
              {currentStep > 0 && (
                <button
                  onClick={handlePreviousStep}
                  className="bg-gray-200 text-gray-800 rounded-full text-sm px-4 py-2 transition duration-200 hover:bg-gray-300"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNextStep}
                className="bg-orange-600 text-white rounded-full text-sm px-4 py-2 transition duration-200 hover:bg-orange-700"
              >
                {currentStep < PaymentKYCSteps.length - 1 ? "Next" : "Finish"}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-6 text-gray-700 text-center">
              Simple KYC process to get you started
            </h2>
            <ul className="list-none pl-0 space-y-4">
              {PaymentKYCSteps.map((step, index) => (
                <li key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiCheckCircle className="w-5 h-5 text-orange-600 mr-3" />
                  </div>
                  <span className="text-gray-600">{`Step ${index + 1} - ${step}`}</span>
                  {index < PaymentKYCSteps.length - 1 && (
                    <div className="h-4 w-0.5 bg-gray-300 mx-2" />
                  )}
                </li>
              ))}
            </ul>
            <button
              className="bg-orange-600 text-white rounded-full text-sm p-3 mt-6 w-full transition duration-200 hover:bg-orange-700"
              onClick={handleKYCProcessStarted}
            >
              Start KYC
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentDrawer;
