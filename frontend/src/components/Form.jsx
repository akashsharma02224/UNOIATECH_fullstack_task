import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
export default function Form({closeFormpopUp}) {
  const [formData, setFormData] = useState({
    logo: null,
    screenshot: null,
    companyName: '',
    description: '',
    address: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validate = () => {
    const errors = {};
    if (!formData.logo) errors.logo = 'Logo is required';
    if (!formData.screenshot) errors.screenshot = 'Screenshot is required';
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) {
      errors.phone = 'Valid phone number is required';
    }
    if (
      !formData.email.trim() ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errors.email = 'Valid email is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append('company_logo', formData.logo);
    formDataToSend.append('website_screenshot', formData.screenshot);
    formDataToSend.append('company_name', formData.companyName);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('phone_number', formData.phone);
    formDataToSend.append('email', formData.email);
    try {
      const baseURL = process.env.REACT_APP_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/v1/company/add`, {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }
      const data = await response.json();
      console.log('Response:', data);
      setFormData({
        logo: null,
        screenshot: null,
        companyName: '',
        description: '',
        address: '',
        phone: '',
        email: '',
      });
      if(data.statusCode === 200){
        closeFormpopUp()
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className=" absolute top-10 right-[60%] left-[40%] max-w-lg w-[600px] mx-auto p-6 bg-white shadow-md rounded-md">
        <div className='flex justify-between items-center mb-4'>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Company Details Form</h2>
        <IoMdClose onClick={closeFormpopUp}/>
        </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="logo">
            Upload Logo
          </label>
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="screenshot">
            Upload Screenshot
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {errors.screenshot && <p className="text-red-500 text-sm mt-1">{errors.screenshot}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="companyName">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Enter company name"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
