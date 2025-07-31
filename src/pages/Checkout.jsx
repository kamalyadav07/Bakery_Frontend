import React, { useState } from 'react';
import { useCart } from '../context/cart/CartState';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [orderType, setOrderType] = useState('Delivery');
    const [pickupTime, setPickupTime] = useState('');
    const [shippingInfo, setShippingInfo] = useState({ address: '', city: '', postalCode: '' });
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { address, city, postalCode } = shippingInfo;
    const onChange = e => setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = orderType === 'Takeaway' ? 0 : (itemsPrice > 500 ? 0 : 50);
    const totalPrice = itemsPrice + shippingPrice;

    const placeOrderHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (orderType === 'Takeaway' && !pickupTime) {
            setLoading(false);
            return setError('Please select a pickup time.');
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            const config = { headers: { 'Content-Type': 'application/json', 'x-auth-token': token } };

            // === COD LOGIC ===
            if (paymentMethod === 'COD') {
                const orderData = {
                    orderItems: cartItems.map(item => ({ product: item._id, name: item.name, quantity: item.quantity, price: item.price })),
                    shippingInfo: orderType === 'Delivery' ? shippingInfo : {},
                    paymentInfo: { method: 'COD' },
                    itemsPrice, shippingPrice, totalPrice, orderType,
                    pickupTime: orderType === 'Takeaway' ? pickupTime : null,
                    specialInstructions,
                };
                await axios.post('/api/orders', orderData, config);
                clearCart();
                navigate('/order-success');
            } else {
                // === ONLINE PAYMENT LOGIC ===
                
                // 1. First, create the order in our DB with "Pending Payment" status
                const orderPayload = {
                    orderItems: cartItems.map(item => ({ product: item._id, name: item.name, quantity: item.quantity, price: item.price })),
                    shippingInfo: orderType === 'Delivery' ? shippingInfo : {},
                    paymentInfo: { method: paymentMethod },
                    itemsPrice, shippingPrice, totalPrice, orderType,
                    pickupTime: orderType === 'Takeaway' ? pickupTime : null,
                    specialInstructions,
                };
                const { data: createdOrder } = await axios.post('/api/orders', orderPayload, config);

                // 2. Then, create a Razorpay order
                const { data: { data: razorpayOrder } } = await axios.post('/api/payment/orders', { amount: totalPrice * 100 }, config);

                // 3. Open Razorpay Checkout
                const options = {
                    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Get key from frontend env
                    amount: razorpayOrder.amount,
                    currency: "INR",
                    name: "Sweet Delights Bakery",
                    description: "Payment for your delicious treats",
                    order_id: razorpayOrder.id,
                    handler: async function (response) {
                        const verificationPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: createdOrder._id, // Our DB order ID
                        };
                        
                        // 4. Verify the payment on our backend
                        await axios.post('/api/payment/verify', verificationPayload, config);
                        clearCart();
                        navigate('/order-success');
                    },
                    prefill: {
                        // We can prefill customer info if available
                    },
                    theme: {
                        color: "#4A2C2A"
                    }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={checkoutContainerStyle}>
            <h2>Checkout</h2>
            <div style={formAndSummaryStyle}>
                <div style={formSectionStyle}>
                    <form onSubmit={placeOrderHandler}>
                        {/* Fields for Order Type, Address, Pickup Time, Instructions */}
                        <h3>Order Type</h3>
                        <div style={paymentMethodStyle}>
                            <label><input type="radio" name="orderType" value="Delivery" checked={orderType === 'Delivery'} onChange={(e) => setOrderType(e.target.value)} /> Delivery</label>
                            <label><input type="radio" name="orderType" value="Takeaway" checked={orderType === 'Takeaway'} onChange={(e) => setOrderType(e.target.value)} /> Takeaway / Pick-up</label>
                        </div>
                        {orderType === 'Delivery' ? (
                            <>
                                <h3>Shipping Address</h3>
                                <input type="text" name="address" value={address} onChange={onChange} placeholder="Full Address" required style={inputStyle} />
                                <input type="text" name="city" value={city} onChange={onChange} placeholder="City" required style={inputStyle} />
                                <input type="text" name="postalCode" value={postalCode} onChange={onChange} placeholder="Postal Code" required style={inputStyle} />
                            </>
                        ) : (
                             <>
                                <h3>Pickup Time</h3>
                                <input type="datetime-local" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} required style={inputStyle} />
                            </>
                        )}
                        <h3>Special Instructions (Optional)</h3>
                        <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} placeholder="e.g., 'Happy Birthday John'" rows="3" style={inputStyle}></textarea>
                        
                        <h3>Payment Method</h3>
                        <div style={paymentMethodStyle}>
                            <label><input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} /> Cash on Delivery / Pay at Store</label>
                            <label><input type="radio" name="paymentMethod" value="UPI" checked={paymentMethod === 'UPI'} onChange={(e) => setPaymentMethod(e.target.value)} /> UPI / Cards / Netbanking</label>
                        </div>
                        {error && <div className="error-text" style={{marginBottom: '1rem'}}>{error}</div>}
                        <button type="submit" style={placeOrderBtnStyle} disabled={loading}>
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>
                <div style={summarySectionStyle}>
                    {/* Order Summary */}
                    <h3>Order Summary</h3>
                    {cartItems.map(item => (
                        <div key={item._id} style={summaryItemStyle}>
                            <span>{item.name} (x{item.quantity})</span>
                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <hr />
                    <div style={summaryItemStyle}><strong>Items Price:</strong> <span>₹{itemsPrice.toFixed(2)}</span></div>
                    <div style={summaryItemStyle}><strong>Shipping:</strong> <span>₹{shippingPrice.toFixed(2)}</span></div>
                    <hr />
                    <div style={summaryItemStyle}><h3>Total:</h3> <h3>₹{totalPrice.toFixed(2)}</h3></div>
                </div>
            </div>
        </div>
    );
};
const checkoutContainerStyle = { maxWidth: '1000px', margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' };
const formAndSummaryStyle = { display: 'flex', gap: '2rem', flexWrap: 'wrap' };
const formSectionStyle = { flex: '2 1 500px' };
const summarySectionStyle = { flex: '1 1 300px', background: '#FEFBF6', padding: '1.5rem', borderRadius: '8px' };
const inputStyle = { width: 'calc(100% - 22px)', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' };
const paymentMethodStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' };
const placeOrderBtnStyle = { width: '100%', padding: '12px', backgroundColor: '#2ECC71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' };
export default Checkout;
