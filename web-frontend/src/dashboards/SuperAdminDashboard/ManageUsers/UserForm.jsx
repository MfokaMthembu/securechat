import { useState } from 'react';
import './UserForm.css';

export default function UserForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        unit: '',
        rank: '',
        address: '',
        role: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting formData:', formData);
        // Pass data to parent
        onSubmit(formData); 

    };

    return (
        <form onSubmit={handleSubmit} id="userForm">
            <div className="form-group">
                <label className="form-label">First Name *</label>
                <input className="form-input" type="text" id="first_name" value={formData.first_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input className="form-input" type="text" id="last_name" value={formData.last_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="email">Email *</label>
                <input className='form-input' type="email" id="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="dob">Date of Birth *</label>
                <input className="form-input" type="date" id="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="unit">Unit *</label>
                <select id="unit" value={formData.unit} onChange={handleChange} className="form-input" required>
                    <option value="">Select Unit</option>
                    <option value="Signal">Signal</option>
                    <option value="Special-Forces">Special Forces</option>
                    <option value="Logistics">Logistics</option>
                    <option value="111-Battalion">111 Battalion</option>
                    <option value="Inspector-general">Inspector General</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="rank">Rank *</label>
                <select id="rank" value={formData.rank} onChange={handleChange} className="form-input" required>
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
                <label className="form-label" htmlFor="address">Address</label>
                <input type="text" id="address" value={formData.address} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="role">Role *</label>
                <select id="role" value={formData.role} onChange={handleChange} className="form-input" required>
                    <option value="">Select Role</option>
                    <option value="sub-admin">sub-admin</option>
                    <option value="regular-user">regular-user</option>
                </select>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary">Add User</button>
            </div>
        </form>
    );
}
