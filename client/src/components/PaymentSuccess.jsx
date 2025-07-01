// pages/payment-success.jsx (or /payment-success/page.jsx in app directory)
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PaymentSuccess() {
  const [status, setStatus] = useState('Verifying payment...');
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    if(sessionId){
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/verify-payment`,
            {sessionId},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,} }
        )
        .then(res=>{
            if(res.status === 200){
                toast.success(res.data.message)
                setStatus("Payment verified")
                navigate("/my-appointment")
            }
        })
        .catch((err) => {
            if(err?.response?.data?.message){
                toast.error(err?.response?.data?.message);
                setStatus("Payment failed")
            }
        });
    }
  }, []);

  return (
    <div className="p-4 text-xl font-medium">
      {status}
    </div>
  );
}
