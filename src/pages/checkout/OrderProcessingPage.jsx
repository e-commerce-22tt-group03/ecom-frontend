import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    let cancelled = false;

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
        if (!cancelled) navigate(`/checkout/reject?orderId=${orderId}&code=${vnpResponse || params.vnp_TransactionStatus}`);
        return;
      }

      try {
        const res = await confirmPaymentApi({ order_id: orderId, transaction_no: txnNo, pay_date: payDate });
        console.log('confirmPaymentApi response:', res);
        if (res?.status === 'success') {
          setStatus('success');
          setMessage('Payment confirmed. Redirecting to confirmation...');
          if (!cancelled) navigate(`/order-confirmation/${orderId}`);
        } else {
          setStatus('failed');
          setMessage(res?.message || 'Payment confirmation failed.');
          if (!cancelled) navigate(`/checkout/reject?orderId=${orderId}&code=confirm_failed`);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err?.message || 'Confirmation request failed');
        if (!cancelled) navigate(`/checkout/reject?orderId=${orderId}&code=network_error`);
      }
    };

    run();

    return () => { cancelled = true; };
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
