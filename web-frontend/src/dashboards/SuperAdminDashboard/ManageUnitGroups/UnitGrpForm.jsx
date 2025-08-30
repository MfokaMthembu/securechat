import { useState, useEffect} from 'react';
import './UnitGrpForm.css';

export default function UnitGrpForm({ onClose, onSubmit, groups }) {
    const [formData, setFormData] = useState({
        grp_name: '',
        grp_description: '',
        status: 'Open',
    });

    // prefills form when udating an existing group
    useEffect(() => {
        if (groups) {
            setFormData({
                grp_name: groups?.grp_name || '',
                grp_description: groups.grp_description || '',
                status: groups.status || 'Open',
            });
        }
    }, [groups]);

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
                <button type="submit" className="btn-primary">
                    {groups ? 'Update Group' : 'Add Group'}
                </button>
            </div>
        </form>
    );
}
