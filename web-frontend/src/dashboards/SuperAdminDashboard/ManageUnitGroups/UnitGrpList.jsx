import React from 'react';
import './UnitGrpList.css';

function UnitGroupList({ unit_groups, onEdit, onDelete }) {

  return (
    <div className='userlist-card'>
      <div className='.table-wrapper' id=".table-wrapper">
          <table className="user-list">
          <thead className="user-list-header">
            <tr>
              <th><input type="checkbox" id="select-all" /></th>
              <th>ID</th>
              <th>Group Name</th>
              <th>Group Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className='user-list-body'>
            {unit_groups.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>No groups found</td>
              </tr>
            ) : null}

            {unit_groups.length > 0 &&
              unit_groups.map(function(group) {
                return (
                  <tr key={group.id}>
                    <td><input className='select-box' type="checkbox" /></td>
                    <td>{group.id}</td>
                    <td>{group.grp_name}</td>
                    <td>{group.grp_description}</td>
                    <td>{group.status}</td>
                    <td>  
                        <button className="button-btn-edit" onClick={() => onEdit(group)}>✏️ Edit</button>
                        <button className="button-btn-delete" onClick={() => onDelete(group.id)}> 🗑 Delete </button>   
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

export default UnitGroupList;
