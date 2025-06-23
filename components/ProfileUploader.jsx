'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import FormField from '@/components/FormField';
import FormFieldPassword from '@/components/FormFieldPassword';
import ProfileUploader from '@/components/ProfileUploader';
import colleges from '@/data/colleges.json';
import schools from '@/data/schools.json';

export default function RegisterPage() {
  const emptyForm = {
    fullName: '', email: '', phone: '', dob: '',
    guardianName: '', guardianPhone: '', annualIncome: '',
    address: '', qualification: '', schoolName: '', customSchool: '',
    collegeName: '', customCollege: '', year: '', course: '',
    class: '', password: '', confirmPassword: ''
  };

  const [form, setForm] = useState(emptyForm);
  const [eduType, setEduType] = useState('');
  const [isRightPanelActive, setIsRightPanelActive] = useState(true);
  const [faceVerified, setFaceVerified] = useState(false);
  const [imageFile, setImageFile] = useState(null); // <-- new

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!faceVerified) {
      toast.error("❌ Please verify your face before registering");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('✅ Registration successful!');
        localStorage.setItem('studentId', data.student._id);

        if (imageFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Image = reader.result;
            await fetch('/api/upload-profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                studentId: data.student._id,
                imageBase64: base64Image,
              }),
            });
          };
          reader.readAsDataURL(imageFile);
        }

        setForm(emptyForm);
      } else {
        toast.error(data.message || '❌ Something went wrong');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Server error. Try again later');
    }
  };

  return (
    <>
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit}>
            <h2 className="form-title">Shoora.tech Registration</h2>

            <div className="overlay-container">
              <div className="overlay">
                <div className="overlay-panel">
                  <h1>Already Registered?</h1>
                  <p>Click below to login to your student account</p>
                  <button className="ghost" onClick={() => setIsRightPanelActive(false)}>Go to Login</button>
                </div>
              </div>
            </div>

            <ProfileUploader setFaceVerified={setFaceVerified} setImageFile={setImageFile} />

            <FormField label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} required />
            <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
            <FormField label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} required />

            <FormField label="Guardian Name" name="guardianName" value={form.guardianName} onChange={handleChange} />
            <FormField label="Guardian Phone" name="guardianPhone" type="tel" value={form.guardianPhone} onChange={handleChange} />
            <FormField label="Annual Income" name="annualIncome" value={form.annualIncome} onChange={handleChange} />
            <FormField label="Address" name="address" value={form.address} onChange={handleChange} required />

            {eduType === 'college' && (
              <FormField label="Qualification" name="qualification" value={form.qualification} onChange={handleChange} required />
            )}

            <div className="field">
              <label>Education Type</label>
              <select name="eduType" value={eduType} onChange={(e) => setEduType(e.target.value)}>
                <option value="">Select</option>
                <option value="school">School</option>
                <option value="college">College</option>
              </select>
            </div>

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

            {eduType === "college" && (
              <>
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

            <FormFieldPassword
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              userName={form.fullName}
              setForm={setForm}
            />

            <FormFieldPassword
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn">Register</button>
          </form>
        </div>
      </div>
    </>
  );
}
