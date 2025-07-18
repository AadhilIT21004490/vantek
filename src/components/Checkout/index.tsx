"use client";
import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import ShippingMethod from "./ShippingMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { removeAllItemsFromCart } from "@/redux/features/cart-slice";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { updateUserAddress } from "@/redux/features/authSlice";
import { formatToEuro } from "@/helper/formatCurrencyToEuro";
import { toast } from "sonner";

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const internalOrderIdRef = useRef("");
  const orderDataRef = useRef(null);
  const cart = useSelector((state: RootState) => state.cartReducer);
  const user = useSelector((state: RootState) => state.auth.user);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [isUk, setIsUk] = useState(
    user?.address?.[0]?.country === "OutsideUK" ? false : true
  ); // Assume true by default (UK shipping)
  const [couponCode, setCouponCode] = useState("");
  const [couponStatus, setCouponStatus] = React.useState(null); // for success/error message
  const [couponPercentage, setCouponPercentage] = React.useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = React.useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const totalAmount = cart.totalPrice;
  const [billingData, setBillingData] = useState({
    firstName: "",
    email: "",
    houseNumber: "",
    address: "",
    addressTwo: "",
    town: "",
    countryName: "England",
    country: "",
    phone: "",
    zipCode: "",
    province: "",
  });

  const handleCouponApply = async (code) => {
    setCouponCode(code);
    setCouponStatus(null);
    setCouponPercentage(0);

    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "production"
            ? process.env.NEXT_PUBLIC_BASEURL
            : process.env.NEXT_PUBLIC_BASEURL_LOCAL
        }/coupon/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            userId: user._id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCouponStatus("Coupon applied successfully!");
        setCouponPercentage(data.percentage);
        setAppliedCouponCode(data.couponCode);
        // toast.success("Coupon applied successfully!");
      } else if (data.error) {
      } else {
        setCouponStatus(data.message || "Failed to apply coupon");
        // toast.error(data.message || "Failed to apply coupon");
      }
    } catch (error) {
      setCouponStatus("Error validating coupon");
    }
  };

  const {
    country,
    firstName,
    email,
    addressTwo,
    ...billingDataWithoutUnwantedItems
  } = billingData;

  const isBillingDataValid = Object.values(
    billingDataWithoutUnwantedItems
  ).every((value) => value && value.trim() !== "");

  useEffect(() => {
    let fee = 0;
    if (isUk && totalAmount < 150) {
      if (shippingMethod === "express") {
        fee = 8.5;
      } else if (shippingMethod === "standard") {
        fee = 4.5;
      }
    }
    setShippingFee(fee);
  }, [shippingMethod, isUk, totalAmount]);

  useEffect(() => {
    if (user && user.address && user.address.length > 0) {
      setBillingData({
        firstName: user.name,
        email: user.email,
        houseNumber: user.address[0].houseNumber,
        address: user.address[0].street,
        addressTwo: user.address[0].apartment,
        town: user.address[0].city,
        countryName:
          user.address[0].country !== "England" ||
          user.address[0].country !== "Scotland" ||
          user.address[0].country !== "Wales" ||
          user.address[0].country !== "Northern Ireland"
            ? "OutsideUK"
            : user.address[0].country,
        country: user.address[0].country,
        phone: user.address[0].phone,
        zipCode: user.address[0].zipCode,
        province: user.address[0].province,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
    }
  }, [user, router]);

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
        currency: "GBP",
        disableFunding: "card,credit",
      }}
    >
      <>
        <Breadcrumb title={"Checkout"} pages={["checkout"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
            <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
              Billing details
            </h2>
            <form>
              <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
                {/* <!-- checkout left --> */}
                <div className="lg:max-w-[670px] w-full">
                  {/* <!-- login box --> */}
                  {/* <Login /> */}

                  {/* <!-- billing details --> */}
                  <Billing
                    formValues={billingData}
                    setFormValues={setBillingData}
                    isUk={isUk}
                    setIsUk={setIsUk}
                  />

                  {/* <!-- address box two --> */}
                  {/* <Shipping /> */}

                  {/* <!-- others note box --> */}
                  <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                    <div>
                      <label htmlFor="notes" className="block mb-2.5">
                        Other Notes (optional)
                      </label>

                      <textarea
                        name="notes"
                        id="notes"
                        value={deliveryNote}
                        onChange={(e) => setDeliveryNote(e.target.value)}
                        rows={5}
                        placeholder="Notes about your order, e.g. speacial notes for delivery."
                        className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* // <!-- checkout right --> */}
                <div className="max-w-[455px] w-full">
                  {/* <!-- shipping box --> */}
                  <ShippingMethod
                    isUk={isUk}
                    totalAmount={totalAmount}
                    shippingMethod={shippingMethod}
                    setShippingMethod={setShippingMethod}
                  />

                  {/* <!-- order list box --> */}
                  <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
                    <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                      <h3 className="font-medium text-xl text-dark">
                        Your Order
                      </h3>
                    </div>

                    <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                      {/* <!-- title --> */}
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <h4 className="font-medium text-dark">Product</h4>
                        </div>
                        <div>
                          <h4 className="font-medium text-dark text-right">
                            Subtotal
                          </h4>
                        </div>
                      </div>

                      {/* <!-- product items dynamically --> */}
                      {cart.items.map((item) => (
                        <div
                          key={`${item._id}-${item.variantId}`}
                          className="flex items-center justify-between py-5 border-b border-gray-3"
                        >
                          <div className="flex items-start gap-2">
                            {item.images && (
                              <Image
                                src={item.images}
                                alt={item.name}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                            )}
                            <div className="flex flex-col">
                              <p className="text-dark line-clamp-2 text-sm sm:text-base">
                                {item.name}
                              </p>
                              <span className="text-dark-5 text-xs">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-dark text-right text-sm sm:text-base">
                              {formatToEuro(item.actualPrice * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* <!-- shipping fee --> */}
                      <div className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">Shipping Fee</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">
                            {formatToEuro(parseFloat(shippingFee.toFixed(2))) ||
                              "0.00"}
                          </p>
                        </div>
                      </div>

                      {/* <!-- IF Coupon applied --> */}
                      {appliedCouponCode !== "" && (
                        <>
                          <div className="flex items-center justify-between py-5 border-b border-gray-3">
                            <div>
                              <p className="text-green">Applied Coupon Code</p>
                            </div>
                            <div>
                              <p className="text-green text-right">
                                {appliedCouponCode}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-5 border-b border-gray-3">
                            <div>
                              <p className="text-green">Discount Percentage</p>
                            </div>
                            <div>
                              <p className="text-green text-right">
                                {couponPercentage}%
                              </p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* <!-- total --> */}
                      <div className="flex items-center justify-between pt-5">
                        <div>
                          <p className="font-medium text-lg text-dark">Total</p>
                        </div>
                        <div>
                          <p className="font-medium text-lg text-dark text-right">
                            {formatToEuro(
                              parseFloat((totalAmount + shippingFee).toFixed(2))
                            )}
                          </p>
                        </div>
                      </div>
                      {/* <!-- Total After Coupon Applied --> */}
                      {appliedCouponCode !== "" && (
                        <>
                          <div className="flex items-center justify-between pt-5">
                            <div>
                              <p className="font-medium text-lg text-dark">
                                Total After Coupon Applied
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-lg text-green text-right">
                                {formatToEuro(
                                  parseFloat(
                                    (
                                      totalAmount +
                                      shippingFee -
                                      (totalAmount + shippingFee) *
                                        (couponPercentage / 100)
                                    ).toFixed(2)
                                  )
                                )}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* <!-- coupon box --> */}
                  <Coupon
                    onApplyCoupon={handleCouponApply}
                    couponStatus={couponStatus}
                    appliedCouponCode={appliedCouponCode}
                  />

                  {/* <!-- checkout button --> */}
                  <div className="mt-7.5">
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      disabled={cart.items.length === 0 || !isBillingDataValid}
                      createOrder={async () => {
                        let totalAmount = 0;

                        // Step 1: Create internal order
                        try {
                          const orderPayload = {
                            userId: user?._id || "guest",
                            items: {
                              ...cart,
                              items: cart.items.map((item) => ({
                                product: item._id,
                                variant: item.variantId,
                                quantity: item.quantity,
                                price: item.actualPrice,
                              })),
                            },
                            isUk,
                            couponCode: couponCode || null,
                            shippingMethod,
                            deliveryNote: deliveryNote || "",
                            shippingAddress: {
                              phone: billingData.phone,
                              apartment: billingData.addressTwo,
                              houseNumber: billingData.houseNumber,
                              street: billingData.address,
                              city: billingData.town,
                              province: billingData.province,
                              zipCode: billingData.zipCode,
                              country:
                                billingData.countryName === "OutsideUK"
                                  ? billingData.country
                                  : billingData.countryName,
                            },
                          };
                          const orderRes = await fetch(
                            `${
                              process.env.NODE_ENV === "production"
                                ? process.env.NEXT_PUBLIC_BASEURL
                                : process.env.NEXT_PUBLIC_BASEURL_LOCAL
                            }/checkout`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(orderPayload),
                            }
                          );

                          if (!orderRes.ok) {
                            const errorData = await orderRes.json();
                            throw new Error(
                              errorData.error || "Failed to create order"
                            );
                          }

                          const orderData = await orderRes.json();
                          internalOrderIdRef.current = orderData.orderId;
                          orderDataRef.current = orderData;
                          totalAmount = orderData.totalAmount;
                        } catch (err) {
                          console.error(
                            "❌ Error creating internal order:",
                            err
                          );
                          alert(err.message);
                          throw err;
                        }

                        // Step 2: Create PayPal order
                        try {
                          const paypalRes = await fetch(
                            `${
                              process.env.NODE_ENV === "production"
                                ? process.env.NEXT_PUBLIC_BASEURL
                                : process.env.NEXT_PUBLIC_BASEURL_LOCAL
                            }/paypal/create-order`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                amount: totalAmount.toFixed(2), // from backend only
                                orderId: internalOrderIdRef.current,
                              }),
                            }
                          );

                          if (!paypalRes.ok) {
                            const errorData = await paypalRes.json();
                            throw new Error(
                              errorData.message ||
                                "Failed to create PayPal order"
                            );
                          }

                          const { paypalOrderId } = await paypalRes.json();
                          return paypalOrderId;
                        } catch (err) {
                          console.error("❌ Error creating PayPal order:", err);
                          alert(
                            "Unable to start PayPal checkout. Please try again later."
                          );
                          throw err;
                        }
                      }}
                      onApprove={async (data) => {
                        // Step 3: Capture PayPal payment
                        try {
                          const captureRes = await fetch(
                            `${
                              process.env.NODE_ENV === "production"
                                ? process.env.NEXT_PUBLIC_BASEURL
                                : process.env.NEXT_PUBLIC_BASEURL_LOCAL
                            }/paypal/capture-order`,
                            {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                paypalOrderId: data.orderID,
                                orderId: internalOrderIdRef.current,
                                userId: orderDataRef.current?.userId,
                                processedItems: orderDataRef.current?.items,
                                totalAmount: orderDataRef.current?.totalAmount,
                              }),
                            }
                          );

                          if (!captureRes.ok) {
                            const errorData = await captureRes.json();
                            throw new Error(
                              errorData.message || "Failed to capture payment"
                            );
                          }

                          const captureData = await captureRes.json();

                          if (captureData.success) {
                            dispatch(removeAllItemsFromCart());
                            // ✅ Update user address in Redux
                            if (captureData.userAddress) {
                              dispatch(
                                updateUserAddress(captureData.userAddress)
                              );
                            }

                            router.push("/order-success");
                            toast.success(
                              "✅ Payment successful! Redirecting to order success page..."
                            );
                          } else {
                            toast.error(
                              "❌ Payment was not successful. Please try again."
                            );
                          }
                        } catch (err) {
                          console.error(
                            "❌ Error capturing PayPal payment:",
                            err
                          );
                          toast.error(
                            "Something went wrong while capturing your payment. Please try again."
                          );
                        }
                      }}
                      onError={(err) => {
                        console.error("❌ PayPal Error:", err);
                        alert("A PayPal error occurred. Please try again.");
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </>
    </PayPalScriptProvider>
  );
};

export default Checkout;
