import React from 'react';
import './UserList.css';

function UserList({ 
  users, 
  onEdit, 
  onDelete, 
  onUserSelect, 
  selectedUser, 
  selectionMode = false 
}) {

  const handleUserSelection = (user) => {
    if (onUserSelect) {
      // If the same user is selected again, deselect them
      if (selectedUser && selectedUser.id === user.id) {
        onUserSelect(null);
      } else {
        onUserSelect(user);
      }
    }
  };

  const isUserSelected = (user) => {
    return selectedUser && selectedUser.id === user.id;
  };

  return (
    <div className='userlist-card'>
      <div className='.table-wrapper' id=".table-wrapper">
          <table className="user-list">
          <thead className="user-list-header">
            <tr>
              {selectionMode && <th>Select</th>}
              <th>ID</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Unit</th>
              <th>Rank</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='user-list-body'>
            {users.length === 0 ? (
              <tr>
                <td colSpan={selectionMode ? "11" : "10"} style={{ textAlign: 'center' }}>
                  No users found
                </td>
              </tr>
            ) : null}

                {users.length > 0 &&
                  users.map(user => (
                    <tr 
                      key={user.id}
                      className={isUserSelected(user) ? 'selected-user-row' : ''}
                    >
                      {selectionMode && (
                        <td>
                          <input 
                            className='select-box' 
                            type="radio" 
                            name="selectedUser"
                            checked={isUserSelected(user) || false}
                            onChange={() => handleUserSelection(user)}
                          />
                        </td>
                      )}
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.userDetail?.first_name || ''}</td>
                      <td>{user.userDetail?.last_name || ''}</td>
                      <td>{user.userDetail?.email || ''}</td>
                      <td>{user.userDetail?.unit || ''}</td>
                      <td>{user.userDetail?.rank || ''}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.roles.map(r => r.name).join(', ')}</td>
                      <td className="actions-cell">  
                        <button className="button-btn-edit" onClick={() => onEdit(user)}>✏️ Edit</button>
                        <button className="button-btn-delete" onClick={() => onDelete(user.id)}>🗑 Delete</button>   
                      </td>
                    </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

export default UserList;