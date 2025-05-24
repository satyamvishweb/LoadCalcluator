import React, { useState } from "react";
import "../Scss/styles.scss";

const ItemForm = ({ items, setItems, container, setContainer }) => {
  const [form, setForm] = useState({
    name: "",
    length: "",
    width: "",
    height: "",
    weight: "",
    quantity: "",
    stackable: false,
    fragile: false,
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const numFields = ['length', 'width', 'height', 'weight'];
    const intFields = ['quantity'];

    // Validate name
    if (!form.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    // Validate required fields
    for (const field of [...numFields, ...intFields]) {
      if (!form[field]) {
        newErrors[field] = 'This field is required';
      }
    }

    // Validate numbers
    for (const field of numFields) {
      if (form[field] && (isNaN(form[field]) || parseFloat(form[field]) <= 0)) {
        newErrors[field] = 'Must be a positive number';
      }
    }

    // Validate integers
    for (const field of intFields) {
      if (form[field] && (!Number.isInteger(parseFloat(form[field])) || parseInt(form[field]) <= 0)) {
        newErrors[field] = 'Must be a positive integer';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Prevent alphabets in numeric fields
    const numericFields = ['length', 'width', 'height', 'weight', 'quantity'];
    if (numericFields.includes(name)) {
      // Allow only numbers and decimal point (for float inputs)
      const validValue = value.replace(/[^0-9.]/g, '');
      setForm((prev) => ({
        ...prev,
        [name]: validValue,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleAdd = () => {
    if (!validate()) return;

    setItems([
      ...items,
      {
        ...form,
        id: Date.now(),
        name: form.name.trim(),
        length: parseFloat(form.length),
        width: parseFloat(form.width),
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        quantity: parseInt(form.quantity),
      },
    ]);

    setForm({
      name: "",
      length: "",
      width: "",
      height: "",
      weight: "",
      quantity: "",
      stackable: false,
      fragile: false,
    });
  };

  return (
    <div className="item-form">
      <h2>Item Input</h2>

      <div className="form-group">
        <input
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <input
          name="length"
          placeholder="Length (cm)"
          value={form.length}
          onChange={handleChange}
          className={errors.length ? "error" : ""}
        />
        {errors.length && <span className="error-message">{errors.length}</span>}
      </div>

      <div className="form-group">
        <input
          name="width"
          placeholder="Width (cm)"
          value={form.width}
          onChange={handleChange}
          className={errors.width ? "error" : ""}
        />
        {errors.width && <span className="error-message">{errors.width}</span>}
      </div>

      <div className="form-group">
        <input
          name="height"
          placeholder="Height (cm)"
          value={form.height}
          onChange={handleChange}
          className={errors.height ? "error" : ""}
        />
        {errors.height && <span className="error-message">{errors.height}</span>}
      </div>

      <div className="form-group">
        <input
          name="weight"
          placeholder="Weight (kg)"
          value={form.weight}
          onChange={handleChange}
          className={errors.weight ? "error" : ""}
        />
        {errors.weight && <span className="error-message">{errors.weight}</span>}
      </div>

      <div className="form-group">
        <input
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          className={errors.quantity ? "error" : ""}
        />
        {errors.quantity && <span className="error-message">{errors.quantity}</span>}
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            name="stackable"
            checked={form.stackable}
            onChange={handleChange}
          />{" "}
          Stackable
        </label>
        <label>
          <input
            type="checkbox"
            name="fragile"
            checked={form.fragile}
            onChange={handleChange}
          />{" "}
          Fragile
        </label>
      </div>

      <div className="form-group">
        <select
          value={container}
          onChange={(e) => setContainer(e.target.value)}
          className="container-select"
        >
          <option value="20ft">20ft Standard (28,000 kg)</option>
          <option value="40ft">40ft Standard (30,000 kg)</option>
          <option value="40HC">40ft High Cube (30,000 kg)</option>
        </select>
      </div>

      <button onClick={handleAdd} className="add-button">
        Add Item
      </button>
    </div>
  );
};

export default ItemForm;
