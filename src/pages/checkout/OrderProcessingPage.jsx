import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPayment as confirmPaymentApi } from '../../api/vnpayApi';

// Parses querystring into an object
const parseQuery = (search) => {
  const params = new URLSearchParams(search);
  const obj = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
};

const OrderProcessingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing payment...');
  const calledRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
  // mark mounted at the start of this effect
  isMountedRef.current = true;

    const run = async () => {
      const params = parseQuery(location.search);
      // VNPAY returns vnp_TxnRef as the order ref
      const orderId = Number(params.vnp_TxnRef || params.order_id);
      const vnpResponse = params.vnp_ResponseCode;
      const txnNo = Number(params.vnp_TransactionNo);
      const payDate = Number(params.vnp_PayDate);

      if (!orderId) {
        setStatus('error');
        setMessage('Missing order reference in return URL.');
        return;
      }

      // If there is NO response code or transaction status, this is the pre-redirect state
      // (FE navigated here before redirecting user to VNPAY). Show a friendly message and do not call confirm.
      if (typeof vnpResponse === 'undefined' && typeof params.vnp_TransactionStatus === 'undefined') {
        setStatus('redirecting');
        setMessage('Preparing payment and redirecting to VNPAY...');
        // Stay on this page while FE triggers the browser redirect. Do not navigate elsewhere.
        return;
      }

      // If response not success, navigate to reject page immediately
      if (vnpResponse !== '00' && params.vnp_TransactionStatus !== '00') {
        setStatus('failed');
        setMessage('Payment failed or cancelled.');
        if (isMountedRef.current) navigate(`/checkout/reject?orderId=${orderId}&code=${vnpResponse || params.vnp_TransactionStatus}`);
        return;
      }

      // Defensive: ensure numeric values are valid positive numbers before calling backend
  if (!Number.isFinite(txnNo) || txnNo <= 0 || !Number.isFinite(payDate) || payDate <= 0) {
        // Log helpful debug info so we can inspect what the FE received from VNPAY
        // (NaN becomes null in JSON, which triggers BE zod validation -> 400)
        // Do not call backend when required numeric params are invalid.
        // Navigate user to reject page with an explanatory code.
        // Also avoid double-calling the confirm endpoint in StrictMode.
        console.warn('Invalid VNPAY params, skipping confirm call', { orderId, txnNo, payDate, params });
        setStatus('failed');
        setMessage('Invalid payment parameters received from gateway.');
  if (isMountedRef.current) navigate(`/checkout/reject?orderId=${orderId}&code=invalid_params`);
        return;
      }

      // Prevent duplicate confirmation calls (React StrictMode/dev double-run)
      if (calledRef.current) return;
      calledRef.current = true;

      try {
        const payload = { order_id: orderId, transaction_no: txnNo, pay_date: payDate };
        console.log('confirmPaymentApi payload:', payload);
        const res = await confirmPaymentApi(payload);
        console.log('confirmPaymentApi response:', res);
        if (res?.status === 'success') {
          setStatus('success');
          setMessage('Payment confirmed. Redirecting to confirmation...');
          if (isMountedRef.current) navigate(`/order-confirmation/${orderId}`);
    } else {
          setStatus('failed');
          setMessage(res?.message || 'Payment confirmation failed.');
          if (isMountedRef.current) navigate(`/checkout/reject?orderId=${orderId}&code=confirm_failed`);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err?.message || 'Confirmation request failed');
        if (isMountedRef.current) navigate(`/checkout/reject?orderId=${orderId}&code=network_error`);
    }
    };

    run();

    return () => { isMountedRef.current = false; };
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="p-8 rounded-lg shadow bg-base-100 text-center">
        <h2 className="text-xl font-semibold mb-4">{message}</h2>
        {status === 'processing' && <span className="loading loading-spinner loading-lg"></span>}
        {status === 'redirecting' && <span className="loading loading-spinner loading-lg"></span>}
        {status === 'success' && <div className="text-success">Success</div>}
        {status === 'failed' && <div className="text-error">Failed</div>}
      </div>
    </div>
  );
};

export default OrderProcessingPage;
