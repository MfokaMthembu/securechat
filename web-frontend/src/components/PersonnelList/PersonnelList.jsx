import React from 'react';
import './PersonnelList.css'; // Fixed typo in CSS import

function PersonnelList({
   users, 
   onUserSelect,
   selectedUser, 
   selectedUsers = [], 
   selectionMode = false,
   multipleSelection = false 
 }) {

   const handleUserSelection = (user) => {
     if (!onUserSelect) return;

     if (multipleSelection) {
       // Multiple selection logic
       const currentSelected = selectedUsers || [];
       const isCurrentlySelected = currentSelected.some(u => u.id === user.id);
       
       let newSelection;
       if (isCurrentlySelected) {
         // Remove user from selection
         newSelection = currentSelected.filter(u => u.id !== user.id);
       } else {
         // Add user to selection
         newSelection = [...currentSelected, user];
       }
       
       onUserSelect(newSelection);
     } else {
       // Single selection logic (original behavior)
       if (selectedUser && selectedUser.id === user.id) {
         onUserSelect(null);
       } else {
         onUserSelect(user);
       }
     }
   };

   const isUserSelected = (user) => {
     if (multipleSelection) {
       return selectedUsers && selectedUsers.some(u => u.id === user.id);
     } else {
       return selectedUser && selectedUser.id === user.id;
     }
   };

   const handleSelectAll = () => {
     if (!multipleSelection || !onUserSelect) return;
     
     const currentSelected = selectedUsers || [];
     if (currentSelected.length === users.length) {
       // Deselect all
       onUserSelect([]);
     } else {
       // Select all
       onUserSelect([...users]);
     }
   };

   const isAllSelected = () => {
     if (!multipleSelection) return false;
     return selectedUsers && users.length > 0 && selectedUsers.length === users.length;
   };

   const isSomeSelected = () => {
     if (!multipleSelection) return false;
     return selectedUsers && selectedUsers.length > 0 && selectedUsers.length < users.length;
   };

   return (
     <div className='userlist-card'>
       <div className='table-wrapper' id="table-wrapper"> {/* Fixed className */}
           <table className="user-list">
           <thead className="user-list-header">
             <tr>
               {selectionMode && (
                 <th>
                   {multipleSelection ? (
                     <input
                       type="checkbox"
                       checked={isAllSelected()}
                       ref={input => {
                         if (input) input.indeterminate = isSomeSelected();
                       }}
                       onChange={handleSelectAll}
                       title={isAllSelected() ? "Deselect All" : "Select All"}
                     />
                   ) : (
                     "Select"
                   )}
                 </th>
               )}
               <th>ID</th>
               <th>Username</th>
               <th>First Name</th>
               <th>Last Name</th>
               <th>Email</th>
               <th>Unit</th>
               <th>Rank</th>
               <th>Status</th>
               <th>Role</th>
             </tr>
           </thead>
           <tbody className='user-list-body'>
             {users.length === 0 ? (
               <tr>
                 <td colSpan={selectionMode ? "10" : "9"} style={{ textAlign: 'center' }}>
                   No users found
                 </td>
               </tr>
             ) : (
               users.map(user => (
                 <tr
                    key={user.id}
                   className={isUserSelected(user) ? 'selected-user-row' : ''}
                 >
                   {selectionMode && (
                     <td>
                       <input
                          className='select-box'
                          type="checkbox"
                          name="selectedUser"
                         checked={isUserSelected(user)}
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
                 </tr>
               ))
             )}
           </tbody>
         </table>
       </div>
       
       {/* Selection Summary for Multiple Selection */}
       {multipleSelection && selectedUsers && selectedUsers.length > 0 && (
         <div className="selection-summary" style={{ 
           padding: '10px', 
           backgroundColor: '#e8f5e8', 
           border: '1px solid #28a745',
           borderRadius: '4px',
           margin: '10px 0',
           fontSize: '14px'
         }}>
           <strong>{selectedUsers.length}</strong> user{selectedUsers.length !== 1 ? 's' : ''} selected
         </div>
       )}
     </div>
 );
}

export default PersonnelList;