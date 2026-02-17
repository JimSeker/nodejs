import React from 'react'
import { useNavigate } from 'react-router-dom';

function ButtonState() {
    const navigate = useNavigate();
    return (
        <button  onClick={() => {
            navigate('/order-confirmation', { state: { orderId: 12345, total: 99.99 } });
        }}>                Go to order confirmaton with state.            </button>
    )
}

export default ButtonState