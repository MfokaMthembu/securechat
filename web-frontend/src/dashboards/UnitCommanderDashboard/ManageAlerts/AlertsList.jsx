import React from "react";
import "./AlertsList.css"; 

function AlertsList({ alerts, OnEdit }) {
    

  return (
    <div className="alerts-container">
      {alerts.map((alert) => (
        <div key={alert.id} className="alert-card">
          <div className="alert-header">
            <span className="alert-icon">🔔</span>
            <h3 className="alert-title">{alert.title}</h3>
          </div>
          <p className="alert-message">{alert.message}</p>

          {alert.latitude && alert.longitude && (
            <a
              href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="alert-location"
            >
              📍 View Location
            </a>
          )}

          {alert.attachments && alert.attachments.length > 0 && (
            <div className="alert-attachments">
              {alert.attachments.map((file, idx) => (
                <a key={idx} href={file} target="_blank" rel="noopener noreferrer">
                  📎 Attachment {idx + 1}
                </a>
              ))}
            </div>
          )}

          <div className="alert-footer">
            <small>{new Date(alert.created_at).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AlertsList;
