import { useState, useEffect } from 'react';
import './UserForm.css';

export default function UserForm({ onClose, onSubmit, user }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        unit: '',
        rank: '',
        address: '',
        role: '',
        status: 'active',
    });

    // Pre-fills fields if editing user details
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.userDetail?.first_name || '',
                last_name: user.userDetail?.last_name || '',
                email: user.userDetail?.email || '',
                dob: user.userDetail?.dob || '',
                unit: user.userDetail?.unit || '',
                rank: user.userDetail?.rank || '',
                address: user.userDetail?.address || '',
                role: user.roles?.[0]?.name || 'regular-user',
                status: user.status || 'active',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} id="userForm">
            <div className="form-group">
                <label>First Name *</label>
                <input type="text" id="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Last Name *</label>
                <input type="text" id="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Email *</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" id="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label>Unit *</label>
                <select id="unit" value={formData.unit} onChange={handleChange} required>
                    <option value="">Select Unit</option>
                    <option value="Signal">Signal</option>
                    <option value="Special-Forces">Special Forces</option>
                    <option value="Logistics">Logistics</option>
                    <option value="111-Battalion">111 Battalion</option>
                    <option value="Inspector-general">Inspector General</option>
                </select>
            </div>

            <div className="form-group">
                <label>Rank *</label>
                <select id="rank" value={formData.rank} onChange={handleChange} required>
                    <option value="">Select Rank</option>
                    <option value="Private">Private</option>
                    <option value="Corporal">Corporal</option>
                    <option value="Sergeant">Sergeant</option>
                    <option value="Lieutenant">Lieutenant</option>
                    <option value="Captain">Captain</option>
                    <option value="Major">Major</option>
                    <option value="Colonel">Colonel</option>
                </select>
            </div>

            <div className="form-group">
                <label>Address</label>
                <input type="text" id="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="form-group">
                <label>Role *</label>
                <select id="role" value={formData.role} onChange={handleChange} required>
                    <option value="">Select Role</option>
                    <option value="super-admin">Super Admin</option>
                    <option value="sub-admin">Sub Admin</option>
                    <option value="regular-user">Regular User</option>
                </select>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary">
                    {user ? 'Update User' : 'Add User'}
                </button>
            </div>
        </form>
    );
}
