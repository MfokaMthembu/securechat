import { useState } from 'react';
import './UnitGrpForm.css';

export default function UnitGrpForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        grp_name: '',
        grp_description: '',
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
        <form onSubmit={handleSubmit} id="UnitGrpForm">
            <div className="form-group">
                <label className="form-label" htmlFor='grp_name'>Group Name *</label>
                <input  className="form-input" type="text" id="grp_name" value={formData.grp_name} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="grp_description">Group Description *</label>
                <input className="form-input" type="text" id="grp_description" value={formData.grp_description} onChange={handleChange} required />
            </div>

            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary">Add Unit Group</button>
            </div>
        </form>
    );
}
