import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // NEW

  const fetchOrders = async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, {
        headers: { token }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {loading ? (
          <p>Loading orders...</p> // Or a spinner here
        ) : data.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item, i) => (
                `${item.name} x ${item.quantity}${i < order.items.length - 1 ? ', ' : ''}`
              ))}</p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span><b>{order.status}</b></p>
              <button>Track Order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
