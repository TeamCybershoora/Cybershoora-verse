"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, CartesianGrid, Tooltip } from 'recharts';
import { toast, Toaster } from 'react-hot-toast';
import CourseCard from 'components/CourseCard';
import EditHomepage from './EditHomepage';



const SuperAdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [adminData, setAdminData] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [teacherCount, setTeacherCount] = useState(null);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [memberType, setMemberType] = useState('student');
  const [teachers, setTeachers] = useState([]);
  const [hoveredTeacher, setHoveredTeacher] = useState(null);
  const [hoveredTeacherPos, setHoveredTeacherPos] = useState({ top: 0, left: 0 });
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [hoveredStudentPos, setHoveredStudentPos] = useState({ top: 0, left: 0 });
  const [studentMousePos, setStudentMousePos] = useState({ x: 0, y: 0 });
  const [teacherMousePos, setTeacherMousePos] = useState({ x: 0, y: 0 });
  const [isStudentHovered, setIsStudentHovered] = useState(false);
  const [isTeacherHovered, setIsTeacherHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [courseImageFile, setCourseImageFile] = useState(null);
  const [courseImageUrl, setCourseImageUrl] = useState('');
  const [courseImagePreview, setCourseImagePreview] = useState('');
  const [courseForm, setCourseForm] = useState({
    originalPrice: '',
    currentPrice: '',
    discount: '',
    teacherName: '',
    technologies: [],
    technologiesInput: ''
  });
  const [openDropdowns, setOpenDropdowns] = React.useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, course: null });
  const [editModal, setEditModal] = useState({ open: false, course: null, form: null });
  const [viewDetailsModal, setViewDetailsModal] = useState({ open: false, course: null });
  const [bannerText, setBannerText] = useState('🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!');
  const [bannerActive, setBannerActive] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [fromDay, setFromDay] = useState('');
  const [chartMemberType, setChartMemberType] = useState('student');

  // Move fetchCourses to top-level so it is defined before handleAddCourse
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/profile?courses=1');
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch { }
  };

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const res = await fetch('/api/admin/profile');
        const data = await res.json();
        if (data.success && data.admin) {
          setAdminData(data.admin);
        } else {
          // If not authenticated, redirect to admin login
          window.location.href = '/admin';
          return;
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        // If error, redirect to admin login
        window.location.href = '/admin';
        return;
      }
    }
    fetchAdminData();
    // Fetch student/teacher counts
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/profile?stats=1');
        const data = await res.json();
        if (data.success) {
          setStudentCount(data.studentCount);
          setTeacherCount(data.teacherCount);
        }
      } catch { }
    }
    fetchStats();
    // Fetch all courses for dropdown
    fetchCourses();
    // Fetch teachers for member panel
    async function fetchTeachers() {
      try {
        const res = await fetch('/api/admin/profile?teachers=1');
        const data = await res.json();
        if (data.success) setTeachers(data.teachers);
      } catch { }
    }
    fetchTeachers();
  }, []);

  // Fetch students when selectedCourse changes
  useEffect(() => {
    async function fetchStudents() {
      try {
        let url = '/api/admin/profile?students=1';
        if (selectedCourse) url += `&course=${encodeURIComponent(selectedCourse)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
          setCurrentPage(1); // Reset to first page when course changes
          console.log('Students loaded:', data.students.length);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    }
    fetchStudents();
  }, [selectedCourse]);

  // Sample data for charts
  const monthlyStats = [
    { month: 'Jan', value: 3 },
    { month: 'Feb', value: 4 },
    { month: 'Mar', value: 2 },
    { month: 'Apr', value: 5 },
    { month: 'May', value: 3 },
    { month: 'Jun', value: 4 }
  ];

  const flightShareData = [
    { name: 'Boeing', value: 40, color: '#F59E0B' },
    { name: 'Airbus', value: 35, color: '#059669' },
    { name: 'Others', value: 25, color: '#0EA5E9' }
  ];

  const scheduleData = [
    { month: 'Jan', flights: 2800 },
    { month: 'Feb', flights: 3200 },
    { month: 'Mar', flights: 2900 },
    { month: 'Apr', flights: 3500 },
    { month: 'May', flights: 3100 },
    { month: 'Jun', flights: 3800 }
  ];

  const activeUsers = [
    { id: 1, avatar: '👨‍💼' },
    { id: 2, avatar: '👩‍💼' },
    { id: 3, avatar: '👨‍🎓' },
    { id: 4, avatar: '👩‍🎓' },
    { id: 5, avatar: '+5' }
  ];

  const handleStudentMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update position directly without setState to avoid lag
    const lightElement = e.currentTarget.querySelector('.mouse-light');
    if (lightElement) {
      lightElement.style.left = `${x}px`;
      lightElement.style.top = `${y}px`;
    }

    setStudentMousePos({ x, y });
  };

  // Handle mouse movement for teacher card
  const handleTeacherMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update position directly without setState to avoid lag
    const lightElement = e.currentTarget.querySelector('.mouse-light');
    if (lightElement) {
      lightElement.style.left = `${x}px`;
      lightElement.style.top = `${y}px`;
    }

    setTeacherMousePos({ x, y });
  };

  // Handler for file input
  const handleCourseImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseImageFile(file);
      setCourseImagePreview(URL.createObjectURL(file));
      setCourseImageUrl(''); // Clear URL if file is chosen
    }
  };

  // Handler for image URL input
  const handleCourseImageUrlChange = (e) => {
    const url = e.target.value.trim();
    setCourseImageUrl(url);
    setCourseImageFile(null); // Clear file if URL is entered

    // Only set preview if URL is not empty
    if (url) {
      setCourseImagePreview(url);
    } else {
      setCourseImagePreview('');
    }
  };


  // Pagination logic
  const getCurrentItems = () => {
    let items = memberType === 'student' ? students : teachers;

    // Sort students by ID card number in ascending order
    if (memberType === 'student') {
      items = [...items].sort((a, b) => {
        // Handle cases where idCardNumber might be null or undefined
        const aId = a.idCardNumber || '';
        const bId = b.idCardNumber || '';

        // Extract numeric part from ID card numbers (e.g., "ASHROR0001" -> 1, "ASHROR0002" -> 2)
        const extractNumber = (id) => {
          // Find the last sequence of digits in the string
          const match = id.match(/(\d+)$/);
          return match ? parseInt(match[1]) : 0;
        };

        const aNum = extractNumber(aId);
        const bNum = extractNumber(bId);

        // Sort by the numeric part
        return aNum - bNum;
      });
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil((memberType === 'student' ? students.length : teachers.length) / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to first page when member type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [memberType]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        // Clear admin data from state
        setAdminData(null);
        // Redirect to admin login page
        window.location.href = '/admin';
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Banner functions
  const handlePreviewBanner = () => {
    localStorage.setItem('adBannerText', bannerText);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'adBannerText',
      newValue: bannerText
    }));
    toast.success('Preview applied! Check the banner at the top of the page.');
  };

  const handleSaveBanner = () => {
    try {
      localStorage.setItem('adBannerText', bannerText);
      localStorage.setItem('adBannerActive', bannerActive.toString());
      
      // Trigger storage event for real-time updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'adBannerText',
        newValue: bannerText
      }));

      toast.success('Banner settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save banner settings');
    }
  };

  const handleResetBanner = () => {
    const defaultText = '🎉 Sale! Save 20% TODAY on all Courses Use: GADDARIKARBEY 🎁 Ends SOON! Don\'t miss your chance to transform your career!';
    setBannerText(defaultText);
    setBannerActive(true);
    toast.success('Banner reset to default');
  };

  // Load banner settings on component mount
  useEffect(() => {
    const savedText = localStorage.getItem('adBannerText');
    if (savedText) {
      setBannerText(savedText);
    }

    const savedActive = localStorage.getItem('adBannerActive');
    if (savedActive !== null) {
      setBannerActive(savedActive === 'true');
    }
  }, []);

  // Add form submission handler
  const handleAddCourse = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', e.target.title.value);
    formData.append('duration', e.target.duration.value);
    formData.append('languages', e.target.languages.value);
    formData.append('originalPrice', courseForm.originalPrice);
    formData.append('currentPrice', courseForm.currentPrice);
    formData.append('discount', courseForm.discount ? courseForm.discount + '% OFF' : '');
    formData.append('details', e.target.details.value);

    // Handle image (file takes priority over URL)
    if (courseImageFile) {
      formData.append('image', courseImageFile);
    } else if (courseImageUrl) {
      formData.append('image', courseImageUrl);
    } else {
      alert('Please select an image for the course');
      return;
    }

    if (courseForm.teacherName) {
      formData.append('teacherName', courseForm.teacherName);
    }

    formData.append('technologies', courseForm.technologies.join(', '));

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Course added successfully!');
        e.target.reset();
        setCourseImageFile(null);
        setCourseImageUrl('');
        setCourseImagePreview('');
        setCourseForm({
          originalPrice: '',
          currentPrice: '',
          discount: '',
          teacherName: '',
          technologies: [],
          technologiesInput: ''
        });
        await fetchCourses();
        return;
      } else {
        toast.error('Error adding course: ' + data.message);
        return;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error adding course. Please try again.');
    }
  };

  // Add this handler in the SuperAdminDashboard component
  const handleDeleteCourse = (course) => {
    setDeleteModal({ open: true, course });
  };

  const confirmDeleteCourse = async () => {
    if (!deleteModal.course) return;
    try {
      const res = await fetch(`/api/courses?id=${deleteModal.course._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCourses((prev) => prev.filter((c) => c._id !== deleteModal.course._id));
        toast.success('Course deleted successfully!');
      } else {
        toast.error(data.message || 'Failed to delete course');
      }
    } catch (err) {
      toast.error('Error deleting course');
    }
    setDeleteModal({ open: false, course: null });
  };

  // Edit button handler
  const handleEditCourse = (course) => {
    // Clean up discount format for editing (remove "% OFF" if present)
    const cleanDiscount = course.discount ? course.discount.replace('% OFF', '').trim() : '';
    setEditModal({ 
      open: true, 
      course, 
      form: { 
        ...course, 
        discount: cleanDiscount, // Use cleaned discount for editing
        technologiesInput: '', 
        imagePreview: course.image 
      } 
    });
  };

  // View details button handler
  const handleViewDetails = (course) => {
    setViewDetailsModal({ open: true, course });
  };

  // Edit modal field change handler
  const handleEditModalChange = (field, value) => {
    setEditModal((prev) => ({
      ...prev,
      form: { ...prev.form, [field]: value }
    }));
  };

  // Edit modal technologies input handler
  const handleEditModalTechKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && editModal.form.technologiesInput && editModal.form.technologiesInput.trim()) {
      e.preventDefault();
      const newTechs = editModal.form.technologiesInput.split(',').map(t => t.trim()).filter(Boolean);
      setEditModal((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          technologies: [
            ...(Array.isArray(prev.form.technologies) ? prev.form.technologies : []),
            ...newTechs.filter(t => t && !(prev.form.technologies || []).includes(t))
          ],
          technologiesInput: ''
        }
      }));
    }
  };

  const handleEditModalTechPaste = (e) => {
    const paste = e.clipboardData.getData('text');
    if (paste.includes(',')) {
      e.preventDefault();
      const newTechs = paste.split(',').map(t => t.trim()).filter(Boolean);
      setEditModal((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          technologies: [
            ...(Array.isArray(prev.form.technologies) ? prev.form.technologies : []),
            ...newTechs.filter(t => t && !(prev.form.technologies || []).includes(t))
          ],
          technologiesInput: ''
        }
      }));
    }
  };

  const handleEditModalRemoveTech = (idx) => {
    setEditModal((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        technologies: prev.form.technologies.filter((_, i) => i !== idx)
      }
    }));
  };

  const handleEditModalImageFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditModal((prev) => ({
        ...prev,
        form: {
          ...prev.form,
          imageFile: file,
          imagePreview: URL.createObjectURL(file),
          image: ''
        }
      }));
    }
  };

  const handleEditModalImageUrl = (e) => {
    const url = e.target.value.trim();
    setEditModal((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        image: url,
        imageFile: null,
        imagePreview: url || prev.form.imagePreview
      }
    }));
  };

  const handleEditModalSave = async () => {
    const formData = new FormData();
    formData.append('title', editModal.form.title);
    formData.append('duration', editModal.form.duration);
    formData.append('languages', Array.isArray(editModal.form.languages) ? editModal.form.languages.join(', ') : editModal.form.languages);
    formData.append('originalPrice', editModal.form.originalPrice);
    formData.append('currentPrice', editModal.form.currentPrice);
    formData.append('discount', editModal.form.discount ? editModal.form.discount + '% OFF' : '');
    formData.append('details', editModal.form.details);
    formData.append('badge', editModal.form.badge || 'INSTITUTE');
    formData.append('link', editModal.form.link || '#');
    formData.append('teacherName', editModal.form.teacherName || '');
    formData.append('technologies', Array.isArray(editModal.form.technologies) ? editModal.form.technologies.join(', ') : editModal.form.technologies);
    if (editModal.form.imageFile) {
      formData.append('image', editModal.form.imageFile);
    } else if (editModal.form.image) {
      formData.append('image', editModal.form.image);
    }
    try {
      const res = await fetch(`/api/courses?id=${editModal.course._id}`, {
        method: 'PATCH',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Course updated successfully!');
        setEditModal({ open: false, course: null, form: null });
        await fetchCourses();
      } else {
        toast.error(data.message || 'Failed to update course');
      }
    } catch (err) {
      toast.error('Error updating course');
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-inner">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="avatar">
              {adminData?.profilePhoto ? (
                <img src={adminData.profilePhoto} alt={adminData.fullName || "Admin"} />
              ) : (
                <img src="/assets/shoora-logo.svg" alt="Admin" />
              )}
            </div>
            <div className="user-name" style={{ color: "#9747ff" }}>{adminData?.fullName ? adminData.fullName.toUpperCase() : "Super Admin"}</div>
          </div>

          {/* Navigation Menu */}
          <div className="nav-menu">
            <button className={`nav-item${activeSection === 'dashboard' ? ' active' : ''}`} onClick={() => setActiveSection('dashboard')}> <span>Dashboard</span></button>
            <button className={`nav-item${activeSection === 'add-courses' ? ' active' : ''}`} onClick={() => setActiveSection('add-courses')}><span>Add Courses</span></button>
            <button className={`nav-item${activeSection === 'edit-courses' ? ' active' : ''}`} onClick={() => setActiveSection('edit-courses')}><span>Edit Courses</span></button>
            <button className={`nav-item${activeSection === 'ad-banner-edit' ? ' active' : ''}`} onClick={() => setActiveSection('ad-banner-edit')}><span>Ad Banner Edit</span></button>
            <button className={`nav-item${activeSection === 'edit-homepage' ? ' active' : ''}`} onClick={() => setActiveSection('edit-homepage')}><span>Edit Home Page</span></button>
            <button className="nav-item"><span>Transactions</span></button>
            <button className="nav-item"><span>Products</span></button>
            <button className="nav-item"><span>Certificates</span></button>
            <button className="nav-item"><span>Discount Coupon</span></button>
            <button className="logout-button" onClick={handleLogout}><span>Logout</span></button>
          </div>

          {/* Logo Section */}
          <div className="shoora-logo-wrap">
            <img src="/assets/Shooraverse-text.svg" alt="Shooraverse" className="shoora-logo" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Student Hover Card */}
        {hoveredStudent && (
          <div
            className="student-hover-card"
            style={{
              position: 'fixed',
              top: hoveredStudentPos.top,
              left: hoveredStudentPos.left,
              zIndex: 1000,
              background: 'linear-gradient(145deg, rgba(151, 71, 255, 0.95), rgba(124, 58, 237, 0.95))',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(151, 71, 255, 0.3)',
              borderRadius: '16px',
              padding: '1.5rem',
              minWidth: '280px',
              boxShadow: '0 8px 32px rgba(151, 71, 255, 0.3)',
              color: 'white',
              fontFamily: 'NeueMachina, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={() => window.open(`/admin/student/${hoveredStudent._id}`, '_blank')}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '0 12px 40px rgba(151, 71, 255, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 8px 32px rgba(151, 71, 255, 0.3)';
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              {/* Profile Photo */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}>
                <img
                  src={hoveredStudent.profilePhoto || '/assets/shoora-logo.svg'}
                  alt={hoveredStudent.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Student Name */}
              <h3 style={{
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: '600',
                textAlign: 'center',
                color: '#fff'
              }}>
                {hoveredStudent.fullName}
              </h3>

              {/* ID Card Number */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                ID: {hoveredStudent.idCardNumber || '--'}
              </div>

              {/* Details */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Email:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredStudent.email || '--'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Mobile:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredStudent.phone || '--'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Guardian:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredStudent.guardianName || '--'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Guardian Mobile:</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredStudent.guardianPhone || '--'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Course: </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredStudent.course || '--'}</span>
                </div>
              </div>

              {/* Click indicator */}
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                👆 Click to view full profile
              </div>
            </div>
          </div>
        )}

        {/* Only show dashboard content if Dashboard is active */}
        {activeSection === 'dashboard' && (
          <>
            {/* Top Stats Cards */}
            <div className="stats-cards">
              <div
                className="stat-card student"
                onMouseMove={handleStudentMouseMove}
                onMouseEnter={() => setIsStudentHovered(true)}
                onMouseLeave={() => setIsStudentHovered(false)}
              >
                {isStudentHovered && (
                  <div
                    className="mouse-light orange"
                    style={{
                      left: '0px',
                      top: '0px',
                    }}
                  />
                )}
                <div className="card-icon">
                  <img src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Boy%20chacrter%202.png?updatedAt=1752181265816" />
                </div>
                <div className="card-content">
                  <div className="card-text">
                    <h4>Students</h4>
                    <h2>{studentCount !== null ? studentCount : '--'}</h2>
                  </div>
                </div>
              </div>

              <div
                className="stat-card teacher"
                onMouseMove={handleTeacherMouseMove}
                onMouseEnter={() => setIsTeacherHovered(true)}
                onMouseLeave={() => setIsTeacherHovered(false)}
              >
                {isTeacherHovered && (
                  <div
                    className="mouse-light purple"
                    style={{
                      left: '0px',
                      top: '0px',
                    }}
                  />
                )}
                <div className="card-icon">
                  <img src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Boy%20chacrter%202.png?updatedAt=1752181265816" />
                </div>
                <div className="card-content">
                  <div className="card-text">
                    <h4>Teachers</h4>
                    <h2>{teacherCount !== null ? teacherCount : '--'}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="content-grid">
              {/* Last Trips */}
              <div className="content-card last-trips">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <h3 style={{ margin: 0 }}>Members</h3>
                  <div className="member-toggle">
                    <button
                      className={`toggle-btn${memberType === 'student' ? ' active' : ''}`}
                      onClick={() => setMemberType('student')}
                    >Student</button>
                    <button
                      className={`toggle-btn${memberType === 'teacher' ? ' active' : ''}`}
                      onClick={() => setMemberType('teacher')}
                    >Teacher</button>
                  </div>
                  {memberType === 'student' && (
                    <div style={{ marginTop: 8 }}>
                      <label htmlFor="course-select" className="course-label">Course:</label>
                      <select
                        id="course-select"
                        className="course-dropdown"
                        value={selectedCourse}
                        onChange={e => setSelectedCourse(e.target.value)}
                      >
                        <option value="">All Courses</option>
                        {courses.map((course, idx) => (
                          <option key={course.title || idx} value={course.title}>{course.title}</option>
                        ))}
                      </select>

                    </div>
                  )}
                </div>
                <p className="subtitle">{memberType === 'student' ? 'Students' : 'Teachers'} Panel</p>
                {memberType === 'student' ? (
                  <>
                    <div className="trips-header">
                      <span>Student</span>
                      <span>Contact</span>
                      <span>ID Card No</span>
                      <span>Class<b>/</b>Course</span>
                      <span>Fee</span>
                      <span>College<b>/</b>School</span>
                    </div>
                    {students.length === 0 ? (
                      <div style={{ color: '#fff', textAlign: 'center', margin: '2rem 0' }}>No students found.</div>
                    ) : (
                      <>
                        {getCurrentItems().map((student, index) => {
                          const globalIndex = (currentPage - 1) * itemsPerPage + index;
                          return (
                            <div key={student._id || index} className="trip-row">
                              <div
                                className="member-info student-hoverable"
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => {
                                  setHoveredStudent(student);
                                  setHoveredStudentPos({
                                    top: e.clientY + 8,
                                    left: e.clientX + 8
                                  });
                                }}
                                onMouseMove={e => {
                                  if (hoveredStudent && hoveredStudent._id === student._id) {
                                    setHoveredStudentPos({
                                      top: e.clientY + 8,
                                      left: e.clientX + 8
                                    });
                                  }
                                }}
                                onMouseLeave={() => setHoveredStudent(null)}
                                onClick={() => window.open(`/admin/student/${student._id}`, '_blank')}
                              >
                                <div className="member-avatar">
                                  <img src={student.profilePhoto || '/assets/shoora-logo.svg'} alt={student.fullName} />
                                </div>
                                <div className="member-details">
                                  <h4 style={{ color: '#9747ff', textDecoration: 'underline', cursor: 'pointer' }}>{student.fullName}</h4>
                                  <p>{student.email}</p>
                                  <small style={{ color: '#4ade80', fontSize: '0.7rem' }}>
                                    Student #{globalIndex + 1} of {students.length} • Click to view full profile
                                  </small>
                                </div>
                              </div>
                              <div className="flight-destination" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span>{student.phone || '--'}</span>
                                {student.phone && (
                                  <>
                                    <button
                                      title="Copy"
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4 }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(student.phone);
                                        toast.success('Phone Number is copied!👍');
                                      }}
                                    >
                                      <img src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Copy-icon.svg?updatedAt=1752788380752" alt="Copy" style={{ width: 25, height: 25 }} />
                                    </button>
                                    <button
                                      title="WhatsApp"
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 2 }}
                                      onClick={e => {
                                        e.stopPropagation();
                                        window.open(`https://wa.me/91${student.phone}`, '_blank');
                                      }}
                                    >
                                      <img src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Whatsapp-icon.svg?updatedAt=1752788380726" alt="WhatsApp" style={{ width: 25, height: 25 }} />
                                    </button>
                                  </>
                                )}
                              </div>
                              <div className="flight-destination">{student.idCardNumber || '--'}</div>
                              <div className="flight-destination">{student.class || student.course || '--'}</div>
                              <div className="price">{student.phone || '--'}</div>
                              <div className="flight-destination">{
                                student.customCollege || student.collegeName
                                  ? (student.customCollege || student.collegeName)
                                  : (student.customSchool || student.schoolName || '--')
                              }</div>
                            </div>
                          );
                        })}
                        {/* Pagination Controls for Students */}
                        {totalPages > 1 && (
                          <div className="pagination-container" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(151, 71, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(151, 71, 255, 0.2)' }}>
                            <div className="pagination-info" style={{ textAlign: 'center', color: '#fff', fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>
                              Page {currentPage} of {totalPages} | Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, students.length)} of {students.length} students
                            </div>
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="pagination-btn"
                                style={{
                                  background: 'linear-gradient(145deg, #9747ff, #7c3aed)',
                                  border: 'none',
                                  color: 'white',
                                  padding: '0.8rem 1.5rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 8px rgba(151, 71, 255, 0.2)'
                                }}
                                onClick={e => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                disabled={currentPage === 1}
                              >
                                ← Previous
                              </button>
                              <div className="page-numbers" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                  <button
                                    type="button"
                                    key={page}
                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                    style={{
                                      background: currentPage === page ? 'linear-gradient(145deg, #9747ff, #7c3aed)' : 'rgba(151, 71, 255, 0.15)',
                                      border: '1px solid rgba(151, 71, 255, 0.3)',
                                      color: '#fff',
                                      padding: '0.6rem 1rem',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '1rem',
                                      fontWeight: '500',
                                      transition: 'all 0.3s ease',
                                      minWidth: '2.5rem',
                                      textAlign: 'center'
                                    }}
                                    onClick={e => { e.preventDefault(); handlePageChange(page); }}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>
                              <button
                                type="button"
                                className="pagination-btn"
                                style={{
                                  background: 'linear-gradient(145deg, #9747ff, #7c3aed)',
                                  border: 'none',
                                  color: 'white',
                                  padding: '0.8rem 1.5rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 8px rgba(151, 71, 255, 0.2)'
                                }}
                                onClick={e => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                disabled={currentPage === totalPages}
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="trips-header">
                      <span>Teacher</span>
                      <span>ID Card No</span>
                      <span>Mobile</span>
                      <span>Subjects</span>
                      <span>Status</span>
                    </div>
                    {teachers.length === 0 ? (
                      <div style={{ color: '#fff', textAlign: 'center', margin: '2rem 0' }}>No teachers found.</div>
                    ) : (
                      <>
                        {getCurrentItems().map((teacher, index) => (
                          <div key={teacher._id || index} className="trip-row">
                            <div
                              className={`member-info teacher-hoverable${hoveredTeacher && hoveredTeacher._id === teacher._id ? ' hovered' : ''}`}
                              onMouseEnter={e => {
                                setHoveredTeacher(teacher);
                                setHoveredTeacherPos({
                                  top: e.clientY + 8, // 8px below mouse pointer
                                  left: e.clientX + 8 // 8px right of mouse pointer
                                });
                              }}
                              onMouseLeave={() => setHoveredTeacher(null)}
                              onClick={() => window.open(`/admin/teacher/${teacher._id}`, '_blank')}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="member-avatar">
                                <img src={teacher.profilePhoto || '/assets/shoora-logo.svg'} alt={teacher.fullName} />
                              </div>
                              <div className="member-details">
                                <h4 className="teacher-name-link" style={{ color: '#ff6a32', textDecoration: 'underline', position: 'relative', marginBottom: 2 }}>{teacher.fullName}</h4>
                                <p style={{ color: '#aaa', fontSize: '0.92em', margin: 0 }}>{teacher.email}</p>
                              </div>
                            </div>
                            <div className="flight-destination">{teacher.teacherCode || '--'}</div>
                            <div className="flight-destination" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span>{teacher.phone || '--'}</span>
                              {teacher.phone && (
                                <>
                                  <button
                                    title="Copy"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 4 }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(teacher.phone);
                                      toast.success('Phone Number is copied!👍');
                                    }}
                                  >
                                    <img src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Copy-icon.svg?updatedAt=1752788380752" alt="Copy" style={{ width: 25, height: 25 }} />
                                  </button>
                                  <button
                                    title="WhatsApp"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: 2 }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      window.open(`https://wa.me/91${teacher.phone}`, '_blank');
                                    }}
                                  >
                                    <img src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Whatsapp-icon.svg?updatedAt=1752788380726" alt="WhatsApp" style={{ width: 25, height: 25 }} />
                                  </button>
                                </>
                              )}
                            </div>
                            <div className="flight-destination">{teacher.subject ? (teacher.subject.length > 20 ? teacher.subject.slice(0, 20) + '...' : teacher.subject) : '--'}</div>
                            <div className="flight-destination">{teacher.status || '--'}</div>
                          </div>
                        ))}
                        {/* Pagination Controls for Teachers */}
                        {totalPages > 1 && (
                          <div className="pagination-container" style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(151, 71, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(151, 71, 255, 0.2)' }}>
                            <div className="pagination-info" style={{ textAlign: 'center', color: '#fff', fontSize: '0.9rem', marginBottom: '1rem', opacity: 0.8 }}>
                              Page {currentPage} of {totalPages} | Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, teachers.length)} of {teachers.length} teachers
                            </div>
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                className="pagination-btn"
                                style={{
                                  background: 'linear-gradient(145deg, #9747ff, #7c3aed)',
                                  border: 'none',
                                  color: 'white',
                                  padding: '0.8rem 1.5rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 8px rgba(151, 71, 255, 0.2)'
                                }}
                                onClick={e => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                disabled={currentPage === 1}
                              >
                                ← Previous
                              </button>
                              <div className="page-numbers" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                  <button
                                    type="button"
                                    key={page}
                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                    style={{
                                      background: currentPage === page ? 'linear-gradient(145deg, #9747ff, #7c3aed)' : 'rgba(151, 71, 255, 0.15)',
                                      border: '1px solid rgba(151, 71, 255, 0.3)',
                                      color: '#fff',
                                      padding: '0.6rem 1rem',
                                      borderRadius: '6px',
                                      cursor: 'pointer',
                                      fontSize: '1rem',
                                      fontWeight: '500',
                                      transition: 'all 0.3s ease',
                                      minWidth: '2.5rem',
                                      textAlign: 'center'
                                    }}
                                    onClick={e => { e.preventDefault(); handlePageChange(page); }}
                                  >
                                    {page}
                                  </button>
                                ))}
                              </div>
                              <button
                                type="button"
                                className="pagination-btn"
                                style={{
                                  background: 'linear-gradient(145deg, #9747ff, #7c3aed)',
                                  border: 'none',
                                  color: 'white',
                                  padding: '0.8rem 1.5rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  transition: 'all 0.3s ease',
                                  boxShadow: '0 2px 8px rgba(151, 71, 255, 0.2)'
                                }}
                                onClick={e => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                disabled={currentPage === totalPages}
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

            </div>

            {/* Student Admissions Chart (replaces Flights Schedule) */}
            <div className="content-card flight-schedule" style={{ width: '100%', maxWidth: '100%' }}>
              {/* Chart Member Toggle (centered, styled like members panel) - move to very top of card */}
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 18, marginTop: 8 }}>
                <div className="member-toggle">
                  <button
                    className={"toggle-btn" + (chartMemberType === 'student' ? ' active' : '')}
                    onClick={() => setChartMemberType('student')}
                  >Student</button>
                  <button
                    className={"toggle-btn" + (chartMemberType === 'teacher' ? ' active' : '')}
                    onClick={() => setChartMemberType('teacher')}
                  >Teacher</button>
                </div>
              </div>
              <h3 style={{ color: '#9747ff', fontWeight: 700, margin: 0, textAlign: 'center', marginBottom: 8 }}>
                {chartMemberType === 'student' ? 'Student Admissions' : 'Teacher Admissions'}
              </h3>
              {/* Filter Controls */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <label style={{ color: '#fff', fontWeight: 500 }}>From Date:
                  <select value={fromDay} onChange={e => setFromDay(e.target.value)} style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 8, border: '1px solid #9747ff', background: '#181828', color: '#fff', fontWeight: 600 }}>
                    <option value="">--</option>
                    {(() => {
                      let days = 31;
                      if (selectedMonth !== 'All' && selectedYear !== 'All') {
                        const monthIdx = new Date(Date.parse(selectedMonth + ' 1, 2000')).getMonth();
                        const year = Number(selectedYear);
                        days = new Date(year, monthIdx + 1, 0).getDate();
                      }
                      return Array.from({ length: days }, (_, i) => <option key={i+1} value={i+1}>{i+1}</option>);
                    })()}
                  </select>
                </label>
                <label style={{ color: '#fff', fontWeight: 500 }}>Month:
                  <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 8, border: '1px solid #9747ff', background: '#181828', color: '#fff', fontWeight: 600 }}>
                    <option value="All">All</option>
                    {(() => {
                      // Get unique months from students data, sorted in calendar order
                      const monthSet = new Set(students.map(s => new Date(s.createdAt).getMonth()));
                      const monthsArr = Array.from(monthSet).sort((a, b) => a - b);
                      return monthsArr.map(mIdx => {
                        const label = new Date(0, mIdx).toLocaleString('default', { month: 'short' });
                        return <option key={label} value={label}>{label}</option>;
                      });
                    })()}
                  </select>
                </label>
                <label style={{ color: '#fff', fontWeight: 500 }}>Year:
                  <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} style={{ marginLeft: 8, padding: '6px 12px', borderRadius: 8, border: '1px solid #9747ff', background: '#181828', color: '#fff', fontWeight: 600 }}>
                    <option value="All">All</option>
                    {/* Unique years from students data, descending */}
                    {Array.from(new Set(students.map(s => new Date(s.createdAt).getFullYear()))).sort((a, b) => b - a).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </label>
                <button onClick={() => { setSelectedMonth('All'); setSelectedYear('All'); setFromDay(''); }} style={{ marginLeft: 12, padding: '6px 16px', borderRadius: 8, border: 'none', background: '#9747ff', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Reset</button>
              </div>
              <div className="schedule-highlight">
                <div className="highlight-badge" style={{ background: 'transparent', border: '2px solid #9747ff', color: '#fff' }}>{
                  // Total admissions in filtered range (dynamic for student/teacher)
                  (() => {
                    const dataArr = chartMemberType === 'student' ? students : teachers;
                    let filtered = dataArr;
                    if (fromDay && selectedMonth !== 'All' && selectedYear !== 'All') {
                      const monthIdx = new Date(Date.parse(selectedMonth + ' 1, 2000')).getMonth();
                      const year = Number(selectedYear);
                      const startDay = Number(fromDay);
                      filtered = dataArr.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.getFullYear() === year && d.getMonth() === monthIdx && d.getDate() >= startDay;
                      });
                    } else if (selectedMonth !== 'All' && selectedYear !== 'All') {
                      filtered = dataArr.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.toLocaleString('default', { month: 'short' }) === selectedMonth && d.getFullYear().toString() === selectedYear.toString();
                      });
                    } else if (fromDay) {
                      const startDay = Number(fromDay);
                      filtered = dataArr.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.getDate() >= startDay;
                      });
                    } else if (selectedMonth !== 'All') {
                      filtered = dataArr.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.toLocaleString('default', { month: 'short' }) === selectedMonth;
                      });
                    } else if (selectedYear !== 'All') {
                      filtered = dataArr.filter(s => {
                        const d = new Date(s.createdAt);
                        return d.getFullYear().toString() === selectedYear.toString();
                      });
                    }
                    return filtered.length;
                  })()
                }</div>
                <div>Total Admissions</div>
              </div>
              <div className="schedule-chart" style={{ overflow: 'hidden', height: 'auto', padding: '0 1px 1px 0', background: ' rgba(255,255,255,0.1)', borderRadius: 16 }}>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={(() => {
                      const now = new Date();
                      const dataArr = chartMemberType === 'student' ? students : teachers;
                      // If fromDay, month, year are selected, show bars for each day from fromDay to end of month
                      if (fromDay && selectedMonth !== 'All' && selectedYear !== 'All') {
                        const monthIdx = new Date(Date.parse(selectedMonth + ' 1, 2000')).getMonth();
                        const year = Number(selectedYear);
                        const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
                        const startDay = Number(fromDay);
                        const days = Array.from({ length: daysInMonth - startDay + 1 }, (_, i) => ({ day: (startDay + i).toString(), count: 0 }));
                        dataArr.forEach(s => {
                          const d = new Date(s.createdAt);
                          if (
                            d.getFullYear() === year &&
                            d.getMonth() === monthIdx &&
                            d.getDate() >= startDay
                          ) {
                            const idx = d.getDate() - startDay;
                            if (days[idx]) days[idx].count++;
                          }
                        });
                        return days;
                      }
                      // If only month/year, show each day of the month (1-31) as x-axis
                      if (selectedMonth !== 'All' && selectedYear !== 'All' && !fromDay) {
                        const monthIdx = new Date(Date.parse(selectedMonth + ' 1, 2000')).getMonth();
                        const year = Number(selectedYear);
                        const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
                        const days = Array.from({ length: daysInMonth }, (_, i) => ({ day: (i + 1).toString(), count: 0 }));
                        dataArr.forEach(s => {
                          const d = new Date(s.createdAt);
                          if (d.getFullYear() === year && d.getMonth() === monthIdx) {
                            days[d.getDate() - 1].count++;
                          }
                        });
                        return days;
                      }
                      // If only fromDay, show from that day to 31
                      if (fromDay) {
                        const startDay = Number(fromDay);
                        const days = Array.from({ length: 31 - startDay + 1 }, (_, i) => ({ day: (startDay + i).toString(), count: 0 }));
                        dataArr.forEach(s => {
                          const d = new Date(s.createdAt);
                          if (d.getDate() >= startDay) {
                            const idx = d.getDate() - startDay;
                            if (days[idx]) days[idx].count++;
                          }
                        });
                        return days;
                      }
                      // If only month, show that month for all years
                      if (selectedMonth !== 'All' && selectedYear === 'All') {
                        const yearMap = {};
                        dataArr.forEach(s => {
                          const d = new Date(s.createdAt);
                          if (d.toLocaleString('default', { month: 'short' }) === selectedMonth) {
                            const y = d.getFullYear();
                            if (!yearMap[y]) yearMap[y] = 0;
                            yearMap[y]++;
                          }
                        });
                        return Object.entries(yearMap).sort((a, b) => b[0] - a[0]).map(([year, count]) => ({ month: `${selectedMonth} '${year.toString().slice(-2)}`, count }));
                      }
                      // If only year, show all months for that year
                      if (selectedMonth === 'All' && selectedYear !== 'All') {
                        const months = Array.from({ length: 12 }, (_, i) => {
                          const label = new Date(0, i).toLocaleString('default', { month: 'short' });
                          return { month: `${label} '${selectedYear.toString().slice(-2)}`, count: 0 };
                        });
                        dataArr.forEach(s => {
                          const d = new Date(s.createdAt);
                          if (d.getFullYear().toString() === selectedYear.toString()) {
                            const idx = d.getMonth();
                            months[idx].count++;
                          }
                        });
                        return months;
                      }
                      // Default: last 12 months
                      let months = [];
                      for (let i = 11; i >= 0; i--) {
                        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                        months.push({
                          month: d.toLocaleString('default', { month: 'short', year: '2-digit' }),
                          count: 0
                        });
                      }
                      dataArr.forEach(s => {
                        const d = new Date(s.createdAt);
                        for (let i = 0; i < months.length; i++) {
                          const m = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
                          if (d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth()) {
                            months[i].count++;
                          }
                        }
                      });
                      return months;
                    })()}
                    margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                    barCategoryGap={"30%"}
                  >
                    <defs>
                      <linearGradient id="admissionsBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9747ff" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9747ff" />
                    <XAxis dataKey={fromDay && selectedMonth !== 'All' && selectedYear !== 'All' ? 'day' : (selectedMonth !== 'All' && selectedYear !== 'All' && !fromDay ? 'day' : 'month')} axisLine={false} tickLine={false} tick={{ fill: '#bdbdbd', fontWeight: 600, fontSize: 13 }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#bdbdbd', fontWeight: 600, fontSize: 13 }} />
                    <Tooltip cursor={{ fill: 'rgba(151,71,255,0.08)' }} contentStyle={{ background: '#181828', border: '1px solid #9747ff', borderRadius: 10, color: '#fff', fontWeight: 600 }} labelStyle={{ color: '#9747ff', fontWeight: 700 }} />
                    <Bar dataKey="count" fill="url(#admissionsBar)" radius={[8, 8, 0, 0]} maxBarSize={32} >
                      {/* Show value dots on top of each bar */}
                      {
                        ((barProps) => barProps.payload && barProps.payload.count > 0 ? (
                          <circle cx={barProps.x + barProps.width / 2} cy={barProps.y} r={6} fill="#fff" stroke="#9747ff" strokeWidth={3} />
                        ) : null)
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
        {/* Add Courses Section */}
        {activeSection === 'add-courses' && (
          <div className="content-card add-courses-card">
            <h3>Add New Course</h3>
            <form className="add-course-form" onSubmit={handleAddCourse}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Course Title:</label>
                <input type="text" name="title" className="input-field" placeholder="Enter course title" required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Duration:</label>
                <input type="text" name="duration" className="input-field" placeholder="e.g. 6 MONTHS" required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Languages:</label>
                <input type="text" name="languages" className="input-field" placeholder="e.g. Hindi, English" required />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Original Price:</label>
                <input type="text" name="originalPrice" className="input-field" placeholder="e.g. ₹12000" required value={courseForm.originalPrice} onChange={e => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  setCourseForm(prev => {
                    const newState = { ...prev, originalPrice: value };
                    // If discount is set, recalc currentPrice
                    if (newState.discount) {
                      const op = parseFloat(value);
                      const disc = parseFloat(newState.discount);
                      if (!isNaN(op) && !isNaN(disc)) {
                        newState.currentPrice = (op - (op * disc / 100)).toFixed(2);
                      }
                    } else if (newState.currentPrice) {
                      // If currentPrice is set, recalc discount
                      const op = parseFloat(value);
                      const cp = parseFloat(newState.currentPrice);
                      if (!isNaN(op) && !isNaN(cp) && op > 0) {
                        newState.discount = (((op - cp) / op) * 100).toFixed(2);
                      }
                    }
                    return newState;
                  });
                }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Current Price:</label>
                <input type="text" name="currentPrice" className="input-field" placeholder="e.g. ₹9000" required value={courseForm.currentPrice} onChange={e => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  setCourseForm(prev => {
                    const newState = { ...prev, currentPrice: value };
                    // If originalPrice is set, recalc discount
                    const op = parseFloat(newState.originalPrice);
                    const cp = parseFloat(value);
                    if (!isNaN(op) && !isNaN(cp) && op > 0) {
                      newState.discount = (((op - cp) / op) * 100).toFixed(2);
                    }
                    return newState;
                  });
                }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Discount:</label>
                <input type="text" name="discount" className="input-field" placeholder="e.g. 25% OFF" value={courseForm.discount} onChange={e => {
                  const value = e.target.value.replace(/[^\d.]/g, '');
                  setCourseForm(prev => {
                    const newState = { ...prev, discount: value };
                    // If originalPrice is set, recalc currentPrice
                    const op = parseFloat(newState.originalPrice);
                    const disc = parseFloat(value);
                    if (!isNaN(op) && !isNaN(disc)) {
                      newState.currentPrice = (op - (op * disc / 100)).toFixed(2);
                    }
                    return newState;
                  });
                }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Details:</label>
                <textarea name="details" className="input-field" placeholder="Course details, comma separated" required></textarea>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Course Image (Upload):</label>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: '2rem' }}>
                  <label htmlFor="courseImageInput" style={{
                    width: 320,
                    height: 180,
                    borderRadius: 8,
                    background: '#222',
                    border: '2px dashed #9747ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    marginBottom: 8
                  }}>
                    {courseImagePreview ? (
                      <img
                        src={courseImagePreview}
                        alt="Course Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                        onError={(e) => {
                          console.error('Image failed to load:', courseImagePreview);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span style={{
                      color: '#aaa',
                      fontSize: 18,
                      display: courseImagePreview ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%'
                    }}>
                      {courseImagePreview ? 'Image failed to load' : 'Upload Image'}
                    </span>
                    <input
                      id="courseImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleCourseImageFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Or Image URL:</label>
                <input type="text" className="input-field" placeholder="Paste image link here" value={courseImageUrl} onChange={handleCourseImageUrlChange} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Teacher Name (Optional):</label>
                <input type="text" name="teacherName" className="input-field" placeholder="Enter teacher name (optional)" value={courseForm.teacherName} onChange={e => setCourseForm(prev => ({ ...prev, teacherName: e.target.value }))} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Technologies:</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Type a technology and press Enter or comma (e.g. Python)"
                  value={courseForm.technologiesInput || ''}
                  onChange={e => setCourseForm(prev => ({ ...prev, technologiesInput: e.target.value }))}
                  onKeyDown={e => {
                    if ((e.key === 'Enter' || e.key === ',') && courseForm.technologiesInput && courseForm.technologiesInput.trim()) {
                      e.preventDefault();
                      // Split by comma and filter out empty/duplicate
                      const newTechs = courseForm.technologiesInput.split(',').map(t => t.trim()).filter(Boolean);
                      setCourseForm(prev => ({
                        ...prev,
                        technologies: [
                          ...prev.technologies,
                          ...newTechs.filter(t => t && !prev.technologies.includes(t))
                        ],
                        technologiesInput: ''
                      }));
                    }
                  }}
                  onPaste={e => {
                    const paste = e.clipboardData.getData('text');
                    if (paste.includes(',')) {
                      e.preventDefault();
                      const newTechs = paste.split(',').map(t => t.trim()).filter(Boolean);
                      setCourseForm(prev => ({
                        ...prev,
                        technologies: [
                          ...prev.technologies,
                          ...newTechs.filter(t => t && !prev.technologies.includes(t))
                        ],
                        technologiesInput: ''
                      }));
                    }
                  }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                  {courseForm.technologies.map((tech, idx) => (
                    <span key={tech} style={{
                      background: '#9747ff',
                      color: '#fff',
                      borderRadius: 16,
                      padding: '4px 14px 4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 14,
                      fontFamily: 'NeueMachina',
                      marginRight: 6,
                      marginBottom: 4
                    }}>
                      {tech}
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#fff',
                          marginLeft: 6,
                          fontSize: 16,
                          cursor: 'pointer',
                          lineHeight: 1
                        }}
                        onClick={() => setCourseForm(prev => ({
                          ...prev,
                          technologies: prev.technologies.filter((t, i) => i !== idx)
                        }))}
                      >×</button>
                    </span>
                  ))}
                </div>
              </div>
              <button type="submit" className="submit-btn">Add Course</button>
            </form>
          </div>
        )}
        {/* Edit Courses Section */}
        {activeSection === 'edit-courses' && (
          <section id="view3">
            <div className="bottom">
              <div className="courses" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', rowGap: '2rem' }}>
                {courses.length === 0 ? (
                  <div style={{ color: '#fff', textAlign: 'center', gridColumn: '1/-1' }}>No courses found.</div>
                ) : (
                  courses.map((course, idx) => {
                    console.log('course:', course);
                    return (
                      <div className="course-card" key={course._id || idx} style={{ background: '#101114', borderRadius: 18, boxShadow: '0 8px 32px 0 rgba(10,12,20,0.22)', border: '1.5px solid #232428', color: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', minWidth: 360, maxWidth: 480, margin: '0 1rem 2rem 1rem', position: 'relative' }}>
                        {/* Background overlays absolutely positioned at the back */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 18,
                          pointerEvents: 'none',
                          zIndex: 1,
                          background: "url('/assets/metal.png')",
                          opacity: 0.32,
                          mixBlendMode: 'lighten',
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: '8%',
                          left: '-20%',
                          width: '140%',
                          height: '32%',
                          borderRadius: '40% 60% 60% 40%/60% 40% 60% 40%',
                          background: 'linear-gradient(110deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0) 100%)',
                          filter: 'blur(8px)',
                          opacity: 0.38,
                          zIndex: 2,
                          pointerEvents: 'none',
                        }} />
                        {/* Card content always above overlays */}
                        <div style={{ position: 'relative', zIndex: 3 }}>
                          <div className="course-image" style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                            <img src={course.image} alt={course.title} className="course-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {course.badge && <div className="category-badge" style={{ position: 'absolute', top: 15, left: 15, background: 'rgba(255,255,255,0.7)', color: '#000', padding: '5px 12px', borderRadius: 15, fontWeight: 500, fontSize: 12 }}>{course.badge}</div>}
                          </div>
                          <div className="card-bg" style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 24 }}>
                            <div className="course-content">
                              <h3 className="course-title" style={{ fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                                onClick={() => {
                                  setOpenDropdowns((prev) => {
                                    const copy = [...prev];
                                    copy[idx] = !copy[idx];
                                    return copy;
                                  });
                                }}
                              >
                                {course.title}
                                {Array.isArray(course.technologies) && course.technologies.length > 0 && (
                                  <span style={{ display: 'inline-block', transition: 'transform 0.3s', transform: openDropdowns[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6 9L11 14L16 9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </span>
                                )}
                              </h3>
                              {/* Technologies dropdown: only show if open */}
                              {Array.isArray(course.technologies) && course.technologies.length > 0 && openDropdowns[idx] && (
                                <div style={{ margin: '4px 0 8px 0' }}>
                                  <strong style={{ color: '#8b5cf6', fontSize: 14 }}>Technologies:</strong>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: 6 }}>
                                    {course.technologies.map((tech, i) => (
                                      <span key={i} style={{ background: '#8b5cf6', color: '#fff', borderRadius: '16px', padding: '4px 14px', fontSize: 14, fontWeight: 500, display: 'inline-block' }}>{tech}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Always show details as plain text below title, above duration */}
                              {course.details && (
                                <div style={{ color: '#ccc', fontSize: 14, margin: '4px 0 8px 0' }}>
                                  {Array.isArray(course.details) ? course.details.join(', ') : course.details}
                                </div>
                              )}
                              {course.duration && <p className="course-duration" style={{ color: '#8b5cf6', fontWeight: 600, margin: 0, marginBottom: 10 }}>{course.duration}</p>}
                              {course.languages && (
                                <div className="Course-language" style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                  {(Array.isArray(course.languages) ? course.languages : course.languages.split(',')).map((lang, i) => (
                                    <p key={i} style={{ background: '#333', color: '#fff', borderRadius: 8, padding: '4px 10px', fontSize: 13, margin: 0 }}>{lang.trim()}</p>
                                  ))}
                                </div>
                              )}
                              <div className="pricing" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                {course.originalPrice && <span className="original-price" style={{ color: '#666', textDecoration: 'line-through', fontSize: 14 }}>&#8377; {course.originalPrice}</span>}
                                {course.currentPrice && <span className="current-price" style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>&#8377; {course.currentPrice}</span>}
                                {course.discount && <span className="discount" style={{ background: '#22c55e', color: '#fff', borderRadius: 12, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{course.discount}</span>}
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                              <button className="view-details-btn" style={{ flex: 1, background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: '#fff', border: 'none', padding: 12, borderRadius: 8, fontWeight: 600, cursor: 'pointer' }} onClick={() => handleViewDetails(course)}>
                                View Details
                              </button>
                              <button className="edit-btn" style={{ flex: 1, background: '#fff', color: '#7c3aed', border: 'none', padding: 12, borderRadius: 8, fontWeight: 600, cursor: 'pointer' }} onClick={() => handleEditCourse(course)}>
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Delete button at top-right */}
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          style={{
                            position: 'absolute',
                            top: 14,
                            right: 14,
                            zIndex: 10,
                            background: '#ffffff',
                            border: 'none',
                            borderRadius: '50%',
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            backdropFilter: 'blur(3px)',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                            padding: 0,
                          }}
                          title="Delete Course"
                        >
                          <img
                            src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/dlt-btn.svg?updatedAt=17528757107599"
                            alt="Delete"
                            style={{ width: 18, height: 18, objectFit: 'contain', display: 'block' }}
                          />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        )}
        {activeSection === 'edit-homepage' && (
          <div className="content-card" style={{ maxWidth: 700, margin: '2rem auto', background: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <EditHomepage />
          </div>
        )}
      </div>

      {/* Teacher Hover Card */}
      {hoveredTeacher && (
        <div
          className="teacher-float-card"
          style={{
            position: 'fixed',
            top: hoveredTeacherPos.top,
            left: hoveredTeacherPos.left,
            zIndex: 1000,
            background: 'linear-gradient(145deg, rgba(151, 71, 255, 0.95), rgba(124, 58, 237, 0.95))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(151, 71, 255, 0.3)',
            borderRadius: '16px',
            padding: '1.5rem',
            minWidth: '260px',
            boxShadow: '0 8px 32px rgba(151, 71, 255, 0.3)',
            color: 'white',
            fontFamily: 'NeueMachina, sans-serif',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => window.open(`/admin/teacher/${hoveredTeacher._id}`, '_blank')}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(151, 71, 255, 0.4)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(151, 71, 255, 0.3)';
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {/* Profile Photo */}
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid #9747ff',
              background: '#fff',
              marginBottom: '0.5rem'
            }}>
              <img
                src={hoveredTeacher.profilePhoto || '/assets/shoora-logo.svg'}
                alt={hoveredTeacher.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {/* Teacher Name */}
            <h3 style={{
              margin: 0,
              fontSize: '1.15rem',
              fontWeight: '700',
              textAlign: 'center',
              color: '#ff6a32'
            }}>
              {hoveredTeacher.fullName}
            </h3>
            {/* ID Card Number */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '500',
              color: '#fff'
            }}>
              ID: {hoveredTeacher.teacherCode || '--'}
            </div>
            {/* Details */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Email:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredTeacher.email || '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Mobile:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredTeacher.phone || '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Qualification:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredTeacher.qualification || '--'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Subject:</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{hoveredTeacher.subject || '--'}</span>
              </div>
              {/* Click indicator */}
              <div style={{
                marginTop: '1rem',
                padding: '0.8rem',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                👆 Click to view full profile
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div>
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              backgroundImage: 'url("/assets/bg2.svg")',
              color: '#fff',
              borderRadius: 16,
              padding: '2.5rem 2rem 2rem 2rem',
              minWidth: 320,
              maxWidth: '90vw',
              boxShadow: '0 8px 32px 0 rgba(10,12,20,0.22)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <button onClick={() => setDeleteModal({ open: false, course: null })} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#fff', fontSize: 28, cursor: 'pointer' }}>&times;</button>
              <h2 style={{ fontFamily: 'NeueMachina', marginBottom: 24 }}>Are you sure you want to delete <span style={{ color: '#ff6a6a' }}>{deleteModal.course?.title}</span>?</h2>
              <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
                <button className="modal-btn-popup" onClick={confirmDeleteCourse}>
                  Yes
                </button>
                <button className="modal-btn-popup" onClick={() => setDeleteModal({ open: false, course: null })}>
                  No
                </button>
              </div>
            </div>
          </div>
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw', height: '100vh',
            zIndex: 9998,
            backdropFilter: 'blur(6px)',
            background: 'rgba(0,0,0,0.2)',
            pointerEvents: 'none',
          }} />
        </div>
      )}


      {editModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          minHeight: '100vh',
          width: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setEditModal({ open: false, course: null, form: null });
          }
        }}
        >
          <div style={{
            backgroundImage: 'url("/assets/bg2.svg")',
            color: '#fff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 480,
            maxHeight: '90vh', // Maximum 90% of viewport height
            minHeight: '60vh', // Minimum height for better UX
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px 0 rgba(10,12,20,0.22)',
            position: 'relative',
            overflow: 'hidden', // Prevent overflow on container
          }}>
            <style>{`
        .custom-modal-scroll::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb {
          background: #9747ff;
          border-radius: 8px;
        }
        .custom-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: #9747ff transparent;
          scroll-behavior: smooth;
        }
        
        /* Fix for mouse wheel and touchpad scrolling */
        .custom-modal-scroll {
          -webkit-overflow-scrolling: touch;
          overflow-scrolling: touch;
        }
        
        /* Ensure pointer events are enabled */
        .custom-modal-scroll * {
          pointer-events: auto;
        }
      `}</style>

            {/* Fixed Header */}
            <div style={{
              padding: '2rem 2.5rem 1rem 2.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0, // Prevent shrinking
              position: 'relative'
            }}>
              <button
                onClick={() => setEditModal({ open: false, course: null, form: null })}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 32,
                  cursor: 'pointer',
                  fontWeight: 400,
                  lineHeight: 1,
                  zIndex: 1
                }}
              >×</button>
              <h2 style={{
                fontFamily: 'NeueMachina',
                margin: 0,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 0.5,
                textAlign: 'center'
              }}>Edit Course</h2>
            </div>

            {/* Scrollable Content */}
            <div className="custom-modal-scroll" style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1.5rem 2.5rem',
              position: 'relative',
              height: '100%',
              minHeight: 0,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: '#9747ff transparent'
            }}>
              <form onSubmit={e => { e.preventDefault(); handleEditModalSave(); }} style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 18
              }} onWheel={(e) => {
                // Force scroll behavior for mouse wheel
                e.currentTarget.closest('.custom-modal-scroll').scrollTop += e.deltaY;
              }}>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Course Title</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={editModal.form.title || ''}
                    onChange={e => handleEditModalChange('title', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Duration</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={editModal.form.duration || ''}
                    onChange={e => handleEditModalChange('duration', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Languages</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={Array.isArray(editModal.form.languages) ? editModal.form.languages.join(', ') : (editModal.form.languages || '')}
                    onChange={e => handleEditModalChange('languages', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Original Price</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={editModal.form.originalPrice || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      setEditModal(prev => {
                        const newForm = { ...prev.form, originalPrice: value };
                        // If discount is set, recalc currentPrice
                        if (newForm.discount) {
                          const op = parseFloat(value);
                          const disc = parseFloat(newForm.discount);
                          if (!isNaN(op) && !isNaN(disc)) {
                            newForm.currentPrice = (op - (op * disc / 100)).toFixed(2);
                          }
                        } else if (newForm.currentPrice) {
                          // If currentPrice is set, recalc discount
                          const op = parseFloat(value);
                          const cp = parseFloat(newForm.currentPrice);
                          if (!isNaN(op) && !isNaN(cp) && op > 0) {
                            newForm.discount = (((op - cp) / op) * 100).toFixed(2);
                          }
                        }
                        return { ...prev, form: newForm };
                      });
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Current Price</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={editModal.form.currentPrice || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      setEditModal(prev => {
                        const newForm = { ...prev.form, currentPrice: value };
                        // If originalPrice is set, recalc discount
                        const op = parseFloat(newForm.originalPrice);
                        const cp = parseFloat(value);
                        if (!isNaN(op) && !isNaN(cp) && op > 0) {
                          newForm.discount = (((op - cp) / op) * 100).toFixed(2);
                        }
                        return { ...prev, form: newForm };
                      });
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Discount</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={editModal.form.discount || ''}
                    onChange={e => {
                      const value = e.target.value.replace(/[^\d.]/g, '');
                      setEditModal(prev => {
                        const newForm = { ...prev.form, discount: value };
                        // If originalPrice is set, recalc currentPrice
                        const op = parseFloat(newForm.originalPrice);
                        const disc = parseFloat(value);
                        if (!isNaN(op) && !isNaN(disc)) {
                          newForm.currentPrice = (op - (op * disc / 100)).toFixed(2);
                        }
                        return { ...prev, form: newForm };
                      });
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Details</label>
                  <textarea
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff',
                      minHeight: 80,
                      resize: 'vertical'
                    }}
                    value={editModal.form.details || ''}
                    onChange={e => handleEditModalChange('details', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Course Image (Upload)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <label htmlFor="editCourseImageInput" style={{
                      width: '100%',
                      maxWidth: 320,
                      height: 160,
                      borderRadius: 10,
                      background: '#222',
                      border: '2px dashed #9747ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}>
                      {editModal.form.imagePreview ? (
                        <img
                          src={editModal.form.imagePreview}
                          alt="Course Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                        />
                      ) : (
                        <span style={{
                          color: '#aaa',
                          fontSize: 16,
                          textAlign: 'center'
                        }}>
                          Upload Image
                        </span>
                      )}
                      <input
                        id="editCourseImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleEditModalImageFile}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Or Image URL</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    placeholder="Paste image link here"
                    value={editModal.form.image || ''}
                    onChange={handleEditModalImageUrl}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Teacher Name (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    value={editModal.form.teacherName || ''}
                    onChange={e => handleEditModalChange('teacherName', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ color: '#bdbdbd', fontWeight: 500, marginBottom: 2, fontSize: 15 }}>Technologies</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1.5px solid #9747ff',
                      fontSize: 16,
                      background: '#181828',
                      color: '#fff'
                    }}
                    placeholder="Type a technology and press Enter or comma (e.g. Python)"
                    value={editModal.form.technologiesInput || ''}
                    onChange={e => handleEditModalChange('technologiesInput', e.target.value)}
                    onKeyDown={handleEditModalTechKeyDown}
                    onPaste={handleEditModalTechPaste}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {(Array.isArray(editModal.form.technologies) ? editModal.form.technologies : []).map((tech, idx) => (
                      <span key={tech} style={{
                        background: '#9747ff',
                        color: '#fff',
                        borderRadius: 16,
                        padding: '4px 14px 4px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14,
                        fontFamily: 'NeueMachina',
                        marginRight: 6,
                        marginBottom: 4
                      }}>
                        {tech}
                        <button
                          type="button"
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            marginLeft: 6,
                            fontSize: 16,
                            cursor: 'pointer',
                            lineHeight: 1
                          }}
                          onClick={() => handleEditModalRemoveTech(idx)}
                        >×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fixed Footer Buttons */}
                <div style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 24,
                  marginBottom: 8,
                  justifyContent: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <button
                    type="button"
                    style={{
                      background: '#fff',
                      color: '#9747ff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '0.9rem 2.2rem',
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'NeueMachina',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                    onClick={() => setEditModal({ open: false, course: null, form: null })}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      background: '#9747ff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '0.9rem 2.2rem',
                      fontSize: 18,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'NeueMachina',
                      transition: 'all 0.2s',
                      outline: 'none'
                    }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {viewDetailsModal.open && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          minHeight: '100vh',
          width: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setViewDetailsModal({ open: false, course: null });
          }
        }}
        >
          <div style={{
            backgroundImage: 'url("/assets/bg2.svg")',
            color: '#fff',
            borderRadius: 20,
            width: '100%',
            maxWidth: 600,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 32px 0 rgba(10,12,20,0.22)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '2rem 2.5rem 1rem 2.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              flexShrink: 0,
              position: 'relative'
            }}>
              <button
                onClick={() => setViewDetailsModal({ open: false, course: null })}
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 32,
                  cursor: 'pointer',
                  fontWeight: 400,
                  lineHeight: 1,
                  zIndex: 1
                }}
              >×</button>
              <h2 style={{
                fontFamily: 'NeueMachina',
                margin: 0,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 0.5,
                textAlign: 'center'
              }}>Course Details</h2>
            </div>

            {/* Content */}
            <div className="custom-modal-scroll" style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '1.5rem 2.5rem',
              position: 'relative',
              height: '100%',
              minHeight: 0,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'thin',
              scrollbarColor: '#9747ff transparent'
            }}
            onWheel={(e) => {
              // Force scroll behavior for mouse wheel
              e.currentTarget.scrollTop += e.deltaY;
            }}
            >
              <style>{`
                .custom-modal-scroll::-webkit-scrollbar {
                  width: 8px;
                  background: transparent;
                }
                .custom-modal-scroll::-webkit-scrollbar-thumb {
                  background: #9747ff;
                  border-radius: 8px;
                }
                .custom-modal-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-modal-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #9747ff transparent;
                  scroll-behavior: smooth;
                }
                
                /* Fix for mouse wheel and touchpad scrolling */
                .custom-modal-scroll {
                  -webkit-overflow-scrolling: touch;
                  overflow-scrolling: touch;
                }
                
                /* Ensure pointer events are enabled */
                .custom-modal-scroll * {
                  pointer-events: auto;
                }
                
                /* Additional mouse wheel fixes */
                .custom-modal-scroll {
                  overscroll-behavior: contain;
                  scroll-snap-type: y proximity;
                }
                
                /* Force scroll on mouse wheel */
                .custom-modal-scroll:hover {
                  overflow-y: auto;
                }
              `}</style>
              {viewDetailsModal.course && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Course Image */}
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={viewDetailsModal.course.image} 
                      alt={viewDetailsModal.course.title}
                      style={{
                        width: '100%',
                        maxWidth: 400,
                        height: 250,
                        objectFit: 'cover',
                        borderRadius: 15,
                        border: '2px solid rgba(151, 71, 255, 0.3)'
                      }}
                    />
                  </div>

                  {/* Course Title */}
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                      fontSize: 24,
                      fontWeight: 700,
                      margin: 0,
                      color: '#fff',
                      fontFamily: 'NeueMachina'
                    }}>
                      {viewDetailsModal.course.title}
                    </h3>
                    {viewDetailsModal.course.badge && (
                      <span style={{
                        display: 'inline-block',
                        background: 'rgba(151, 71, 255, 0.2)',
                        color: '#9747ff',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 14,
                        fontWeight: 600,
                        marginTop: 10,
                        border: '1px solid rgba(151, 71, 255, 0.3)'
                      }}>
                        {viewDetailsModal.course.badge}
                      </span>
                    )}
                  </div>

                  {/* Course Details Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 20,
                    marginTop: 20
                  }}>
                    {/* Basic Info */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: 20,
                      borderRadius: 15,
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h4 style={{
                        color: '#9747ff',
                        fontSize: 18,
                        fontWeight: 600,
                        margin: '0 0 15px 0',
                        fontFamily: 'NeueMachina'
                      }}>
                        Basic Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <span style={{ color: '#ccc', fontSize: 14 }}>Duration:</span>
                          <div style={{ color: '#fff', fontWeight: 500, marginTop: 4 }}>
                            {viewDetailsModal.course.duration || 'Not specified'}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#ccc', fontSize: 14 }}>Languages:</span>
                          <div style={{ color: '#fff', fontWeight: 500, marginTop: 4 }}>
                            {Array.isArray(viewDetailsModal.course.languages) 
                              ? viewDetailsModal.course.languages.join(', ') 
                              : viewDetailsModal.course.languages || 'Not specified'}
                          </div>
                        </div>
                        {viewDetailsModal.course.teacherName && (
                          <div>
                            <span style={{ color: '#ccc', fontSize: 14 }}>Teacher:</span>
                            <div style={{ color: '#fff', fontWeight: 500, marginTop: 4 }}>
                              {viewDetailsModal.course.teacherName}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: 20,
                      borderRadius: 15,
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h4 style={{
                        color: '#9747ff',
                        fontSize: 18,
                        fontWeight: 600,
                        margin: '0 0 15px 0',
                        fontFamily: 'NeueMachina'
                      }}>
                        Pricing
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {viewDetailsModal.course.originalPrice && (
                          <div>
                            <span style={{ color: '#ccc', fontSize: 14 }}>Original Price:</span>
                            <div style={{ color: '#666', textDecoration: 'line-through', marginTop: 4 }}>
                              ₹{viewDetailsModal.course.originalPrice}
                            </div>
                          </div>
                        )}
                        {viewDetailsModal.course.currentPrice && (
                          <div>
                            <span style={{ color: '#ccc', fontSize: 14 }}>Current Price:</span>
                            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginTop: 4 }}>
                              ₹{viewDetailsModal.course.currentPrice}
                            </div>
                          </div>
                        )}
                        {viewDetailsModal.course.discount && (
                          <div>
                            <span style={{ color: '#ccc', fontSize: 14 }}>Discount:</span>
                            <div style={{ 
                              background: '#22c55e', 
                              color: '#fff', 
                              borderRadius: 12, 
                              padding: '4px 12px', 
                              fontSize: 14, 
                              fontWeight: 600,
                              display: 'inline-block',
                              marginTop: 4
                            }}>
                              {viewDetailsModal.course.discount}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    {Array.isArray(viewDetailsModal.course.technologies) && viewDetailsModal.course.technologies.length > 0 && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: 20,
                        borderRadius: 15,
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <h4 style={{
                          color: '#9747ff',
                          fontSize: 18,
                          fontWeight: 600,
                          margin: '0 0 15px 0',
                          fontFamily: 'NeueMachina'
                        }}>
                          Technologies
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {viewDetailsModal.course.technologies.map((tech, i) => (
                            <span key={i} style={{
                              background: '#9747ff',
                              color: '#fff',
                              borderRadius: 16,
                              padding: '6px 14px',
                              fontSize: 14,
                              fontWeight: 500,
                              display: 'inline-block'
                            }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Course Details */}
                    {viewDetailsModal.course.details && (
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: 20,
                        borderRadius: 15,
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        gridColumn: '1 / -1'
                      }}>
                        <h4 style={{
                          color: '#9747ff',
                          fontSize: 18,
                          fontWeight: 600,
                          margin: '0 0 15px 0',
                          fontFamily: 'NeueMachina'
                        }}>
                          Course Description
                        </h4>
                        <div style={{ 
                          color: '#fff', 
                          lineHeight: 1.6,
                          fontSize: 15
                        }}>
                          {viewDetailsModal.course.details}
                        </div>
                      </div>
                    )}

                    {/* Creation Info */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: 20,
                      borderRadius: 15,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      gridColumn: '1 / -1'
                    }}>
                      <h4 style={{
                        color: '#9747ff',
                        fontSize: 18,
                        fontWeight: 600,
                        margin: '0 0 15px 0',
                        fontFamily: 'NeueMachina'
                      }}>
                        Course Information
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div>
                          <span style={{ color: '#ccc', fontSize: 14 }}>Course ID:</span>
                          <div style={{ color: '#fff', fontWeight: 500, marginTop: 4, fontFamily: 'monospace' }}>
                            {viewDetailsModal.course._id}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#ccc', fontSize: 14 }}>Created:</span>
                          <div style={{ color: '#fff', fontWeight: 500, marginTop: 4 }}>
                            {viewDetailsModal.course.createdAt 
                              ? new Date(viewDetailsModal.course.createdAt).toLocaleString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Date not available'
                            }
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#ccc', fontSize: 14 }}>Last Updated:</span>
                          <div style={{ color: '#fff', fontWeight: 500, marginTop: 4 }}>
                            {viewDetailsModal.course.updatedAt 
                              ? new Date(viewDetailsModal.course.updatedAt).toLocaleString('en-IN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : 'Date not available'
                            }
                          </div>
                        </div>
                        <div>
                          <span style={{ color: '#ccc', fontSize: 14 }}>Status:</span>
                          <div style={{ 
                            color: '#fff', 
                            fontWeight: 500, 
                            marginTop: 4,
                            background: viewDetailsModal.course.status === 'active' ? '#22c55e' : '#ef4444',
                            padding: '4px 12px',
                            borderRadius: 12,
                            display: 'inline-block',
                            fontSize: 14
                          }}>
                            {viewDetailsModal.course.status || 'active'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
              )}

        

        {/* Simple Banner Edit Section */}
        {activeSection === 'simple-banner-edit' && (
          <div style={{
            padding: '2rem',
            color: '#fff',
            
            fontFamily: 'NeueMachina'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '2rem'
            }}>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 1rem 0',
                background: 'linear-gradient(135deg, #9747ff, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Advertisement Banner Editor
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: '#ccc',
                margin: 0
              }}>
                Edit your advertisement banner text and settings
              </p>
            </div>

            {/* Toggle Button */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{
                color: '#9747ff',
                fontSize: '1.3rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                Banner Status
              </h3>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ccc',
                fontWeight: '500',
                fontSize: '1.1rem',
                cursor: 'pointer',
                gap: '1rem'
              }}>
                <input
                  type="checkbox"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  style={{
                    transform: 'scale(1.5)',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ color: bannerActive ? '#22c55e' : '#ef4444' }}>
                  {bannerActive ? '🟢 Banner Active' : '🔴 Banner Inactive'}
                </span>
              </label>
            </div>

            {/* Active Banner Preview */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              marginBottom: '2rem'
            }}>
              <h3 style={{
                color: '#9747ff',
                fontSize: '1.3rem',
                fontWeight: '600',
                margin: '0 0 1rem 0'
              }}>
                Active Banner Preview
              </h3>
              <div style={{
                background: 'linear-gradient(90deg, rgb(234, 92, 3), rgb(255, 225, 0))',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                color: '#000',
                fontWeight: '600',
                fontSize: '16px',
                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}>
                <div style={{
                  animation: 'scrollText 15s linear infinite',
                  display: 'inline-block',
                  whiteSpace: 'nowrap'
                }}>
                  <span style={{ paddingRight: '50px' }}>{bannerText}</span>
                  <span style={{ paddingRight: '50px' }}>{bannerText}</span>
                  <span style={{ paddingRight: '50px' }}>{bannerText}</span>
                  <span style={{ paddingRight: '50px' }}>{bannerText}</span>
                </div>
              </div>
            </div>

            {/* Editor Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 style={{
                color: '#9747ff',
                fontSize: '1.5rem',
                fontWeight: '600',
                margin: '0 0 1.5rem 0'
              }}>
                Banner Text Editor
              </h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#ccc',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  fontSize: '1rem'
                }}>
                  Advertisement Text
                </label>
                <textarea
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1.5px solid #9747ff',
                    fontSize: '16px',
                    background: '#181828',
                    color: '#fff',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Enter your advertisement text here..."
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handlePreviewBanner}
                  style={{
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Preview
                </button>

                <button
                  onClick={handleSaveBanner}
                  style={{
                    background: 'linear-gradient(135deg, #9747ff, #7c3aed)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Save Changes
                </button>

                <button
                  onClick={handleResetBanner}
                  style={{
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Reset to Default
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ad Banner Edit Section */}
        {activeSection === 'ad-banner-edit' && (
          <div style={{
            minHeight: '100vh',
            background: 'url("/assets/bg.svg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'fixed',
            fontFamily: 'NeueMachina',
            padding: '2rem',
            color: '#fff',
            marginLeft: '5rem',
            marginRight: '2rem'
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              paddingTop: '20px'
            }}>
              {/* Header */}
              <div style={{
                textAlign: 'center',
                marginBottom: '3rem'
              }}>
                <h1 style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  margin: '0 0 1rem 0',
                  background: 'linear-gradient(135deg, #9747ff, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Advertisement Banner Editor
                </h1>
                <p style={{
                  fontSize: '1.1rem',
                  color: '#ccc',
                  margin: 0
                }}>
                  Customize your advertisement banner text, colors, and animation
                </p>
              </div>

              {/* Editor Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2rem',
                marginBottom: '2rem'
              }}>
                {/* Left Column - Text Settings */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h3 style={{
                    color: '#9747ff',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: '0 0 1.5rem 0'
                  }}>
                    Banner Text & Content
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      color: '#ccc',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Advertisement Text
                    </label>
                    <textarea
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #9747ff',
                        fontSize: '16px',
                        background: '#181828',
                        color: '#fff',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Enter your advertisement text here..."
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      color: '#ccc',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Font Size (px)
                    </label>
                    <input
                      type="number"
                      value="18"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '1.5px solid #9747ff',
                        fontSize: '16px',
                        background: '#181828',
                        color: '#fff'
                      }}
                      min="12"
                      max="32"
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      color: '#ccc',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Font Weight
                    </label>
                    <select
                      value="bold"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '1.5px solid #9747ff',
                        fontSize: '16px',
                        background: '#181828',
                        color: '#fff'
                      }}
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Bold</option>
                      <option value="600">Semi Bold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra Bold</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      color: '#ccc',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Scroll Speed (seconds)
                    </label>
                    <input
                      type="number"
                      value="20"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '1.5px solid #9747ff',
                        fontSize: '16px',
                        background: '#181828',
                        color: '#fff'
                      }}
                      min="5"
                      max="60"
                    />
                  </div>
                </div>

                {/* Right Column - Color Settings */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '2rem',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h3 style={{
                    color: '#9747ff',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    margin: '0 0 1.5rem 0'
                  }}>
                    Colors & Styling
                  </h3>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      color: '#ccc',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Background Color
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <input
                        type="color"
                        value="#ea5c03"
                        style={{
                          width: '60px',
                          height: '50px',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="color"
                        value="#ffe100"
                        style={{
                          width: '60px',
                          height: '50px',
                          border: 'none',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>
                    <div style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      background: 'linear-gradient(90deg, rgb(234, 92, 3), rgb(255, 225, 0))',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      textAlign: 'center',
                      color: '#000',
                      fontWeight: 'bold'
                    }}>
                      Preview Background
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'block',
                      color: '#ccc',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      fontSize: '1rem'
                    }}>
                      Text Color
                    </label>
                    <input
                      type="color"
                      value="#000000"
                      style={{
                        width: '100%',
                        height: '50px',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#ccc',
                      fontWeight: '500',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={bannerActive}
                        onChange={(e) => setBannerActive(e.target.checked)}
                        style={{
                          marginRight: '0.5rem',
                          transform: 'scale(1.2)'
                        }}
                      />
                      Banner Active
                    </label>
                  </div>

                  <div style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, rgb(234, 92, 3), rgb(255, 225, 0))',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    textAlign: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '18px'
                  }}>
                    Text Preview: {bannerText.substring(0, 50)}...
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={handlePreviewBanner}
                  style={{
                    background: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Preview
                </button>

                <button
                  onClick={handleSaveBanner}
                  style={{
                    background: 'linear-gradient(135deg, #9747ff, #7c3aed)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Save Changes
                </button>

                <button
                  onClick={handleResetBanner}
                  style={{
                    background: '#f59e0b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Reset to Default
                </button>
              </div>

              {/* Instructions */}
              <div style={{
                marginTop: '3rem',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}>
                <h3 style={{
                  color: '#9747ff',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  margin: '0 0 1rem 0'
                }}>
                  How to Use
                </h3>
                <ul style={{
                  color: '#ccc',
                  lineHeight: '1.6',
                  paddingLeft: '1.5rem'
                }}>
                  <li>Edit the advertisement text to customize your message</li>
                  <li>Choose background colors using the color pickers</li>
                  <li>Select text color for optimal readability</li>
                  <li>Adjust font size and weight as needed</li>
                  <li>Control scroll speed (lower = faster)</li>
                  <li>Use "Preview" to see the banner in action</li>
                  <li>Click "Save Changes" to apply your settings</li>
                  <li>Use "Reset to Default" to restore original settings</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
        :root {
          --sidebar-width: 260px;
        }
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          margin-top: -2rem;
          background: url('/assets/bg.svg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          font-family: "NeueMachina";
        }

        .sidebar {
          width: 260px;
          min-width: 250px;
          min-height: 100vh;
          background:rgba(255, 255, 255, 0.07);
          color: #fff;
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 2rem 0;
          backdrop-filter: blur(5px);
          box-sizing: border-box;
          border-top-right-radius: 25px;
          border-bottom-right-radius: 25px;
           box-shadow: 0 2px 15px rgba(224, 214, 247, 0.29);
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          
          pointer-events: none;
        }

        .sidebar-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        .profile-section {
          padding: 2rem 1rem 1.5rem;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .avatar {
          margin: 0 auto 1rem auto;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.2);
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .user-name {
          text-align: center;
          font-weight: 800;
          font-size: 1.5rem;
          font-family: "NeueMachina";
          letter-spacing: 1px;
          margin: 0;
          word-wrap: break-word;
        }

        .nav-menu {
          flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem 1rem;
    margin-top: auto;
    margin-bottom: auto;
    align-items: center;
  
        }

        .nav-item {
  width: 80%;
  max-width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  color: #fff;
  background: transparent; /* Default background transparent */
  font-family: "NeueMachina";
  text-align: center;
  cursor: pointer;
  border-radius: 20px;
  transition: all 0.8s ease;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
   transition: all 0.5s ease;
}

.nav-item span {
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  z-index: 1;
}

/* Hover effect - 3D styling sirf hover pe */
.nav-item:hover {
  background: linear-gradient(145deg,rgb(238, 112, 63), #e95a22);
  transform: translateY(-1px) scale(1.03);
  box-shadow: 0 4px 8px rgba(151, 71, 255, 0.4),
              0 15px 15px rgba(151, 71, 255, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
   transition: all 0.5s ease;
}

.nav-item:hover::before {
  left: 100%;
}

/* Active effect - 3D styling sirf active pe */
.nav-item:active {
  background: linear-gradient(145deg, #a855f7, #7c3aed);
  transform: translateY(-1px) scale(1.03);
  box-shadow: 0 4px 15px rgba(151, 71, 255, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
   transition: all 0.5s ease;
}

/* Active class - 3D styling sirf active class pe */
.nav-item.active {
  background: linear-gradient(145deg, #a855f7, #7c3aed);
  transform: translateY(-1px) scale(1.03);
  box-shadow: 0 4px 8px rgba(151, 71, 255, 0.4),
              0 15px 15px rgba(151, 71, 255, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
   transition: all 0.5s ease;
}

        

        .shoora-logo-wrap {
          padding: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .shoora-logo {
          width: 15rem;
          border-radius: 12px;
          
          padding: 6px;
         
        }

        .main-content {
          margin-left: 292px;
          margin-right: 2rem;
          padding: 2rem 0;
          flex: 1;
          overflow-y: auto;
          min-width: 0;
          border-radius: 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.04);
          position: relative;
          z-index: 1;
        }
        

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          border-radius: 25px;
          color: white;
          position: relative;
          overflow: hidden;
          border-radius: 25px;
          cursor: pointer;
        }

       

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:rgba(255, 255, 255, 0.06);
          pointer-events: none;
        }

        
      
        .student  {
          backdrop-filter: blur(5px);
          background: transparent ;
          
        }

        .teacher{
          backdrop-filter: blur(5px);
          background: transparent ;
          
        }

                 .mouse-light {
   position: absolute;
   width: 200px;
   height: 200px;
   border-radius: 50%;
   pointer-events: none;
   transform: translate(-50%, -50%);
   transition: none;
   z-index: 1;
   filter: blur(15px);
   will-change: left, top;
 }

 .mouse-light.orange {
   background: radial-gradient(circle, 
     rgba(151, 71, 255, 0.5) 0%, 
     rgba(151, 71, 255, 0.3) 40%, 
     rgba(151, 71, 255, 0.1) 70%, 
     transparent 100%);
   box-shadow: 0 0 50px rgba(151, 71, 255, 0.4);
 }

 .mouse-light.purple {
   background: radial-gradient(circle, 
     rgba(151, 71, 255, 0.5) 0%, 
     rgba(151, 71, 255, 0.3) 40%, 
     rgba(151, 71, 255, 0.1) 70%, 
     transparent 100%);
   box-shadow: 0 0 50px rgba(151, 71, 255, 0.4);
 }

.stat-card:hover {
 
  transition: transform 0.3s ease;
}



        .card-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .card-icon {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          height: 100%;
          width: 120px;
          display: flex;
          align-items: stretch;
          justify-content: flex-end;
          z-index: 2;
        }
        .card-icon img{
          height: 100%;
          width: 100%;
          object-fit: cover;
          border-radius: 0 16px 16px 0;
        }

        .card-text h4 {
          margin: 0;
          font-size: 0.9rem;
          font-family: "NeueMachina";
          font-weight: 500;
          opacity: 0.9;
        }

        .card-text h2 {
          margin: 0.5rem 0 0;
          font-size: 2rem;
          font-family: "NeueMachina";
          font-weight: 700;
        }

        .flight-routes {
          position: absolute;
          top: 50%;
          right: 2rem;
          transform: translateY(-50%);
        }

        .route-line {
          width: 60px;
          height: 2px;
          background: rgba(255,255,255,0.4);
          margin: 0.5rem 0;
          border-radius: 2px;
        }

        .route-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          margin: 0.25rem 0;
        }

        .content-grid {
          display: grid;
          margin-bottom: 2rem;
          gap: 1.5rem;
         
          width: 100%;
          max-width: 100%;
        }

        .content-card {
          background:rgba(255, 255, 255, 0.05);
          backdropfilter: Blur(9px);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(5px);
          box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .content-card h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          font-family: "NeueMachina";
          font-weight: 600;
          color: #ffffff;
        }

        .subtitle {
          margin: 0 0 1.5rem;
          font-size: 1.2rem;
          font-weight: 800;
          font-family: "NeueMachina";
          color: #9747ff;
        }

        .last-trips {
          grid-row: span 2;
        }

        .trips-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.8rem;
          font-weight: 500;
          font-family: "NeueMachina";
          color:rgb(255, 255, 255);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .trip-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
          gap: 1rem;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f9fafb;
        }

        .member-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .member-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        .member-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .member-details h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: "NeueMachina";
          color:rgb(255, 255, 255);
        }

        .member-details p {
          margin: 0.25rem 0 0;
          font-size: 0.8rem;
          font-family: "NeueMachina";
          color:rgb(201, 201, 201);
        }

        .flight-destination {
          font-size: 0.9rem;
          color:rgb(255, 255, 255);
          font-family: "NeueMachina";
        }

        .status-badge {
          display: flex;
          justify-content: center;
        }

        .status-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .price {
          font-size: 0.9rem;
          font-weight: 600;
          font-family: "NeueMachina";
          color:rgb(255, 255, 255);
        }

        .statistics {
          margin-bottom: 1.5rem;
        }

        .chart-container {
          height: 200px;
          margin-top: 1rem;
        }

        .flight-share {
          margin-bottom: 1.5rem;
        }

        .pie-chart-container {
          position: relative;
          height: 200px;
          margin-top: 1rem;
        }

        .chart-center-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          font-size: 0.8rem;
          font-family: "NeueMachina";
          color:rgb(255, 255, 255);
          font-weight: 500;
        }

        .flight-schedule {
          position: relative;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          backdrop-filter: blur(5px);
        }

        .schedule-highlight {
          position: absolute;
          top: 1rem;
          right: 1rem;
          text-align: center;
        }

        .highlight-badge {
          background: #374151;
          
          color: white;
          padding: 0.5rem 1rem;
          font-family: "NeueMachina";
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .schedule-chart {
          height: 150px;
          margin-top: 2rem;
        }

          @media (max-width: 1490px) {
          .main-content {
            margin-left: 20vw;
            
          }
          }

        @media (max-width: 1024px) {
          .sidebar {
            width: 180px;
            min-width: 180px;
          }
          .main-content {
            margin-left: 212px;
            margin-right: 1rem;
            padding: 1.5rem 0;
          }
          .dashboard-container {
            flex-direction: column;
          }
          
          .stats-cards {
            grid-template-columns: 1fr;
          }

          .content-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 60px;
            min-width: 60px;
            padding: 1rem 0;
          }
          
          .nav-item {
            font-size: 0.9rem;
            padding: 12px 14px;
           
          }
          
          .nav-item span {
            margin-left: 10px;
          }
          .main-content {
            margin-left: 80px;
            padding: 1rem;
          }

          .content-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .content-card {
            padding: 1rem;
          }

          .trips-header,
          .trip-row {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
        }
            margin-left: 92px;
            margin-right: 0.5rem;
            padding: 1rem 0;
          }
        }
        .course-label {
          color: #ffffff;
          font-weight: 500;
          margin-right: 8px;
          
        }
        .course-dropdown {
          padding: 6px 28px 6px 12px;
          border-radius: 25px;
          font-size: 16px;
          background:rgba(35, 35, 35, 0);
          color: #fff;
          border: 1px solid #555;
          outline: none;
          font-family: inherit;
          transition: border 0.2s;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url('https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/Chevron_Down.svg?updatedAt=1751449294204');
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 18px 18px;
        }
        .course-dropdown:focus {
          border: 1.5px solid #9747ff;
        }
        /* Style dropdown options for Chrome, Edge, Safari */
        .course-dropdown option {
          background: #ffffff;
          border-radius: 25px;
          color: #9747ff;
        }
        .nav-item.active {
          background: #9747ff;
          color: #fff;
          transform: scale(1.05);
          font-weight: bold;
        }
        .add-courses-card {
          max-width: 500px;
          margin: 2rem auto;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 18px;
          padding: 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        .add-course-form .input-field, .add-course-form textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color:rgba(111, 111, 111, 0.25);
          border: none;
          border-radius: 0.5rem;
          color: white;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          font-family: inherit;
        }
        .add-course-form textarea {
          min-height: 80px;
          resize: vertical;
        }
        .add-course-form .submit-btn {
          width: 100%;
          background: #e95a22;
          border: none;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          font-family: "NeueMachina";
          color: white;
          border-radius: 10px;
          transition: 0.3s ease;
          margin-top: 10px;
        }
        .add-course-form .submit-btn:hover {
          background:rgb(255, 255, 255);
          color: #e95a22;
        }

        .logout-button {
    background: linear-gradient(145deg, #9747ff, #7c3aed);
    padding: 1rem;
    width: 80%;
    max-width: 160px;
    border-radius: 20px;
    border: none;
    font-size: 1rem;
    font-weight: 800;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: "NeueMachina";
    margin: 1rem auto;
    cursor: pointer;
    transition: all 0.3s ease;
    color: white;
    box-shadow: 0 4px 15px rgba(151, 71, 255, 0.2);
    position: relative;
    overflow: hidden;
}

.logout-button:hover {
    background: linear-gradient(145deg, #a855f7, #7c3aed);
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 4px 8px rgba(151, 71, 255, 0.4), 
                0 15px 15px rgba(151, 71, 255, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.logout-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
}

.logout-button:hover::before {
    left: 100%;
}

.logout-button:active {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 4px 15px rgba(151, 71, 255, 0.3);
}
        
      /* Toggle slider styles */
      .member-toggle {
        display: flex;
        background: rgba(151, 71, 255, 0.12);
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(151, 71, 255, 0.08);
      }
      .toggle-btn {
        padding: 8px 22px;
        background: transparent;
        border: none;
        color: #fff;
        font-size: 1rem;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
        border-radius: 20px;
        font-weight: 600;
        position: relative;
        overflow: hidden;
      }
      .toggle-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s ease;
      }
      .toggle-btn:hover::before {
        left: 100%;
      }
      .toggle-btn:hover {
        
        box-shadow: 0 4px 8px rgba(151, 71, 255, 0.4), 
                    0 15px 15px rgba(151, 71, 255, 0.2),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1),
                    inset 0 -2px 4px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #fff;
      }
      .toggle-btn.active {
        background: linear-gradient(90deg, #9747ff, #7c3aed);
        color: #fff;
        box-shadow: 0 2px 8px rgba(151, 71, 255, 0.18);
      }
      /* Teacher profile modal styles */
      .teacher-modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: #9747ff;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.2s;
      }
      .teacher-modal-card {
        background: #9747ff;
        border-radius: 18px;
        padding: 2.2rem 2.5rem 2rem 2.5rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
        min-width: 320px;
        max-width: 95vw;
        position: relative;
        color: #fff;
        text-align: center;
        animation: popIn 0.2s;
      }
      .teacher-modal-photo img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1.2rem;
        border: 3px solid #9747ff;
        background: #fff;
      }
      .teacher-modal-info h2 {
        margin: 0 0 0.5rem 0;
        color: #ff6a32;
        font-size: 1.5rem;
      }
      .teacher-modal-info p {
        margin: 0.3rem 0;
        font-size: 1.08rem;
        color: #eee;
      }
      .teacher-modal-close {
        position: absolute;
        top: 10px;
        right: 18px;
        background: none;
        border: none;
        color: #fff;
        font-size: 2rem;
        cursor: pointer;
        z-index: 2;
        transition: color 0.2s;
      }
      .teacher-modal-close:hover {
        color: #ff6a32;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes popIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes scrollText {
        from { transform: translateX(0%); }
        to { transform: translateX(-50%); }
      }
      /* Floating teacher card styles */
      .teacher-float-card {
        background: url("/assets/bg3.svg");
        border-radius: 18px;
        padding: 1.5rem 2rem 1.2rem 2rem;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
        min-width: 260px;
        max-width: 95vw;
        color: #fff;
        text-align: center;
        pointer-events: auto;
        animation: popIn 0.18s;
      }
      .teacher-float-card .teacher-modal-photo img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
        border: 2px solid #9747ff;
        background: #fff;
      }
      .teacher-float-card .teacher-modal-info h2 {
        margin: 0 0 0.4rem 0;
        color: #ff6a32;
        font-size: 1.2rem;
      }
      .teacher-float-card .teacher-modal-info p {
        margin: 0.2rem 0;
        font-size: 1rem;
        color: #eee;
      }
      .teacher-hoverable {
        transition: background 0.18s;
        border-radius: 16px;
        position: relative;
      }
      .teacher-hoverable:hover, .teacher-hoverable.hovered {
        background: rgba(151, 71, 255, 0.13);
        box-shadow: 0 2px 12px 0 rgba(151, 71, 255, 0.08);
      }

      .modal-btn-popup {
        background: #fff;
        color: #9747ff;
        border: none;
        border-radius: 8px;
        padding: 0.9rem 2.2rem;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        font-family: 'NeueMachina';
        transition: background 0.2s, color 0.2s;
        outline: none;
      }
      .modal-btn-popup:hover, .modal-btn-popup:active {
        background: #9747ff;
        color: #fff;
      }

      `}</style>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            zIndex: 99999,
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }} 
      />
    </div>
  );
};

export default SuperAdminDashboard;