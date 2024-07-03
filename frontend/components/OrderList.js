import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../state/store';

const OrderList = () => {
  const dispatch = useDispatch();
  const { loading, data, error } = useSelector((state) => state.getInformation);
  const [selectedSize, setSelectedSize] = useState('All'); 
  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredOrders = selectedSize === 'All' ? data : data.filter(order => order.size === selectedSize);

  const handleFilter = (size) => {
    setSelectedSize(size);
  };

  return (
    <div id="orderList">
      <h2>Pizza Orders</h2>
      <ol>
        {filteredOrders.map((order) => (
          <li key={order.id}>
        <div>
              {order.customer} ordered a size {order.size} with {order.toppings.length === 0 ? 'no toppings' : `${order.toppings.length} ${order.toppings.length === 1 ? 'topping' : 'toppings'}`}
            </div>
          </li>
        ))}
      </ol>
      <div id="sizeFilters">
        Filter by size:
        {['All', 'S', 'M', 'L'].map(size => {
          const className = `button-filter${size === selectedSize ? ' active' : ''}`;
          return (
            <button
              key={size}
              data-testid={`filterBtn${size}`}
              className={className}
              onClick={() => handleFilter(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;

