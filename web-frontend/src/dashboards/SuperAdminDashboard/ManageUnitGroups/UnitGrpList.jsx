import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../services/axios';
import './UnitGrpList.css';

  export default function UnitGroupList({ 
    groups, 
    onEdit, 
    onDelete, 
    onGroupSelect, 
    selectedGroup, 
    selectionMode = false 
  }) {

    const [localGroups, setLocalGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch groups for the modal
    const fetchGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/api/superadmin/get-groups');
        setLocalGroups(response.data.data || []);
      } catch (err) {
        console.error('Failed to fetch groups:', err);
        setError('Failed to load groups');
        setLocalGroups([]);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!groups && selectionMode) {
        fetchGroups();
      } else if (groups) {
        setLocalGroups(groups);
      }
    }, [groups, selectionMode]);

    const handleGroupSelection = (group) => {
      if (onGroupSelect) {
        // If a group is selected again, deselect it
        if (selectedGroup && selectedGroup.id === group.id) {
          onGroupSelect(null);
        } else {
          onGroupSelect(group);
        }
      }
    };

    const isGroupSelected = (group) => {
      return selectedGroup && selectedGroup.id === group.id;
    };

    // Use provided groups or existing groups
    const displayGroups = groups || localGroups || [];

    if (loading) {
      return (
        <div className='userlist-card'>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Loading groups...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='userlist-card'>
          <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
            {error}
            <br />
            <button onClick={fetchGroups} style={{ marginTop: '10px' }}>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className='userlist-card'>
        <div className='.table-wrapper' id=".table-wrapper">
            <table className="user-list">
            <thead className="user-list-header">
              <tr>
                {selectionMode && <th>Select</th>}
                <th>ID</th>
                <th>Group Name</th>
                <th>Group Description</th>
                <th>Status</th>
                {!selectionMode && <th>Actions</th>}
              </tr>
            </thead>
            <tbody className='user-list-body'>
              {displayGroups.length === 0 ? (
                <tr>
                  <td colSpan={selectionMode ? "5" : "6"} style={{ textAlign: 'center' }}>
                    No groups found
                  </td>
                </tr>
              ) : null}

              {displayGroups.length > 0 &&
                displayGroups.map(group => (
                    <tr 
                      key={group.id}
                      className={`${isGroupSelected(group) ? 'selected-group-row' : ''} ${selectionMode ? 'selectable-row' : ''}`}
                      onClick={selectionMode ? () => handleGroupSelection(group) : undefined}
                      style={selectionMode ? { cursor: 'pointer' } : {}}
                    >
                      {selectionMode && (
                        <td onClick={(e) => e.stopPropagation()}>
                          <input 
                            className='select-box' 
                            type="radio" 
                            name="selectedGroup"
                            checked={isGroupSelected(group) || false}  
                            onChange={() => handleGroupSelection(group)}
                          />
                        </td>
                      )}
                      <td>{group.id}</td>
                      <td>
                        <strong>{group.grp_name || ''}</strong>
                        {isGroupSelected(group) && (
                          <span className="selected-indicator"> ✓</span>
                        )}
                      </td>
                      <td>{group.grp_description || ''}</td>
                      <td>
                        <span className={`status-badge ${group.status ? group.status.toLowerCase() : 'unknown'}`}>
                          {group.status || 'Unknown'}
                        </span>
                      </td>
                      {!selectionMode && (
                        <td className="actions-cell">  
                            <button className="button-btn-edit" onClick={() => onEdit(group)}>✏️ Edit</button>
                            <button className="button-btn-delete" onClick={() => onDelete(group.id)}> 🗑 Delete </button>   
                        </td>
                      )}
                    </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }