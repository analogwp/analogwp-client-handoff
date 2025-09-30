# Client Handoff Toolkit - Internal Testing Guide

## 🎯 Testing Overview

This guide is for internal testing of the newly enhanced Client Handoff Toolkit with the following major improvements:

---

## 🚀 Installation Instructions

### Prerequisites
- WordPress multisite installation
- PHP 7.4+ 
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation Steps
1. **Backup your database** before testing
2. Upload the plugin to `/wp-content/plugins/analogwp-client-handoff/`
3. Activate the plugin through WordPress admin
4. The database will automatically upgrade to support new features

---

## 🧪 Testing Scenarios

### 1. Task Management Testing

#### **Create New Tasks**
- [ ] Navigate to Client Handoff Dashboard
- [ ] Click "Add new" button in any kanban column (except Completed)
- [ ] Fill out task form with all fields
- [ ] Verify task appears in correct status column
- [ ] Check toast notification appears at top (not under admin bar)

#### **Edit Existing Tasks**
- [ ] Locate any existing task card
- [ ] Click the **edit (pencil) icon** next to delete button
- [ ] Verify modal opens with pre-filled data
- [ ] Modify task details and save
- [ ] Confirm changes persist after page refresh
- [ ] Test in both kanban and list views

#### **Task Deletion**
- [ ] Click delete button on any task
- [ ] Verify modern confirmation dialog appears (not browser alert)
- [ ] Confirm deletion removes task from view
- [ ] Check success toast notification

### 2. Timesheet System Testing

#### **Basic Time Entry**
- [ ] Click on any task to open detail view
- [ ] Scroll to "Timesheet" section in sidebar
- [ ] Add time entry: Enter hours (0-23) and minutes (0-59)
- [ ] Add description (optional)
- [ ] Click "Add Time" button
- [ ] Verify entry appears in list with total time updated
- [ ] Check success toast notification

#### **Time Entry Persistence**
- [ ] Add multiple time entries to a task
- [ ] Navigate back to task list
- [ ] Reopen the same task
- [ ] Verify all time entries are still there
- [ ] Open a different task
- [ ] Verify it has its own separate timesheet (not shared data)

#### **Time Entry Management**
- [ ] Remove time entries using X button
- [ ] Verify total time updates correctly
- [ ] Test with edge cases: 0 hours, 59 minutes, etc.
- [ ] Try invalid input (negative numbers, >59 minutes)
- [ ] Verify validation error messages

#### **Cross-Task Verification**
- [ ] Add time entries to Task A
- [ ] Switch to Task B and add different time entries
- [ ] Return to Task A and verify original entries unchanged
- [ ] Refresh page and verify both tasks maintain separate data

### 3. UI/UX Testing

#### **Toast Notifications**
- [ ] Perform various actions (create, edit, delete, time entries)
- [ ] Verify toasts appear at correct position (not under admin bar)
- [ ] Check different toast types: success (green), error (red)
- [ ] Test auto-dismiss timing
- [ ] Verify toasts don't interfere with workflow

#### **Button Functionality**
- [ ] Verify edit buttons appear on existing task cards
- [ ] Confirm NO edit button on "Add new task" modal
- [ ] Test event propagation (edit/delete don't trigger task detail view)
- [ ] Check button hover states and accessibility

#### **Responsive Design**
- [ ] Test on different screen sizes
- [ ] Verify timesheet interface works on mobile
- [ ] Check modal responsiveness
- [ ] Test kanban board on tablet view

### 4. Data Integrity Testing

#### **Database Persistence**
- [ ] Add timesheet data to multiple tasks
- [ ] Deactivate and reactivate plugin
- [ ] Verify all data persists
- [ ] Check database for timesheet column existence

#### **Error Handling**
- [ ] Test with network interruptions during save
- [ ] Try editing non-existent tasks
- [ ] Test with malformed timesheet data
- [ ] Verify graceful error messages

---

## 🐛 Bug Reporting Template

When reporting issues, please include:

```
**Bug Description:**
[Clear description of the issue]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happened]

**Environment:**
- WordPress Version: 
- PHP Version:
- Browser: 
- Device: 

**Screenshots:**
[If applicable]

**Console Errors:**
[Open browser dev tools, check for JavaScript errors]
```

---

## 🎯 Focus Areas for Testing

### High Priority
1. **Timesheet Persistence**: Most critical - ensure each task maintains separate timesheet data
2. **Edit Functionality**: Verify all task fields can be modified successfully
3. **Toast Positioning**: Confirm notifications appear correctly positioned

### Medium Priority  
1. **Cross-browser compatibility**
2. **Performance with large datasets**
3. **Mobile responsiveness**

### Low Priority
1. **Visual polish**
2. **Animation smoothness**
3. **Accessibility features**

---

## 🚨 Known Issues & Limitations

- **Timesheet API**: Currently stores as JSON in database (consider dedicated table for production)
- **Real-time Updates**: Changes don't sync across multiple browser tabs
- **Time Validation**: Basic validation implemented (hours 0-23, minutes 0-59)

---

## ✅ Testing Checklist

### Pre-Testing Setup
- [ ] Fresh WordPress multisite installation
- [ ] Plugin uploaded and activated
- [ ] Sample tasks created for testing
- [ ] Browser dev tools open for error monitoring

### Core Functionality
- [ ] Task creation works
- [ ] Task editing works  
- [ ] Task deletion works
- [ ] Timesheet add/remove works
- [ ] Toast notifications work
- [ ] Data persists across sessions

### Edge Cases
- [ ] Empty timesheet data
- [ ] Invalid time values
- [ ] Network errors during save
- [ ] Multiple tasks with different timesheet data
- [ ] Cross-browser testing

### Final Verification
- [ ] No JavaScript console errors
- [ ] All features work as documented
- [ ] Performance acceptable
- [ ] Ready for production deployment

---

## 📞 Support & Questions

For testing support or questions:
- Create GitHub issues for bugs
- Tag @lushkant for urgent issues
- Include browser console logs for errors
- Provide step-by-step reproduction steps

**Happy Testing! 🚀**