'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import FormField from '@/components/FormField';
import FormFieldPassword from '@/components/FormFieldPassword';
import colleges from '@/data/colleges.json';
import schools from '@/data/schools.json';
import { signIn } from 'next-auth/react';

import VerifyFacePopup from '@/components/VerifyFacePopup';
import GetStartedModal from '@/components/GetStartedModal';

export default function RegisterPage() {
  const router = useRouter();
  
  const emptyForm = {
    fullName: '', email: '', phone: '', dob: '',
    guardianName: '', guardianPhone: '', annualIncome: '',
    address: '', qualification: '', schoolName: '', customSchool: '',
    collegeName: '', customCollege: '', year: '', course: '',
    class: '', password: '', confirmPassword: ''
  };

  const [form, setForm] = useState(emptyForm);
  const [eduType, setEduType] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRightPanelActive, setIsRightPanelActive] = useState(true);
  const [faceVerified, setFaceVerified] = useState(false);
  const [isVerifyPopupOpen, setIsVerifyPopupOpen] = useState(false);
  const [verifiedFaceImage, setVerifiedFaceImage] = useState(null);
  const [isLoginPopupOpen, setLoginPopupOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('❌ Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('❌ Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setFaceVerified(false);
        setVerifiedFaceImage(null);
      };
      reader.readAsDataURL(file);
      
      console.log('📸 Image selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
    } else {
      setImageFile(null);
      setImagePreviewUrl(null);
      setFaceVerified(false);
      setVerifiedFaceImage(null);
    }
  };

  const handleOpenVerifyPopup = () => {
    if (!imageFile) {
      toast.error('Please upload a photo first for face verification.');
      return;
    }
    setIsVerifyPopupOpen(true);
  };

  const handleCloseVerifyPopup = () => {
    setIsVerifyPopupOpen(false);
  };

  const validateForm = () => {
    // Basic validation
    if (!form.fullName.trim()) {
      toast.error('❌ Full name is required');
      return false;
    }
    
    if (!form.email.trim()) {
      toast.error('❌ Email is required');
      return false;
    }
    
    if (!form.phone.trim()) {
      toast.error('❌ Phone number is required');
      return false;
    }
    
    if (!form.password) {
      toast.error('❌ Password is required');
      return false;
    }
    
    if (form.password !== form.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return false;
    }
    
    if (!imageFile) {
      toast.error("❌ Please upload a profile photo");
      return false;
    }
    
    if (!faceVerified) {
      toast.error('❌ Please verify your face before registering');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Starting registration process...');
      
      const formData = new FormData();
      
      // Add all form fields except confirmPassword
      Object.keys(form).forEach(key => {
        if (key !== 'confirmPassword' && form[key]) {
          formData.append(key, form[key]);
        }
      });
      
      // Add profile photo
      if (imageFile) {
        formData.append('profilePhoto', imageFile, imageFile.name);
        console.log('📸 Added profile photo:', imageFile.name);
      }
      
      // Add additional fields
      formData.append('status', 'trial');
      formData.append('idCardNumber', '');
      
      console.log('📡 Sending registration request...');
      
      const response = await fetch('/api/student/register', {
        method: 'POST',
        body: formData,
      });
      
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      
      if (data.success) {
        toast.success('✅ Registration successful! Welcome aboard!');
        
        // Store student ID in localStorage
        if (data.student?._id) {
          localStorage.setItem('studentId', data.student._id);
        }
        
        // Reset form
        setForm(emptyForm);
        setImageFile(null);
        setImagePreviewUrl(null);
        setEduType('');
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/student-dashboard');
        }, 1500);
        
      } else {
        console.error('❌ Registration failed:', data.message);
        toast.error(data.message || '❌ Registration failed. Please try again.');
      }
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      toast.error('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', top: 24, left: 24, display: 'flex', alignItems: 'center', zIndex: 10 }}>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'transparent',
            border: '2px solid #ff6a32',
            color: '#ff6a32',
            borderRadius: '50%',
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #ff6a3222',
            outline: 'none',
            transition: 'background 0.2s, color 0.2s',
          }}
          title="Back to Home"
        >
          <span style={{ fontSize: 24, fontWeight: 700, lineHeight: 1, color: '#ff6a32' }}>&#8592;</span>
        </button>
        <span style={{ color: '#ff6a32', fontSize: '1em', fontWeight: 500, marginLeft: 12, userSelect: 'none', display: 'flex', alignItems: 'center', height: 44 }}>Back</span>
      </div>
      <div className="form-container sign-up-container" style={{ maxWidth: 420, minWidth: '60vw', width: '100%', padding: '2.5rem 2rem 2rem 2rem', borderRadius: 18, background: 'rgba(30,30,30,0.98)' }}>
        <form onSubmit={handleSubmit}>
          <h2 className="form-title">Student Registration</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '1rem 0' }}>
            <button
              type="button"
              className="ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              onClick={() => router.push('/student-login')}
            >
              Login
            </button>
            <button
              type="button"
              className="ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
              onClick={() => signIn('google', { callbackUrl: '/register/google' })}
            >
              <img src={'/assets/google-icon.svg'} alt="Google" style={{ width: 22, height: 22, verticalAlign: 'middle' }} />
              <span className="google-btn-text">Register with Google</span>
            </button>
          </div>

          {/* Profile Photo Uploader */}
          <div className="profile-photo-uploader" style={{ marginTop: '2rem' }}>
            <label htmlFor="profilePhotoInput" className={`photo-upload-circle ${faceVerified ? 'verified-border' : ''}`}>
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="Profile Preview" className="uploaded-image-preview" />
              ) : (
                <span className="upload-text">Upload Photo</span>
              )}
              <input
                id="profilePhotoInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
            {!faceVerified && imageFile && (
              <button type="button" onClick={handleOpenVerifyPopup} className="verify-face-button">
                Verify Face
              </button>
            )}
            {faceVerified && (
              <p className="face-verified-text">Face Verified! ✅</p>
            )}
          </div>

          {/* Form Fields */}
          <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
          <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
          <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          <FormField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />
          <FormField label="Guardian Name" name="guardianName" value={form.guardianName} onChange={handleChange} />
          <FormField label="Guardian Phone" name="guardianPhone" type="tel" value={form.guardianPhone} onChange={handleChange} />
          <FormField label="Annual Income" name="annualIncome" value={form.annualIncome} onChange={handleChange} />
          <FormField label="Address" name="address" value={form.address} onChange={handleChange} required />

          {/* Education Type Switch */}
          <div className="field">
            <label>Education Type</label>
            <select name="eduType" value={eduType} onChange={(e) => setEduType(e.target.value)}>
              <option value="">Select</option>
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>

          {/* School Fields */}
          {eduType === "school" && (
            <>
              <div className="field">
                <label>School</label>
                <select name="schoolName" value={form.schoolName} onChange={handleChange}>
                  <option value="">Select a school</option>
                  {schools.map((s, i) => <option key={i} value={s}>{s}</option>)}
                  <option value="other">Other</option>
                </select>
              </div>
              {form.schoolName === "other" && (
                <FormField label="Custom School" name="customSchool" value={form.customSchool} onChange={handleChange} />
              )}
              <div className="field">
                <label>Class</label>
                <select name="class" value={form.class} onChange={handleChange}>
                  <option value="">Select Class</option>
                  {["5", "6", "7", "8", "9", "10", "11", "12"].map(cls => (
                    <option key={cls} value={cls}>Class {cls}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* College Fields */}
          {eduType === "college" && (
            <>
              <FormField label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} required />
              <div className="field">
                <label>College</label>
                <select name="collegeName" value={form.collegeName} onChange={handleChange}>
                  <option value="">Select a college</option>
                  {colleges.map((c, i) => <option key={i} value={c}>{c}</option>)}
                  <option value="other">Other</option>
                </select>
              </div>
              {form.collegeName === "other" && (
                <FormField label="Custom College" name="customCollege" value={form.customCollege} onChange={handleChange} />
              )}
              <FormField label="Course" name="course" value={form.course} onChange={handleChange} />
              <FormField label="Year" name="year" value={form.year} onChange={handleChange} />
            </>
          )}

          <FormFieldPassword label="Password" name="password" value={form.password} onChange={handleChange} userName={form.fullName} setForm={setForm} />
          <FormFieldPassword label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

          <button type="submit" className="submit-btn">Register</button>
        </form>

        <VerifyFacePopup
          isOpen={isVerifyPopupOpen}
          onClose={handleCloseVerifyPopup}
          imageSrc={imagePreviewUrl}
          setFaceVerified={setFaceVerified}
          setVerifiedFaceImage={setVerifiedFaceImage}
        />

        {/* No login popup on register page */}

        <style jsx global>{`
        body {
            background-image: url("/assets/bg.svg");
            background-position: top;
            background-size: cover;
            background-repeat: no-repeat;
            height: initial;
          }

          .auth-container {
          background-image: url("/assets/bg.svg");
            display: flex;
            flex-direction: column;
            width: 80%;
            margin: 2rem auto;
            border-radius: 16px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 20px rgba(0,0,0,0.4);
            backdrop-filter: blur(5px);
            min-height: calc(100vh - 4rem);
            max-height: calc(100vh - 4rem);
          }

          .form-container {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
            max-height: calc(100vh - 4rem);
          }

          .form-title {
            font-size: 24px;
            font-weight: bold;
            color: #ff6a32;
            margin-bottom: 20px;
            text-align: center;
          }

          /* Styles for the combined photo uploader and verify section */
          .profile-photo-uploader {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: 15px; /* Space between the circle and the text/button */
              margin-bottom: 16px;
              margin-top: 2rem;
          }

          .photo-upload-circle {
              width: 120px;
              height: 120px;
              border-radius: 50%;
              background-color: rgba(255, 255, 255, 0.08);
              backdrop-filter: blur(8px);
              border: 1px dashed #ffffff; /* Default dashed white border */
              display: flex;
              justify-content: center;
              align-items: center;
              cursor: pointer;
              overflow: hidden;
              position: relative;
              transition: border-color 0.3s ease, border-width 0.3s ease, border-style 0.3s ease; /* Smooth transition for border */
          }

          .uploaded-image-preview {
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 50%;
          }

          .upload-text {
              color: #ccc;
              font-size: 0.9rem;
              text-align: center;
              padding: 5px;
          }

          /* Overlay & Panel styles (kept unchanged) */
          .overlay-container {
            flex: 1;
            background: linear-gradient(135deg, #ff6a32, #9747FF);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 16px;
            padding: 30px;
            color: white;
          }

          .overlay-panel {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .overlay-text-group {
            margin-bottom: 10px;
          }

          .overlay h1 {
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .overlay p {
            margin-top: 0;
            font-size: 16px;
          }

          .ghost {
            margin-top: 20px;
            background: transparent;
            border: 2px solid white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 16px;
            color: white;
            cursor: pointer;
          }

          .field, .submit-btn {
            margin-bottom: 16px;
          }

          .field label {
            margin-bottom: 8px;
            display: block;
            color: #fff;
            font-size: 14px;
          }

          select {
            width: 100%;
            padding: 10px;
            padding-right: 50px;
            background:rgb(29, 29, 29);
            color: white;
            
            border: 1px solid #333;
            border-radius: 8px;
          }

          .submit-btn {
            width: 100%;
            background: #ff6a32;
            border: none;
            padding: 12px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            border-radius: 10px;
            transition: 0.3s ease;
          }

          .submit-btn:hover {
            background: #e95a22;
          }

          @media (min-width: 768px) {
            .auth-container {
              flex-direction: row;
              margin-top: 2rem;
              margin-bottom: 2rem;
              min-height: calc(100vh - 4rem);
              max-height: calc(100vh - 4rem);
            }

            .overlay-panel {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              text-align: left;
              width: 100%;
            }

            .overlay-text-group {
              margin-bottom: 0;
              margin-right: 20px;
            }

            .overlay h1,
            .overlay p {
              margin-bottom: 0;
            }

            .ghost {
              margin-top: 0;
            }

            .form-container {
              overflow-y: auto;
              max-height: calc(100vh - 4rem);
            }
          }

          @media (max-width: 600px) {
            .google-btn-text {
              display: none;
            }
          }

          .verify-face-button {
            margin-top: 10px;
            background: transparent;
            border: 2px solid white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 16px;
            color: white;
            cursor: pointer;
          }

          .face-verified-text {
            margin-top: 10px;
            color: #4caf50;
            font-size: 16px;
          }
        `}</style>
        <style jsx>{`
          @media (max-width: 600px) {
            .form-container.sign-up-container {
              max-width: 100vw;
              min-width: 0;
              width: 100vw;
              border-radius: 0;
              padding: 1.2rem 0.2rem 0.5rem 0.2rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}