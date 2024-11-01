import axios from 'axios';
import React, { useContext, useDebugValue, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { useAuth } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

const Verify = () => {
    const { backendUrl, loadCreditsData } = useContext(AppContext);
    const { getToken } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const transactionId = searchParams.get("transactionId")
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const token = await getToken();
        const { data } = await axios.post(backendUrl + "/api/user/verifyPayment", { transactionId, success }, { headers: { token } });
        if (data.success) {
            toast.success("Payment success")
            loadCreditsData();
            navigate("/");
        } else {
            toast.error("Payment failed")
            navigate("/")
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [])

    return (
        <div className='h-[80vh]'>
            <div className='h-screen w-full fixed top-0 left-0 blur z-10'>
            </div>
            <div className='border-4 border-violet-600 rounded-full h-14 w-14 border-t-transparent animate-spin z-10 absolute top-1/2 left-1/2'>
            </div>
        </div>
    )
}

export default Verify