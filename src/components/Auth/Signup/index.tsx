"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate Strong Password
  const isStrongPassword = (password: string) => {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{6,}$/;
    return regex.test(password);
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isStrongPassword(formData.password)) {
      setError(
        "Password must include at least 1 uppercase letter, 1 number, 1 special character and be at least 6 characters long."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        // dispatch(loginSuccess({ user: data.user, token: data.token }))
        setTimeout(() => (window.location.href = "/verify-account"), 1000);
      }

      if (!res.ok) {
        throw new Error(data.message || "Signup failed!");
      }

      setSuccess("Account created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-11">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                Create an Account
              </h2>
              <p>Enter your details below</p>
            </div>

            <div className="mt-5.5">
              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="name" className="block mb-2.5">
                    Full Name <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    maxLength={15}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block mb-2.5">
                    Email Address <span className="text-red">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5"
                  />
                </div>

                {/* Password */}
                <div className="mb-5 relative">
                  <label htmlFor="password" className="block mb-2.5">
                    Password <span className="text-red">*</span>
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    minLength={6}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 pr-12"
                  />

                  {formData.password &&
                    !isStrongPassword(formData.password) && (
                      <p className="text-sm text-red-500 mt-1">Weak password</p>
                    )}
                  {formData.password && isStrongPassword(formData.password) && (
                    <p className="text-sm text-green-600 mt-1">
                      Strong password
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-11 translate-y-[-50%] text-gray-500 hover:text-dark mt-4"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Password must include at least:
                  <br />– 1 uppercase letter
                  <br />– 1 number
                  <br />– 1 special character
                  <br />– Minimum 6 characters
                </p>

                {/* Confirm Password */}
                <div className="mb-5.5 relative">
                  <label htmlFor="confirmPassword" className="block mb-2.5">
                    Re-type Password <span className="text-red">*</span>
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-type your password"
                    minLength={6}
                    required
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-11 translate-y-[-50%] text-gray-500 hover:text-dark mt-4"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <div className="mb-5">
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {success && (
                    <p className="text-green-500 text-center">{success}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center font-medium text-white py-3 px-6 rounded-lg duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-dark hover:bg-blue"
                  }`}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <p className="text-center mt-6">
                  Already have an account?
                  <Link
                    href="/signin"
                    className="text-dark hover:text-blue pl-2"
                  >
                    Sign in Now
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
