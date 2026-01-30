import  { useState } from 'react';

function Example1() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data:', formData);
        // Submit to server
        //...
        //show alert box that form is submitted.
        alert("Form submitted!");
        //rest values input fields back to empty, via  formData to initial state. 
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <>
        <h3>Example 1 of forms.</h3>
        <form onSubmit={handleSubmit}>
            <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
            />
            <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
            />
            <br />
            <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
            />
            <br/>
            <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
            />
            <br />
            <button type="submit">Submit</button>
        </form>
        note, the submit button is actually turned off.<br/>
        Displaying form data:<br/>
        Firstname: {formData.firstName} <br />
        Lastname: {formData.lastName} <br />
        Email: {formData.email} <br />
        Phone: {formData.phone} <br />
        Message: {formData.message} <br />
        </>
    );
}

export default Example1;        
