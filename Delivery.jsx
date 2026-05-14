import { createRazorpayOrder, verifyPayment } from "./api.js";

export async function initiatePayment({ amount, name, description, prefill, onSuccess, onFailure }) {
  try {
    const { data } = await createRazorpayOrder(amount);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "VELOUR",
      description,
      order_id: data.orderId,
      prefill: {
        name: prefill?.name || "",
        email: prefill?.email || "",
        contact: prefill?.phone || "",
      },
      theme: { color: "#d4831a" },
      handler: async (response) => {
        try {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (verifyRes.data.success) {
            onSuccess(response.razorpay_payment_id, data.orderId);
          } else {
            onFailure("Payment verification failed");
          }
        } catch (err) {
          onFailure(err.message);
        }
      },
      modal: {
        ondismiss: () => onFailure("Payment cancelled"),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    onFailure(err.message);
  }
}
