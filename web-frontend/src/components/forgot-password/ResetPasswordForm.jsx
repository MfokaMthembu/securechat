import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';
import './ResetPasswordForm.css';

function ResetPasswordForm() {
    const [formData, setFormData] = useState({ email: '' });
    const [otpData, setOtpData] = useState({ otp_code: '', new_password: '', confirm_password: '' });
    const [showOtpSection, setShowOtpSection] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleEmailChange = (e) => setFormData({ ...formData, email: e.target.value });
    const handleOtpChange = (e) => setOtpData({ ...otpData, [e.target.name]: e.target.value });

    // Countdown to manage OTP resend (to prevent users from spamming the api with requests)
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/api/forgot-password', { email: formData.email });
            if (response.status === 200) {
                setMessage('OTP sent to your email successfully!');
                setShowOtpSection(true);
                // start 60s countdown
                setCountdown(60); 
            } else {
                setMessage(response.data.message || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error requesting OTP:', error);
            setMessage(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        // prevents resending during countdown
        if (countdown > 0) return; 
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.post('/api/forgot-password', { email: formData.email });
            if (response.status === 200) {
                setMessage('OTP resent successfully!');
                setCountdown(60);
            } else {
                setMessage(response.data.message || 'Failed to resend OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            setMessage(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (otpData.new_password !== otpData.confirm_password) {
        setMessage('Passwords do not match.');
        setIsLoading(false);
        return;
    }
    if (otpData.new_password.length < 8) {
        setMessage('Password must be at least 8 characters long.');
        setIsLoading(false);
        return;
    }

    try {
        const response = await axiosInstance.post('/api/reset-password', {
            otp: otpData.otp_code,  
            new_password: otpData.new_password,
            confirm_password: otpData.confirm_password
        });
        if (response.status === 200) {
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => window.location.href = '/login', 2000);
        } else {
            setMessage(response.data.message || 'Failed to reset password. Please try again.');
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        setMessage(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
        setIsLoading(false);
    }
};  

    return (
        <div className='container'>
            <div className="forgot-wrapper">
                <div className="forgot-card">
                    <h2>Forgot Password</h2>
                    <p className="info">Enter your email to receive a One-Time Password (OTP).</p>

                    <form onSubmit={handleRequestOTP}>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleEmailChange}
                            placeholder="Email"
                            required
                            disabled={isLoading || showOtpSection}
                        />
                        <button type="submit" disabled={isLoading || showOtpSection}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>

                    {showOtpSection && (
                        <div className="otp-section">
                            <p className="info">Enter the OTP sent to your email and your new password.</p>

                            <form onSubmit={handleResetPassword}>
                                <input
                                    type="text"
                                    name="otp_code"
                                    value={otpData.otp_code}
                                    onChange={handleOtpChange}
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                    required
                                    disabled={isLoading}
                                />
                                <input
                                    type="password"
                                    name="new_password"
                                    value={otpData.new_password}
                                    onChange={handleOtpChange}
                                    placeholder="New Password"
                                    required
                                    disabled={isLoading}
                                />
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={otpData.confirm_password}
                                    onChange={handleOtpChange}
                                    placeholder="Confirm Password"
                                    required
                                    disabled={isLoading}
                                />
                                <button type="submit" disabled={isLoading}>
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form> <br/>

                            <div className="resend-otp">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={countdown > 0 || isLoading}
                                >
                                    Resend OTP {countdown > 0 && `(${countdown}s)`}
                                </button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ResetPasswordForm;
