import React, { useState } from 'react'
import './ApplyFor.css'
import { useRef } from 'react'
import axios from 'axios'
import { formatPhoneNumber, url } from '../../../../utils/api'
import { BsSend } from "react-icons/bs";

const ApplyFor = ({setLoading}) => {

    const [applyForData, setApplyForData] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        email: '',
        zipCode: '',
        city: '',
        state: '',
        resume: null,
    })

    const [error, setError] = useState({})
    // const [newData, setNewData] = useState({...applyForData})
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setApplyForData((prev) => ({
            ...prev,
            [name]: name === 'contact' ? formatPhoneNumber(value) : value
        }));

        setError((prevError) => ({
            ...prevError,
            [name]: ''
        }))


    }

    const handleZipCode = async (e) => {
        const zipCode = e.target.value;

        // Update contactForm with the entered ZIP code
        setApplyForData((prevData) => ({
            ...prevData,
            zipCode: zipCode
        }));

        // Reset state if ZIP code is empty
        if (!zipCode || zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
            setApplyForData((prevData) => ({ ...prevData, state: "" }));
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`https://zip.getziptastic.com/v2/US/${zipCode}`);

            if (!response.ok) {
                throw new Error("ZIP code not found");
            }

            const result = await response.json();

            // Update state in the contact form
            setApplyForData((prevData) => ({
                ...prevData,
                state: result.state || "",
                city: result.city || ""
            }));

        } catch (error) {
            console.error("Error fetching ZIP code data:", error);
        } finally {
            setLoading(false);
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const fileInputRef = useRef(null)
    const handleFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
            const maxSize = 2 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                alert("Only .pdf, .doc, and .docx files are allowed.");
                return;
            }

            if (file.size > maxSize) {
                alert("File size should not exceed 2MB.");
                return;
            }

            setApplyForData((prev) => ({ ...prev, resume: file }))

        }
    }

    const sendUserData = async (e) => {
        e.preventDefault();
        const newError = {}
        Object.keys(applyForData).forEach((key) => {
            if (!applyForData[key] || (typeof applyForData[key] === "string" && !applyForData[key].trim())) {
                newError[key] = "This Field Is Required";
            }
        });

        // Email validation
        if (applyForData.email && !validateEmail(applyForData.email)) {
            newError.email = "Enter a valid email address";
        }

        if (Object.keys(newError).length > 0) {
            setError(newError);
            return;
        }

        const formattedContact = applyForData.contact.replace(/\D/g, "");
        if (formattedContact.length !== 10) {
            console.error("Invalid contact number length"); // Ensure it's exactly 10 digits
        } 

        const formData = new FormData();
        formData.append('firstName', applyForData.firstName);
        formData.append('lastName', applyForData.lastName);
        formData.append('contact', formattedContact);
        formData.append('email', applyForData.email);
        formData.append('zipCode', applyForData.zipCode);
        formData.append('city', applyForData.city)
        formData.append('state', applyForData.state);

        if (applyForData.resume) {
            formData.append("resume", applyForData.resume);
        }
        // Fetch state information
        const api = `/api/v1/careers/add`

        try {
            setLoading(true)
            const response = await axios.post(url+api, formData )

            if (response.status === 201) {
                alert("Your contact information has been submitted successfully!");
                setApplyForData({
                    firstName: '',
                    lastName: '',
                    contact: '',
                    email: '',
                    city: '',
                    zipcode: '',
                    state: '',
                    resume: null
                });
            } 
        } catch (error) {
            console.error("UnExpected Server Error", error)
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitCareerForm = async () => { }
    
    return (
        <form className='apply-for-main' onSubmit={handleSubmitCareerForm}>

            <div className='career-form-first-and-last-name-container'>
                <label className='apply-for-input-labels'>
                    First Name
                    <input
                        type='text'
                        placeholder={error.firstName ? 'Name is required' : 'Alex John'}
                        name='firstName'
                        value={applyForData.name}
                        onChange={handleInputChange}
                        style={{ borderColor: error.firstName ? 'red' : '#d7d7d7', color: error.lastName ? 'red' : 'var(--secondary-color)' }}
                    />
                </label>

                <label className='apply-for-input-labels'>
                    Last Name
                    <input
                        type='text'
                        placeholder={error.lastName ? 'Name is required' : 'Alex John'}
                        name='lastName'
                        value={applyForData.lastName}
                        onChange={handleInputChange}
                        style={{ borderColor: error.lastName ? 'red' : '#d7d7d7', color: error.lastName ? 'red' : 'var(--secondary-color)' }}
                    />
                </label>
            </div>

            <label className='apply-for-input-labels'>
                Contact
                <input
                    type='text'
                    placeholder={error.contact ? 'Contact is required' : '(215) 123-456'}
                    name='contact'
                    value={applyForData.contact}
                    onChange={handleInputChange}
                    style={{ borderColor: error.contact ? 'red' : '#d7d7d7', color: error.contact ? 'red' : 'var(--secondary-color)' }}
                />
            </label>

            <label className='apply-for-input-labels'>
                Email
                <input
                    type='text'
                    name='email'
                    value={applyForData.email}
                    placeholder={error.email ? 'Email is required' : 'alex.james@gmail.com'}
                    onChange={handleInputChange}
                    style={{ borderColor: error.email ? 'red' : '#d7d7d7', color: error.email ? 'red' : 'var(--secondary-color)' }}
                />
            </label>

            <div className='career-form-zip-and-city'>
                <div className='career-form-zip-container'>

                    <label className='apply-for-input-labels'>
                        Zip Code
                        <input
                            type='text'
                            placeholder={error.zipCode ? 'Zip Code is required' : 'Zip Code'}
                            name='zipCode'
                            value={applyForData.zipCode}
                            onChange={handleZipCode}
                            style={{ borderColor: error.zipCode ? 'red' : '#d7d7d7', color: error.zipCode ? 'red' : 'var(--secondary-color)' }}
                        />
                    </label>
                </div>

                <label className='apply-for-input-labels'>
                    City
                    <input
                        type='text'
                        placeholder={error.city ? 'City is required' : 'City'}
                        name='city'
                        value={applyForData.city}
                        onChange={handleInputChange}
                        style={{ borderColor: error.city ? 'red' : '#d7d7d7', color: error.city ? 'red' : 'var(--secondary-color)' }}
                    />
                </label>
            </div>

            <label className='apply-for-input-labels'>
                State
                <input
                    type='text'
                    placeholder={error.state ? 'State is required' : 'State'}
                    name='state'
                    value={applyForData.state}
                    onChange={handleInputChange}
                    style={{ borderColor: error.state ? 'red' : '#d7d7d7', color: error.state ? 'red' : 'var(--secondary-color)' }}
                />
            </label>

            <label className='apply-for-input-labels'>
                Upload your resume
                <p className='apply-for-chose-file' onClick={handleFileClick}>Choose File</p>
                <input type='file' name='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
            <p className='selected-file-name'>{applyForData?.resume?.name}</p>
            <button type='button' className='apply-for-career-button' onClick={sendUserData}>
                {/* <img src={applyIcon} alt='apply icon' /> */}
                <BsSend size={20} className='select-file-icon' />
                Apply
            </button>
        </form>
    )
}

export default ApplyFor
