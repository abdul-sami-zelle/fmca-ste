import React, { useState } from 'react'
import './RegisterMobileView.css'
import { url } from '../../../../utils/api';
import Link from 'next/link';


const RegisterMobileView = ({ mobileSignupClicked, handleRegisterView, setSnakeBarMessage, setShowSnakeBar }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation for the form
        if (password !== confirmPassword) {
            setShowSnakeBar(true);
            setSnakeBarMessage("Password Deos Not Match")
            return;
        }
        setError('');
        setLoading(true);

        // Prepare FormData
        const formData = new FormData();
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('email', email);
        formData.append('password', password);

        try {
            // Send POST request with FormData to the API
            const response = await fetch(`${url}/api/v1/web-users/add`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert('Sign up successful!');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                setShowSnakeBar(true);
                setSnakeBarMessage(result.message || 'Something went wrong')
            }
        } catch (error) {
            setShowSnakeBar(true);
            setSnakeBarMessage('Network error, please try again later.')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`mobile-register-main ${mobileSignupClicked ? 'slide-register-left' : ''}`}>
            <div className='mobile-register-top-heading'>
                <p>Already have an account?</p>
                <button onClick={handleRegisterView}>Sign in</button>
            </div>
            <div className='mobile-register-content'>
                <h3 className='mobile-register-heading'>Register</h3>
                <form className="signup-form" onSubmit={handleSubmit}>
                    <label className="mobile-login-input-label">
                        <p>First Name<span style={{ color: "var(--orange-fill)" }} >*</span></p>
                        <input
                            className="login-and-register-input"
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="mobile-login-input-label">
                        <p>Last Name<span style={{ color: "var(--orange-fill)" }} >*</span></p>
                        <input
                            className="login-and-register-input"
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                    <label className="mobile-login-input-label">
                        <p>Email<span style={{ color: "var(--orange-fill)" }} >*</span></p>
                        <input
                            className="login-and-register-input"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className="mobile-login-input-label">
                        <p>Password<span style={{ color: "var(--orange-fill)" }} >*</span></p>
                        <input
                            className="login-and-register-input"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label className="mobile-login-input-label">
                        <p>Confirm Password<span style={{ color: "var(--orange-fill)" }} >*</span></p>
                        <input
                            className="login-and-register-input"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label className="mobile-login-input-label checkbox">
                        <input
                            type="checkbox"
                            className='mobi-view-signup-check'
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            required
                        />
                        <span>I agree to the <Link href={'/privacy-policy'}>Privacy Policy</Link></span>
                    </label>
                    <label className="mobile-login-input-label checkbox">
                        <input
                            type="checkbox"
                            checked={acceptPrivacy}
                            className='mobi-view-signup-check'
                            onChange={(e) => setAcceptPrivacy(e.target.checked)}
                            required
                        />
                        <span>I agree to the <Link href={'/terms-and-conditions'} >Terms And Condition</Link></span>
                    </label>
                    <button className="signup-button mobile-view-register-btn" type="submit">Register</button>
                </form>



            </div>
        </div>
    )
}

export default RegisterMobileView
