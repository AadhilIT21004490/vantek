import { RootState, AppDispatch } from "@/redux/store";
import { ChevronDown } from "lucide-react";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const Billing = ({
  formValues,
  setFormValues,
  isUk,
  setIsUk,
}: {
  formValues: any;
  setFormValues: (data: any) => void;
  isUk: boolean;
  setIsUk: (val: boolean) => void;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [showOutsideUKNotice, setShowOutsideUKNotice] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name === "countryName") {
      setIsUk(value !== "OutsideUK");
      if (value === "OutsideUK") {
        setShowOutsideUKNotice(true);
      }
    }
  };

  // If address exists and is an array with at least one address
  const userAddress = Array.isArray(user?.address) ? user?.address?.[0] : null;

  useEffect(() => {
    if (user) {
      // Base form values with user name/email
      let initialForm: any = {
        name: user?.name || "",
        email: user?.email || "",
      };

      if (userAddress) {
        initialForm = {
          ...initialForm,
          phone: userAddress.phone || "",
          address: userAddress.street || "",
          addressTwo: userAddress.apartment || "",
          houseNumber: userAddress.houseNumber || "",
          town: userAddress.city || "",
          province: userAddress.province || "",
          zipCode: userAddress.zipCode || "",
          countryName:
            userAddress.country === "England" ||
            userAddress.country === "Scotland" ||
            userAddress.country === "Wales" ||
            userAddress.country === "Northern Ireland"
              ? userAddress.country
              : "OutsideUK",
          country:
            userAddress.country !== "England" &&
            userAddress.country !== "Scotland" &&
            userAddress.country !== "Wales" &&
            userAddress.country !== "Northern Ireland"
              ? userAddress.country
              : "",
        };

        // Set initial UK status based on country
        setIsUk(initialForm.countryName !== "OutsideUK");
      }

      setFormValues((prev: any) => ({
        ...initialForm,
        ...prev,
      }));
    }
  }, [user]);

  return (
    <form className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        {/* Full Name */}
        <div className="w-full">
          <label htmlFor="name" className="block mb-2.5">
            Full Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            readOnly
            value={user?.name}
            onChange={handleChange}
            placeholder="John"
            className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
          />
        </div>

        {/* Country / Region (UK selector) */}
        <div className="w-full">
          <label htmlFor="countryName" className="block mb-2.5">
            Country / Region <span className="text-red">*</span>
          </label>
          <div className="relative">
            <select
              required
              id="countryName"
              name="countryName"
              value={formValues.countryName}
              onChange={handleChange}
              className="w-full appearance-none rounded-md border border-gray-3 bg-gray-1 px-5 py-3 pr-9"
            >
              <option value="England">England</option>
              <option value="Scotland">Scotland</option>
              <option value="Wales">Wales</option>
              <option value="Northern Ireland">Northern Ireland</option>
              <option value="OutsideUK">Outside the UK</option>
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown />
            </span>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="mb-5">
        <label htmlFor="email" className="block mb-2.5">
          Email Address <span className="text-red">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          readOnly
          value={user?.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* Street Address */}
      <div className="mb-5">
        <label htmlFor="address" className="block mb-2.5">
          Street Address <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          required
          value={formValues.address}
          onChange={handleChange}
          placeholder="House number and street name"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
        <input
          type="text"
          id="addressTwo"
          name="addressTwo"
          value={formValues.addressTwo}
          onChange={handleChange}
          placeholder="Apartment, suite, unit, etc. (optional)"
          className="mt-5 w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* House Number */}
      <div className="mb-5">
        <label htmlFor="houseNumber" className="block mb-2.5">
          House Number <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="houseNumber"
          name="houseNumber"
          required
          value={formValues.houseNumber || ""}
          onChange={handleChange}
          placeholder="e.g., 79"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
        />
      </div>

      {/* Town / City */}
      <div className="mb-5">
        <label htmlFor="town" className="block mb-2.5">
          Town / City <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="town"
          name="town"
          required
          value={formValues.town}
          onChange={handleChange}
          placeholder="Your city"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* Country (only when non-UK) */}
      {!isUk && (
        <div className="mb-5">
          <label htmlFor="country" className="block mb-2.5">
            Country Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            required
            value={formValues.country}
            onChange={handleChange}
            placeholder="Your country"
            className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
          />
        </div>
      )}

      {/* Phone */}
      <div className="mb-5">
        <label htmlFor="phone" className="block mb-2.5">
          Phone <span className="text-red">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formValues.phone}
          onChange={handleChange}
          placeholder="+1 234 567 890"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* ZIP Code */}
      <div className="mb-5">
        <label htmlFor="zipCode" className="block mb-2.5">
          Postcode / ZIP <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          required
          value={formValues.zipCode}
          onChange={handleChange}
          placeholder="BS1 2AA"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {/* Province */}
      <div className="mb-5">
        <label htmlFor="province" className="block mb-2.5">
          Province <span className="text-red">*</span>
        </label>
        <input
          type="text"
          id="province"
          name="province"
          required
          value={formValues.province}
          onChange={handleChange}
          placeholder="Avon"
          className="w-full rounded-md border border-gray-3 bg-gray-1 px-5 py-2.5"
        />
      </div>

      {showOutsideUKNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-md w-[90%] p-6 rounded-lg shadow-2xl text-center">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            <p className="text-gray-700 mb-6">
              As your delivery address is outside the UK, the seller will reach
              out to you to discuss the applicable delivery fees. At this time,
              you may proceed with payment for the total product amount. Thank
              you for your understanding.
            </p>
            <button
              onClick={() => setShowOutsideUKNotice(false)}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default Billing;
