import axios from 'axios';

export const APIBase = import.meta.env.VITE_API_BASE

const apiClient = axios.create({
  // MAMP 預設可能是 http://localhost:8888/your-project/api/
  baseURL: APIBase, 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // 建立訂單並取得 LINE Pay 付款連結
  createOrder(orderData) {
    return apiClient.post('donation/linepay.php', orderData);
  },
  // 確認付款（由後端呼叫 LINE Pay Confirm API）
  confirmPayment(transactionId, orderId) {
    return apiClient.get(`linepay_confirm.php?transactionId=${transactionId}&orderId=${orderId}`);
  }
};