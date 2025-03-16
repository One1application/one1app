import React, { useState } from "react";
import { File, Image } from "lucide-react";

const CreateLockedContentPage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);

  const handleFileUpload = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log(`File uploaded: ${file.name}`);
      }
    };
    input.click();
  };

  const closeDiscountModal = () => {
    setShowDiscountModal(false);
  };

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    const discountCode = e.target.discountCode.value;
    const discountPercent = e.target.discountPercent.value;
    const expiryDate = e.target.expiryDate.value;

    if (discountPercent > 99) {
      alert("Discount Percent cannot be more than 99%");
      return;
    }

    console.log(
      `Discount Created: ${discountCode}, ${discountPercent}%, Expires on: ${expiryDate}`
    );
    closeDiscountModal();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl flex">
        <div className="w-full flex">
          <div className="w-2/3 bg-gradient-to-br from-orange-600 to-black p-8 relative overflow-hidden flex items-center justify-center rounded-l-xl">
            <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-orange-500 opacity-50" />
            <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-orange-700 opacity-50" />
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-orange-400 opacity-30" />

            <div className="bg-gray-900/90 rounded-xl p-6 backdrop-blur-sm relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white text-sm">
                  Write or Upload content you would like to sell
                </span>
                <button className="text-gray-400 hover:text-gray-300">
                  <span className="sr-only">Info</span>ⓘ
                </button>
              </div>

              <textarea
                className="w-full h-32 bg-gray-800/50 rounded-lg p-4 text-gray-300 placeholder-gray-500 resize-none mb-4"
                placeholder="Type your hidden message here"
              />

              <div className="flex gap-4 items-center justify-center">
                <button
                  onClick={() => handleFileUpload("image")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-blue-400 hover:bg-gray-800"
                >
                  <Image size={20} />
                  <span>Image</span>
                </button>
                <button
                  onClick={() => handleFileUpload("file")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 text-blue-400 hover:bg-gray-800"
                >
                  <File size={20} />
                  <span>File</span>
                </button>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                Whatever content you add in this box will only be accessible by
                visitors when they complete the payment.
              </p>
            </div>
          </div>

          <div
            className="w-1/3 bg-black p-6 overflow-y-auto h-[80vh] rounded-r-xl"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`
              .w-1\/3::-webkit-scrollbar {
                width: 0;
                height: 0;
              }
            `}</style>

            <h2 className="text-orange-500 text-2xl font-medium mb-4">
              Publish Content
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Give your content a title and a price to unlock. You can then
              publish and share it.
            </p>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-orange-500 text-sm mb-2">
                  Give your content a Title *
                  <button className="text-gray-400 hover:text-gray-300">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        className="stroke-current"
                        fill="none"
                        strokeWidth="2"
                      />
                      <text
                        x="12"
                        y="16"
                        className="text-xs"
                        textAnchor="middle"
                      >
                        i
                      </text>
                    </svg>
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="Type your title here"
                  className="w-full bg-gray-900 rounded-lg p-3 text-gray-300 placeholder-gray-600 border-0"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-orange-500 text-sm mb-2">
                  Select Category *
                  <button className="text-gray-400 hover:text-gray-300">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        className="stroke-current"
                        fill="none"
                        strokeWidth="2"
                      />
                      <text
                        x="12"
                        y="16"
                        className="text-xs"
                        textAnchor="middle"
                      >
                        i
                      </text>
                    </svg>
                  </button>
                </label>
                <select className="w-full bg-gray-900 rounded-lg p-3 text-gray-300 border-0">
                  <option value="">Select a category for your content</option>
                  <option value="finance">Finance</option>
                  <option value="education">Education</option>
                  <option value="food">Food</option>
                  <option value="jobs">Jobs</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-orange-500 text-sm mb-2">
                  Set an unlock price *
                  <button className="text-gray-400 hover:text-gray-300">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        className="stroke-current"
                        fill="none"
                        strokeWidth="2"
                      />
                      <text
                        x="12"
                        y="16"
                        className="text-xs"
                        textAnchor="middle"
                      >
                        i
                      </text>
                    </svg>
                  </button>
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-900 rounded-lg p-3 text-gray-300 border-0"
                  placeholder="Set a price visitors would pay to view this content"
                />
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full text-gray-400 text-sm text-left flex items-center justify-between mb-4"
              >
                ADVANCED SETTINGS
                <svg
                  className={`w-4 h-4 transform transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showAdvanced && (
                <div className="mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500">
                      Set expiry for your locked content
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:ring-0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                </div>
              )}

              <div className="mb-6 space-y-4">
                <h3 className="text-orange-500 text-sm">Discount Code</h3>
                <button
                  onClick={() => setShowDiscountModal(true)}
                  className="w-full py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 flex items-center justify-center gap-2"
                >
                  <span>+</span> Add Discount Code
                </button>
              </div>

              <div className="pt-4">
                <button className="w-full py-3 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600">
                  Publish Content
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-orange-500 text-lg font-medium mb-4">
              Create New Discount
            </h3>
            <form onSubmit={handleDiscountSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-400 text-sm mb-1"
                  htmlFor="discountCode"
                >
                  Discount Code
                </label>
                <input
                  id="discountCode"
                  name="discountCode"
                  type="text"
                  className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border-0"
                  placeholder="Enter discount code"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 text-sm mb-1"
                  htmlFor="discountPercent"
                >
                  Discount Percent
                </label>
                <input
                  id="discountPercent"
                  name="discountPercent"
                  type="number"
                  className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border-0"
                  placeholder="Enter discount percentage"
                  max="99"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-400 text-sm mb-1"
                  htmlFor="expiryDate"
                >
                  When does the discount expire?
                </label>
                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  className="w-full bg-gray-800 rounded-lg p-3 text-gray-300 border-0 focus:outline-none focus:ring focus:ring-orange-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={closeDiscountModal}
                  className="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateLockedContentPage;
