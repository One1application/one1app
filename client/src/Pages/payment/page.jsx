import { useEffect, useState } from "react";
import { verifyPayment } from "../../services/auth/api.services";
export default function PaymentPage() {
  const [amount, setAmount] = useState(100);
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    const [searchParams] = useSearchParams();

    const merchantOrderId = searchParams.get("merchantOrderId");
    const courseId = searchParams.get("courseId");
    async function verifyPaymentWithPhonePay() {
      const res = await verifyPayment({
        phonePayOrderId: merchantOrderId,
        courseId,
      });
      console.log("res", res);
    }
    verifyPaymentWithPhonePay();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-2xl font-bold mb-4">Make a Payment</h2>
        <input
          type="number"
          className="border rounded p-2 mb-4 w-full"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
        />
      </div>
    </div>
  );
}
