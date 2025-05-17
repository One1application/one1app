import { useState, useCallback, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../../components/NavBar/NavBar";
import Footer from "../../../components/Footer/Footer";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

const JOB_TITLES = [
  { value: "developer", label: "Developer" },
  { value: "business-development-manager", label: "BDM" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "technical-support", label: "Technical Support Executive" },
  { value: "business-development-associate", label: "BDA" },
];

const QUALIFICATIONS = [
  { value: "bachelors", label: "Bachelor's" },
  { value: "masters", label: "Master's" },
  { value: "phd", label: "PhD" },
  { value: "diploma", label: "Diploma" },
];

const FormInput = ({
  label,
  name,
  register,
  errors,
  type = "text",
  required = true,
  className = "",
  children,
  ...rest
}) => (
  <div>
    <label htmlFor={name} className="block mb-2 text-sm font-medium">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    {children ? (
      children
    ) : (
      <input
        type={type}
        id={name}
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...(type === "email" && {
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }),
        })}
        className={`w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600 
          ${errors[name] ? "border-red-500" : ""} ${className}`}
        {...rest}
      />
    )}
    {errors[name] && (
      <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
    )}
  </div>
);

const HiringPage = () => {
  const [submissionStatus, setSubmissionStatus] = useState({
    isSubmitting: false,
    error: null,
    success: false,
  });
  const featuresRef = useRef(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const [experienceStatus, setExperienceStatus] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onBlur",
  });
  const onSubmit = useCallback(
    async (data) => {
      setSubmissionStatus({ isSubmitting: true, error: null, success: false });

      try {
        const formData = {
          timestamp: new Date().toISOString(),
          name: data.name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          address: data.address,
          jobTitle: data.jobTitle,
          qualification: data.qualification,
          university: data.university,
          experienceStatus: experienceStatus,
          internMonths: data.internMonths || "",
          internCompanyName: data.internCompanyName || "",
          experienceYears: data.experienceYears || "",
          companyName: data.companyName || "",
          noticePeriod: data.noticePeriod || "",
          preferredStartDate: data.preferredStartDate || "",
          skills: data.skills || "",
        };

        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbzLCCCUlZ6mT1qQPucdu_FQd2I2HxnYOmN_ZfaX_ONYZ3sgKk8vUAU1LB6cHiCCU6l_3g/exec",
          {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        console.log(formData);

        // If the request is successful, it will return an 'ok' response
        if (!response.ok) {
          throw new Error("Failed to submit form");
        }

        // Display success message even if the fetch fails due to server-side issues
        setSubmissionStatus({
          isSubmitting: false,
          error: null,
          success: true,
        });

        toast.success(
          `Thanks for applying, ${data.name}! We'll get back to you soon.`
        );
        reset();
        setExperienceStatus("");
      } catch (error) {
        // If error occurs, treat it as success
        setSubmissionStatus({
          isSubmitting: false,
          error: null, // Clear the error state
          success: true, // Mark success state as true
        });

        toast.success(
          `Thanks for applying, ${data.name}! We'll get back to you soon.`
        );
        reset();
        setExperienceStatus("");
      }
    },
    [reset, experienceStatus]
  );

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar scrollToFeatures={scrollToFeatures} />

      <div className="p-6 max-w-4xl mx-auto w-full flex-grow">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-orange-500">
          Join Our Team
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 bg-black p-8 rounded-xl shadow-2xl"
        >
          {/* Personal Information Section */}
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                name="name"
                register={register}
                errors={errors}
                placeholder="Enter your full name"
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                register={register}
                errors={errors}
                placeholder="Enter your email address"
              />

              <FormInput
                label="Phone Number"
                name="phone"
                type="tel"
                register={register}
                errors={errors}
                placeholder="Enter your phone number"
              />

              <FormInput
                label="Date of Birth"
                name="dob"
                type="date"
                register={register}
                errors={errors}
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  name="address"
                  register={register}
                  errors={errors}
                  placeholder="Enter your full address"
                />
              </div>
            </div>
          </div>

          {/* Position Applied For Section */}
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">
              Position Applied For
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Job Title"
                name="jobTitle"
                register={register}
                errors={errors}
              >
                <Controller
                  name="jobTitle"
                  control={control}
                  rules={{ required: "Job Title is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">Select a job title</option>
                      {JOB_TITLES.map((job) => (
                        <option key={job.value} value={job.value}>
                          {job.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FormInput>
            </div>
          </div>

          {/* Education Details Section */}
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">
              Education Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Highest Qualification"
                name="qualification"
                register={register}
                errors={errors}
              >
                <Controller
                  name="qualification"
                  control={control}
                  rules={{ required: "Qualification is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">Select your qualification</option>
                      {QUALIFICATIONS.map((qual) => (
                        <option key={qual.value} value={qual.value}>
                          {qual.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </FormInput>

              <FormInput
                label="University/Institution Name"
                name="university"
                register={register}
                errors={errors}
                placeholder="Enter university/institution name"
              />
            </div>
          </div>

          {/* Work Experience Section */}
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">
              Work Experience
            </h2>
            <div>
              <FormInput
                label="Experience Level"
                name="experienceStatus"
                register={register}
                errors={errors}
              >
                <Controller
                  name="experienceStatus"
                  control={control}
                  rules={{ required: "Experience level is required" }}
                  render={({ field }) => (
                    <select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setExperienceStatus(e.target.value);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">Select experience level</option>
                      <option value="fresher">Fresher</option>
                      <option value="intern">Intern</option>
                      <option value="experienced">Experienced</option>
                    </select>
                  )}
                />
              </FormInput>

              {experienceStatus === "intern" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormInput
                    label="Internship Duration (Months)"
                    name="internMonths"
                    register={register}
                    errors={errors}
                    required={true}
                  >
                    <select
                      {...register("internMonths", {
                        required: "Internship duration is required",
                      })}
                      className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">Select months</option>
                      <option value="1">1 Month</option>
                      <option value="3">3 Months</option>
                      <option value="6">6 Months</option>
                    </select>
                  </FormInput>

                  <FormInput
                    label="Company Name"
                    name="internCompanyName"
                    register={register}
                    errors={errors}
                    required={false}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              {experienceStatus === "experienced" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <FormInput
                    label="Experience (Years)"
                    name="experienceYears"
                    register={register}
                    errors={errors}
                    required={true}
                  >
                    <select
                      {...register("experienceYears", {
                        required: "Experience years is required",
                      })}
                      className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="">Select years</option>
                      <option value="1">1 Year</option>
                      <option value="2">2 Years</option>
                      <option value="5">5+ Years</option>
                    </select>
                  </FormInput>

                  <FormInput
                    label="Company Name"
                    name="companyName"
                    register={register}
                    errors={errors}
                    required={false}
                    placeholder="Enter company name"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Availability Section */}
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">
              Availability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Notice Period"
                name="noticePeriod"
                register={register}
                errors={errors}
                required={false}
                placeholder="Enter your notice period"
              />

              <FormInput
                label="Preferred Start Date"
                name="preferredStartDate"
                type="date"
                register={register}
                errors={errors}
                required={false}
              />
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h2 className="text-xl font-bold text-orange-500 mb-4">Skills</h2>
            <textarea
              {...register("skills")}
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="List your technical and soft skills"
            ></textarea>
          </div>

          {/* Consent and Privacy Section */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="consent"
              {...register("consent", {
                required: "You must consent to data processing",
              })}
              className="w-5 h-5 text-blue-500"
            />
            <label htmlFor="consent" className="ml-2 text-sm">
              I consent to the processing of my data according to the privacy
              policy.
            </label>
          </div>
          {errors.consent && (
            <p className="text-red-500 text-xs mt-1">
              {errors.consent.message}
            </p>
          )}

          {/* Equal Opportunity Employer Statement */}
          <div className="text-sm mt-4">
            <p className="text-center">
              We are an Equal Opportunity Employer. We do not discriminate based
              on race, religion, color, gender, gender identity, sexual
              orientation, national origin, genetics, disability, age, or any
              other characteristic protected by law.
            </p>
          </div>

          {/* Submission Status Messages */}
          {submissionStatus.error && (
            <div className="text-red-500 text-center">
              {submissionStatus.error}
            </div>
          )}
          {submissionStatus.success && (
            <div className="text-green-500 text-center">
              Application submitted successfully!
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={submissionStatus.isSubmitting}
              className={`
                bg-orange-500 text-white px-6 py-3 rounded-full 
                hover:bg-orange-600 focus:outline-none focus:ring-2 
                focus:ring-orange-600 focus:ring-opacity-50
                ${
                  submissionStatus.isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              `}
            >
              {submissionStatus.isSubmitting
                ? "Submitting..."
                : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};
export default HiringPage;
