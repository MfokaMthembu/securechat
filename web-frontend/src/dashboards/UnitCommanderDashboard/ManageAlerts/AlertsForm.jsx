import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './AlertsForm.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationSelector({ onLocationSelect, currentPosition }) {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng);
        }
    });
    
    return currentPosition ? (
        <Marker position={[currentPosition.lat, currentPosition.lng]} />
    ) : null;
}

export default function AlertsForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        attachments: null,
        latitude: '',
        longitude: '',
    });
    const [locationStatus, setLocationStatus] = useState('idle');
    const [showMap, setShowMap] = useState(false);
    const [mapCenter, setMapCenter] = useState([-29.3159, 27.4766]); // Default set to Maseru, Lesotho
    const [selectedPosition, setSelectedPosition] = useState(null);

    const handleChange = (e) => {
        const { id, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: files ? files : value
        }));
    };

    // Auto-detect current location
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocationStatus('error');
            alert('Geolocation is not supported by this browser.');
            return;
        }

        setLocationStatus('loading');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                setFormData(prev => ({
                    ...prev,
                    latitude: lat.toString(),
                    longitude: lng.toString()
                }));
                setMapCenter([lat, lng]);
                setSelectedPosition({ lat, lng });
                setLocationStatus('success');
            },
            (error) => {
                setLocationStatus('error');
                console.error('Error getting location:', error);
                alert('Unable to get your location. You can select location manually using the map.');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    // Handle map click to select location
    const handleMapClick = (latlng) => {
        setFormData(prev => ({
            ...prev,
            latitude: latlng.lat.toFixed(6),
            longitude: latlng.lng.toFixed(6)
        }));
        setSelectedPosition({ lat: latlng.lat, lng: latlng.lng });
        setLocationStatus('success');
    };

    // Auto-detect location on component mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    // Update selected position when coordinates change manually
    useEffect(() => {
        if (formData.latitude && formData.longitude) {
            const lat = parseFloat(formData.latitude);
            const lng = parseFloat(formData.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                setSelectedPosition({ lat, lng });
                setMapCenter([lat, lng]);
            }
        }
    }, [formData.latitude, formData.longitude]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const toggleMap = () => {
        setShowMap(!showMap);
    };

    return (
        <div className="alerts-form-container">
            <form onSubmit={handleSubmit} id="alertsForm">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input 
                        type="text" 
                        id="title" 
                        value={formData.title} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea 
                        id="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="attachments">Attachments</label>
                    <input 
                        type="file" 
                        id="attachments" 
                        onChange={handleChange}
                        accept=".jpg,.jpeg,.png,.gif,.pdf,.docx,.mp4,.mov,.avi,.wmv"
                        multiple
                    />
                    <small className="form-text">
                        Supported formats: Images (JPG, PNG, GIF), Documents (PDF, DOCX), Videos (MP4, MOV, AVI, WMV)
                    </small>
                </div>

                {/* Location Selection Section */}
                <div className="location-section">
                    <h3>Location Selection</h3>
                    <div className="location-buttons">
                        <button 
                            type="button" 
                            className="btn-location" 
                            onClick={getCurrentLocation}
                            disabled={locationStatus === 'loading'}
                        >
                            📍 {locationStatus === 'loading' ? 'Getting Location...' : 'Use My Current Location'}
                        </button>
                        <button 
                            type="button" 
                            className="btn-map" 
                            onClick={toggleMap}
                        >
                            🗺️ {showMap ? 'Hide Map' : 'Select on Map'}
                        </button>
                    </div>

                    {locationStatus === 'success' && (
                        <div className="location-status success">
                            ✅ Location selected successfully
                        </div>
                    )}
                    {locationStatus === 'error' && (
                        <div className="location-status error">
                            ❌ Please select location manually using the map
                        </div>
                    )}
                </div>

                {/* Map Section */}
                {showMap && (
                    <div className="map-container">
                        <div className="map-instructions">
                            Click anywhere on the map to set your alert location
                        </div>
                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            style={{ height: '300px', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <LocationSelector 
                                onLocationSelect={handleMapClick}
                                currentPosition={selectedPosition}
                            />
                        </MapContainer>
                    </div>
                )}

                {/* Coordinate Inputs */}
                <div className="coordinates-section">
                    <div className="form-group">
                        <label htmlFor="latitude">
                            Latitude *
                            {locationStatus === 'loading' && <span className="status-text"> (Detecting...)</span>}
                        </label>
                        <input 
                            type="number" 
                            id="latitude" 
                            value={formData.latitude} 
                            onChange={handleChange} 
                            step="any"
                            min="-90"
                            max="90"
                            placeholder="e.g. -29.315900"
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="longitude">Longitude *</label>
                        <input 
                            type="number" 
                            id="longitude" 
                            value={formData.longitude} 
                            onChange={handleChange}
                            step="any"
                            min="-180"
                            max="180"
                            placeholder="e.g. 27.476600"
                            required 
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                        Add Alert
                    </button>
                </div>
            </form>
        </div>
    );
}