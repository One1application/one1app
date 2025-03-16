/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Clock, MapPin, User, Phone, ArrowLeft, ArrowRight, Plus, Trash2, Loader2, Save } from 'lucide-react';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${ampm}`;
});

const LOCATIONS = [
  { id: 1, name: 'Main Office', address: '123 Business Street, Suite 100' },
  { id: 2, name: 'Downtown Branch', address: '456 City Center Ave' },
  { id: 3, name: 'Virtual Meeting', address: 'Zoom/Google Meet' },
];

const AppointementPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [virtualLink, setVirtualLink] = useState('');


  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
  });

  const [schedule, setSchedule] = useState(
    DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: []
    }), {})
  );

  const [selectedLocation, setSelectedLocation] = useState('');

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addTimeSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: [...prev[day], { start: '', end: '' }]
    }));
  };

  const removeTimeSlot = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const validate = () => {
    // Step 1: Personal Information Validation
    if (currentStep === 1) {
      if (!personalInfo.name.trim()) {
        setStatus({ type: 'error', message: 'Please enter your full name.' });
        return false;
      }
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(personalInfo.phone)) {
        setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number.' });
        return false;
      }
    }

    // Step 2: Availability Validation
    if (currentStep === 2) {
      for (let day of DAYS_OF_WEEK) {
        const slots = schedule[day];
        for (let slot of slots) {
          if (!slot.start || !slot.end) {
            setStatus({ type: 'error', message: 'Please select both start and end time for each slot.' });
            return false;
          }
          // Optionally, you can add additional validation for start/end time logic, e.g., end time > start time
        }
      }
    }

    // Step 3: Location Validation
    if (currentStep === 3) {
      if (!selectedLocation) {
        setStatus({ type: 'error', message: 'Please select a location.' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // Validate form fields
    if (!validate()) {
      setIsSubmitting(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus({
        type: 'success',
        message: 'Successfully saved!'
      });
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={personalInfo.name}
                  onChange={handlePersonalInfoChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div className="relative">
                <Phone className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                  placeholder="Phone Number"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Set Your Availability</h2>
            <div className="space-y-6">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">{day}</h3>
                    <button
                      type="button"
                      onClick={() => addTimeSlot(day)}
                      className="flex items-center text-sm text-orange-600 hover:text-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </button>
                  </div>
                  
                  {schedule[day].length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No time slots added</p>
                  ) : (
                    <div className="space-y-3">
                      {schedule[day].map((slot, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1 flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <select
                              value={slot.start}
                              onChange={(e) => updateTimeSlot(day, index, 'start', e.target.value)}
                              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              required
                            >
                              <option value="">Start Time</option>
                              {TIME_SLOTS.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                            <span className="text-gray-500">to</span>
                            <select
                              value={slot.end}
                              onChange={(e) => updateTimeSlot(day, index, 'end', e.target.value)}
                              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                              required
                            >
                              <option value="">End Time</option>
                              {TIME_SLOTS.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(day, index)}
                            className="p-2 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

        case 3:
          return (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Select Location</h2>
              <div className="space-y-4">
                {LOCATIONS.map((location) => (
                  <label
                    key={location.id}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedLocation === location.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={location.id}
                      checked={selectedLocation === location.id}
                      onChange={() => setSelectedLocation(location.id)}
                      className="hidden"
                    />
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div className="ml-3">
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">{location.address}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
        
              {/* Show the link input if 'Virtual Meeting' is selected */}
              {selectedLocation === 3 && (
                <div className="mt-4">
                  <label htmlFor="virtualLink" className="block text-sm font-medium text-gray-700">
                    Enter Virtual Meeting Link
                  </label>
                  <input
                    type="url"
                    id="virtualLink"
                    name="virtualLink"
                    placeholder="Enter Zoom/Google Meet link"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    onChange={(e) => setVirtualLink(e.target.value)} // Assuming you have a state for the link
                    required
                  />
                </div>
              )}
            </div>
          );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="w-full bg-gradient-to-r from-orange-600 to-orange-400 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Set Your Availability'}
            {currentStep === 3 && 'Choose Location'}
          </h1>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 rounded-full flex-1 ${
                  step <= currentStep ? 'bg-white' : 'bg-orange-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {status.message && (
          <div className={`mb-6 p-4 rounded-lg ${
            status.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderStep()}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto flex items-center bg-orange-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  {currentStep < 3 ? (
                    <>
                      Next
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Complete Booking
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointementPage;
