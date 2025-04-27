import { randomUUID } from "crypto";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { PhonePayClient } from "../config/phonepay.js";
export async function createPhonePayOrder(req, res) {
  try {
    const { amount } = req.body;
    if (!amount)
      return res.status(400).json({
        success: false,
        message: "Amount is required.",
      });
    const orderId = randomUUID();

    const request = StandardCheckoutPayRequest.builder()
      .merchantOrderId(orderId)
      .amount(amount * 100)
      .redirectUrl(
        "http://localhost:5000/payment/checkstatus?merchantOrderId=" + orderId
      )
      .build();

    const response = await PhonePayClient.pay(request);
    console.log("response is", response);
    return res.status(200).json({
      success: true,
      checkOutUrl: response.redirectUrl,
    });
  } catch (error) {
    console.error("Error in creating phone pay order.", error);
    return res.status(500).json({
      success: false,
      message: "Error in creating phone pay order.",
    });
  }
}
export async function checkStatus(req, res) {
  const { merchantOrderId } = req.query;
  if (!merchantOrderId)
    return res.status(400).json({
      success: false,
      message: "Merchant Order Id is required.",
    });
  try {
    const response = await PhonePayClient.getOrderStatus(merchantOrderId);
    console.log("response is in check status ", response);
    return res.status(200).json({
      success: true,
      status: response.status,
      orderId: response.orderId,
      amount: response.amount,
      currency: response.currency,
    });
  } catch (error) {
    console.error("Error in checking status.", error);
    return res.status(500).json({
      success: false,
      message: "Error in checking status.",
    });
  }
}
