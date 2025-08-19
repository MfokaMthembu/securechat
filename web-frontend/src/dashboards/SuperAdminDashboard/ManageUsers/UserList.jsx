import React from 'react';
import './UserList.css';

function UserList({ users, onEdit, onDelete }) {

  return (
    <div className='userlist-card'>
      <div className='.table-wrapper' id=".table-wrapper">
          <table className="user-list">
          <thead className="user-list-header">
            <tr>
              <th><input type="checkbox" id="select-all" /></th>
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
                <td colSpan="10" style={{ textAlign: 'center' }}>No users found</td>
              </tr>
            ) : null}

            {users.length > 0 &&
              users.map(function(user) {
                return (
                  <tr key={user.id}>
                    <td><input className='select-box' type="checkbox" /></td>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.unit}</td>
                    <td>{user.rank}</td>
                    <td>{user.status}</td>
                    <td>{user.role_name}</td>
                    <td>  
                        <button className="button-btn-edit" onClick={() => onEdit(user)}>✏️ Edit</button>
                        <button className="button-btn-delete" onClick={() => onDelete(user.id)}> 🗑 Delete </button>   
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
    
  );
}

export default UserList;
