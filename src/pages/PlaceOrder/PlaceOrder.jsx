import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
   const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
   const [data, setData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: ""
   });

   const [paymentMethod, setPaymentMethod] = useState('stripe');
   const navigate = useNavigate();

   const onChangeHandler = (event) => {
      const { name, value } = event.target;
      setData(data => ({ ...data, [name]: value }));
   };

   const placeOrder = async (event) => {
      event.preventDefault();

      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]{10,15}$/;
      const zipRegex = /^[0-9]{4,10}$/;

      if (!emailRegex.test(data.email)) {
         alert("Please enter a valid email address.");
         return;
      }

      if (!phoneRegex.test(data.phone)) {
         alert("Please enter a valid phone number (10-15 digits).");
         return;
      }

      if (!zipRegex.test(data.zipcode)) {
         alert("Please enter a valid ZIP code (4-10 digits).");
         return;
      }

      // Prepare order items
      let orderItems = [];
      food_list.forEach((item) => {
         if (cartItems[item._id] > 0) {
            let itemInfo = { ...item };
            itemInfo.quantity = cartItems[item._id];
            orderItems.push(itemInfo);
         }
      });

      let orderData = {
         address: data,
         items: orderItems,
         amount: getTotalCartAmount() + 2,
         paymentMethod: paymentMethod
      };

      try {
         const response = await axios.post(url + "/api/order/place", orderData, {
            headers: { token }
         });

         if (response.data.success) {
            if (paymentMethod === 'stripe') {
               window.location.replace(response.data.session_url);
            } else if (paymentMethod === 'cod') {
               alert("Order placed successfully. Pay on delivery.");
               navigate('/orders'); // or a thank-you page
            }
         } else {
            alert("Error placing order. Please try again.");
         }
      } catch (error) {
         alert("Something went wrong. Try again later.");
         console.error(error);
      }
   };

   useEffect(() => {
      if (!token || getTotalCartAmount() === 0) {
         navigate('/cart');
      }
   }, [token]);

   return (
      <form onSubmit={placeOrder} className='place-order'>
         <div className="place-order-left">
            <p className='title'>Delivery Information</p>
            <div className="multi-fields">
               <input required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
               <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
            </div>
            <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
            <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
            <div className="multi-fields">
               <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
               <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
            </div>
            <div className="multi-fields">
               <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
               <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
            </div>
            <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />

            
         </div>

         <div className="place-order-right">
            <div className="cart-total">
               <h2>Cart Totals</h2>
               <div>
                  <div className="cart-total-details">
                     <p>Subtotal</p>
                     <p>${getTotalCartAmount()}</p>
                  </div>
                  <hr />
                  <div className="cart-total-details">
                     <p>Delivery Fee</p>
                     <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                  </div>
                  <hr />
                  <div className="cart-total-details">
                     <b>Total</b>
                     <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                  </div>
               </div>
               <button type='submit'>PROCEED TO PAYMENT</button>
            </div>
            <div className="payment-method">
               <p className='title'>Payment Method</p>
               <label>
                  <input
                     type="radio"
                     name="paymentMethod"
                     value="stripe"
                     checked={paymentMethod === 'stripe'}
                     onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Pay with Card (Stripe)</span>
               </label>
               <label>
                  <input
                     type="radio"
                     name="paymentMethod"
                     value="cod"
                     checked={paymentMethod === 'cod'}
                     onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>Cash on Delivery (COD)</span>
               </label>
            </div>
         </div>
         
      </form>
   );
};

export default PlaceOrder;
