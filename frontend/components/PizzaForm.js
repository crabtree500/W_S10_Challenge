import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, postOrder, resetForm, fetchData } from '../state/store';

export default function PizzaForm() {
  const dispatch = useDispatch();
  const { fullName, size, toppings, pending } = useSelector((state) => state.pizza);
  const [errors, setErrors] = useState({ fullName: '', size: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(updateField({ name, value, type, checked }));
  };

  const validateForm = () => {
    let formErrors = { fullName: '', size: '' };
    let isValid = true;

    if (!fullName.trim()) {
      formErrors.fullName = 'fullName is required';
      isValid = false;
    }

    if (!size) {
      formErrors.size = 'Size must be one of the following values : S, M, L';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const order = {
      fullName: fullName,
      size: size,
      toppings: toppings,
    };

    try {
      await dispatch(postOrder(order));
      console.log('Order successfully submitted');
      dispatch(resetForm());
      dispatch(fetchData()); // Fetch the updated order list
    } catch (error) {
      console.error('Error submitting order:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pizza Form</h2>
      {pending && <div className='pending'>Order in progress...</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input
            data-testid="fullNameInput"
            id="fullName"
            name="fullName"
            placeholder="Type full name"
            type="text"
            value={fullName}
            onChange={handleChange}
          />
          {errors.fullName && <div className="error">{errors.fullName}</div>}
        </div>
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select
            data-testid="sizeSelect"
            id="size"
            name="size"
            value={size}
            onChange={handleChange}
          >
            <option value="">----Choose size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {errors.size && <div className="error">{errors.size}</div>}
        </div>
      </div>

      <div className="input-group">
        <label>
          <input
            data-testid="checkPepperoni"
            name="toppings"
            value="1"
            type="checkbox"
            checked={toppings.includes('1')}
            onChange={handleChange}
          />
          Pepperoni<br />
        </label>
        <label>
          <input
            data-testid="checkGreenpeppers"
            name="toppings"
            value="2"
            type="checkbox"
            checked={toppings.includes('2')}
            onChange={handleChange}
          />
          Green Peppers<br />
        </label>
        <label>
          <input
            data-testid="checkPineapple"
            name="toppings"
            value="3"
            type="checkbox"
            checked={toppings.includes('3')}
            onChange={handleChange}
          />
          Pineapple<br />
        </label>
        <label>
          <input
            data-testid="checkMushrooms"
            name="toppings"
            value="4"
            type="checkbox"
            checked={toppings.includes('4')}
            onChange={handleChange}
          />
          Mushrooms<br />
        </label>
        <label>
          <input
            data-testid="checkHam"
            name="toppings"
            value="5"
            type="checkbox"
            checked={toppings.includes('5')}
            onChange={handleChange}
          />
          Ham<br />
        </label>
      </div>
      <input data-testid="submit" type="submit" />
    </form>
  );
}
