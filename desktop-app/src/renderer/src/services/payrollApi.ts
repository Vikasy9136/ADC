import axios from "axios";

// Example stub for RazorpayX payout api call (replace with your actual keys and API host)
export async function sendSalaryPayout({
  account_number,
  ifsc,
  amount,
  currency = "INR",
  remarks,
  upi_id,
}: {
  account_number?: string;
  ifsc?: string;
  amount: number;
  currency?: string;
  remarks?: string;
  upi_id?: string;
}) {
  // Call your API or gateway endpoint here
  try {
    const response = await axios.post(
      "https://api.razorpay.com/v1/payouts",
      {
        account_number,
        ifsc,
        amount,
        currency,
        remarks,
        upi_id,
      },
      {
        headers: {
          Authorization: `Basic YOUR_BASE64_API_KEY`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
