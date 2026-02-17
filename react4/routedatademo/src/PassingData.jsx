
import { NavLink, BrowserRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom'
import ButtonState from './ButtonState';

const PassingData = () => {

    //note navigate(-1) will take you back to the previous page, navigate(1) will take you forward to the next page.
    return (
        <>
            <BrowserRouter>
                <h1>Passing data to routes</h1>
                <Routes>
                    <Route path='/' element={<MainPage />} />
                    <Route path='/button' element={<ButtonState />} />
                    <Route path='/order-confirmation' element={< OrderConfirmation />} />
                    <Route path="/user/:id" element={<UserProfile />} />
                    <Route path="/product/:id?" element={<Products />} />
                </Routes>

            </BrowserRouter>
        </>
    )
}




function MainPage() {
    const navigate = useNavigate();
    return (
        <>
            <h3>Pasing data such as state information to route</h3>
            <NavLink to="/user/42">Go to user profile with URL param</NavLink><br />
            <NavLink to="/product">Go to products without ID</NavLink><br />
            <NavLink to="/product/123">Go to product with ID</NavLink><br />
            <button onClick={() => {
                navigate('/order-confirmation', { state: { orderId: 12345, total: 99.99 } });
            }}>Go to order confirmation with state.</button>
        </>
    )
}




function OrderConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, total } = location.state;

    return (
        <div>
            <h1>Order Confirmed</h1>
            <p>Order ID: {orderId}</p>
            <p>Total: ${total}</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
}




function UserProfile() {
    const { id } = useParams();

    return <h1>User ID: {id}</h1>;
}

function Products() {
    const { id } = useParams();

    if (!id) {
        return <h1>All Products</h1>;
    }

    return <h1>Product {id}</h1>;

}
export default PassingData