import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';

export default function EditHomepage() {
  const [form, setForm] = useState({
    mainHeadingWhite: '',
    mainHeadingOrange: '',
    typewriterTexts: [], // [{ text: string, highlights: string[] }]
    stats: { studentsTaught: '', instructors: '', liveProjects: '' },
    heroImageText: '',
    heroImageTextHighlight: '',
    heroMedia: { type: 'image', url: '' },
    companies: [],
    faqs: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newTypewriterText, setNewTypewriterText] = useState('');
  const [newTypewriterHighlights, setNewTypewriterHighlights] = useState([]);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');
  const [imageFile, setImageFile] = useState(null);
  // For instant image preview
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newCompany, setNewCompany] = useState({ src: '', alt: '' });
  const [newCompanyUploading, setNewCompanyUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  // Add a ref to reset the file input if needed
  const heroImageInputRef = useRef();
  const companyFileInputRef = useRef();

  useEffect(() => {
    fetch('/api/admin/homepage')
      .then(res => res.json())
      .then(data => {
        if (!data.heroMedia) data.heroMedia = { type: 'image', url: '' };
        setForm(data);
        if (data.heroMedia && data.heroMedia.url) setImagePreview(data.heroMedia.url);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleStatChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, stats: { ...f.stats, [name]: value } }));
  };

  const handleTypewriterAdd = () => {
    if (newTypewriterText.trim()) {
      setForm(f => ({
        ...f,
        typewriterTexts: [...f.typewriterTexts, { text: newTypewriterText.trim(), highlights: newTypewriterHighlights }]
      }));
      setNewTypewriterText('');
      setNewTypewriterHighlights([]);
      showToastMessage('Typewriter text added successfully!', 'success');
    } else {
      showToastMessage('Please enter some text first.', 'error');
    }
  };
  const handleTypewriterRemove = (idx) => {
    setForm(f => ({ ...f, typewriterTexts: f.typewriterTexts.filter((_, i) => i !== idx) }));
    showToastMessage('Typewriter text removed successfully!', 'success');
  };
  const handleTypewriterEditText = (idx, value) => {
    // When text changes, reset highlights to only those words that still exist
    const words = value.split(/\s+/).filter(Boolean);
    setForm(f => ({
      ...f,
      typewriterTexts: f.typewriterTexts.map((t, i) =>
        i === idx
          ? {
              ...t,
              text: value,
              highlights: t.highlights.filter(w => words.includes(w)),
            }
          : t
      ),
    }));
  };
  const handleTypewriterEditHighlights = (idx, word, checked) => {
    setForm(f => ({
      ...f,
      typewriterTexts: f.typewriterTexts.map((t, i) => {
        if (i !== idx) return t;
        let highlights = t.highlights || [];
        if (checked) {
          if (!highlights.includes(word)) highlights = [...highlights, word];
        } else {
          highlights = highlights.filter(w => w !== word);
        }
        return { ...t, highlights };
      }),
    }));
  };

  const handleFaqAdd = () => {
    if (faqQ.trim() && faqA.trim()) {
      setForm(f => ({ ...f, faqs: [...f.faqs, { question: faqQ.trim(), answer: faqA.trim() }] }));
      setFaqQ('');
      setFaqA('');
      showToastMessage('FAQ added successfully!', 'success');
    } else {
      showToastMessage('Please fill both question and answer.', 'error');
    }
  };
  const handleFaqRemove = (idx) => {
    setForm(f => ({ ...f, faqs: f.faqs.filter((_, i) => i !== idx) }));
    showToastMessage('FAQ removed successfully!', 'success');
  };
  const handleFaqEdit = (idx, field, value) => {
    setForm(f => ({ ...f, faqs: f.faqs.map((faq, i) => i === idx ? { ...faq, [field]: value } : faq) }));
  };

  const handleCompanyAdd = async () => {
    if (!newCompany.src.trim() || !newCompany.title.trim()) {
      showToastMessage('Please fill both logo source and company name.', 'error');
      return;
    }

    try {
      let finalUrl = newCompany.src;
      
      // If it's a blob URL (file upload), upload to Cloudinary first
      if (newCompany.src.startsWith('blob:')) {
        setNewCompanyUploading(true);
        
        console.log('Debug - companyFileInputRef:', companyFileInputRef.current);
        console.log('Debug - files:', companyFileInputRef.current?.files);
        
        // Get the file from the file input using ref
        if (!companyFileInputRef.current || !companyFileInputRef.current.files[0]) {
          showToastMessage('No file selected for upload. Please select a file first.', 'error');
          return;
        }
        
        const file = companyFileInputRef.current.files[0];
        console.log('Debug - Uploading company logo:', { fileName: file.name, fileType: file.type });
        finalUrl = await uploadImageToCloudinary(file, 'company');
        console.log('Debug - Upload completed, URL:', finalUrl);
        
        // Extract filename without extension for title if not set
        if (!newCompany.title || newCompany.title === file.name.replace(/\.[^/.]+$/, "")) {
          const fileName = file.name.replace(/\.[^/.]+$/, "");
          setNewCompany(nc => ({ ...nc, title: fileName }));
        }
      }
      
      // Add to companies list
      setForm(f => {
        const updatedForm = { 
          ...f, 
          companies: [...(f.companies || []), { 
            src: finalUrl, 
            alt: newCompany.title, 
            title: newCompany.title 
          }] 
        };
        console.log('Debug - Company added to form:', updatedForm.companies);
        return updatedForm;
      });
      
      // Reset form
      setNewCompany({ src: '', title: '' });
      if (companyFileInputRef.current) {
        companyFileInputRef.current.value = '';
      }
      
      showToastMessage('Company logo added successfully!', 'success');
    } catch (err) {
      console.error('Company logo add failed:', err);
      showToastMessage('Failed to add company logo: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setNewCompanyUploading(false);
    }
  };
  const handleCompanyRemove = async (idx) => {
    try {
      const companyToRemove = form.companies[idx];
      
      // Check if it's a Cloudinary URL (not a blob URL or external URL)
      if (companyToRemove.src && companyToRemove.src.includes('cloudinary.com')) {
        console.log('Deleting company logo from Cloudinary:', companyToRemove.src);
        console.log('Company title:', companyToRemove.title);
        
        // Call API to delete from Cloudinary
        const response = await fetch('/api/admin/delete-cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: companyToRemove.src
          })
        });
        
        const responseData = await response.json();
        console.log('Company logo delete API response:', responseData);
        
        if (!response.ok) {
          console.error('Failed to delete from Cloudinary');
          showToastMessage('Logo removed from page but failed to delete from Cloudinary', 'error');
        } else {
          console.log('Successfully deleted from Cloudinary');
          showToastMessage('Company logo removed from page and Cloudinary!', 'success');
        }
      } else {
        showToastMessage('Company logo removed from page!', 'success');
      }
      
      // Remove from form state
      setForm(f => ({ ...f, companies: f.companies.filter((_, i) => i !== idx) }));
      
    } catch (error) {
      console.error('Error removing company logo:', error);
      showToastMessage('Failed to remove company logo', 'error');
    }
  };
  const handleCompanyEdit = (idx, field, value) => {
    setForm(f => ({ ...f, companies: f.companies.map((c, i) => i === idx ? { ...c, [field]: value } : c) }));
  };
  const handleHeroMediaChange = (e) => {
    const { value } = e.target;
    setForm(f => ({ ...f, heroMedia: { ...f.heroMedia, type: value, url: '' } }));
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Upload image to Cloudinary and return URL
  async function uploadImageToCloudinary(file, type) {
    console.log('Starting upload to Cloudinary:', { fileName: file.name, fileType: file.type, uploadType: type });
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);
    
    console.log('Debug - FormData created with type:', type);
    
    const resp = await fetch('/api/admin/homepage/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await resp.json();
    
    if (!resp.ok) {
      console.error('Upload API error:', data);
      throw new Error(data.error || 'Upload failed');
    }
    
    if (!data.url) {
      console.error('No URL returned from upload API:', data);
      throw new Error('No URL returned from upload');
    }
    
    console.log('Upload successful, URL:', data.url);
    return data.url;
  }

  // HERO IMAGE/VIDEO UPLOAD
  const handleHeroMediaFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    setSaving(true);
    
    // Show instant preview for image or video
    setImagePreview(URL.createObjectURL(file));
    
    try {
      console.log('Uploading hero media file:', file.name, file.type, file.size);
      
      // Determine type for Cloudinary folder and set media type
      const isVideo = file.type.startsWith('video/');
      const type = 'hero';
      console.log('File type detection:', { fileName: file.name, fileType: file.type, isVideo });
      const url = await uploadImageToCloudinary(file, type);
      
      const newHeroMedia = { 
        ...form.heroMedia, 
        url,
        type: isVideo ? 'video' : 'image'
      };
      
      setForm(f => ({ 
        ...f, 
        heroMedia: newHeroMedia
      }));
      
      console.log('Updated hero media state:', newHeroMedia);
      setImagePreview(url); // After upload, show Cloudinary image/video
      showToastMessage('Hero media uploaded successfully!', 'success');
      
      console.log('Hero media upload successful:', url);
    } catch (err) {
      console.error('Hero media upload failed:', err);
      setError('Upload failed: ' + (err.message || 'Unknown error'));
      showToastMessage('Hero media upload failed! ' + (err.message || ''), 'error');
    } finally {
      setSaving(false);
    }
  };

  // COMPANY LOGO UPLOAD
  const handleCompanyLogoFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setError('');
      // Show instant preview
      const previewUrl = URL.createObjectURL(file);
      setNewCompany(nc => ({ 
        ...nc, 
        src: previewUrl,
        title: nc.title || file.name.replace(/\.[^/.]+$/, "") // Auto-set title if empty
      }));
      showToastMessage('File selected! Click "Add Logo" to upload to Cloudinary.', 'success');
    }
  };

  const showToastMessage = (message, type = 'success') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    // No file upload, just use heroMedia.url
    const payload = { ...form };
    console.log('Debug - Saving homepage data:', payload);
    console.log('Debug - Companies count:', payload.companies?.length || 0);
    const resp = await fetch('/api/admin/homepage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      showToastMessage('Homepage successfully updated!', 'success');
    } else {
      showToastMessage('Failed to save homepage.', 'error');
    }
    setSaving(false);
  };

  // Helper to check YouTube/Vimeo
  function getVideoEmbed(url) {
    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
  }

  // Clear preview when type changes
  useEffect(() => {
    setImagePreview('');
  }, [form.heroMedia?.type]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Remove image and clear preview
  const handleRemoveHeroImage = async () => {
    try {
      const heroMediaUrl = form.heroMedia?.url;
      console.log('Hero media delete triggered. URL:', heroMediaUrl);
      
      // Check if it's a Cloudinary URL
      if (heroMediaUrl && heroMediaUrl.includes('cloudinary.com')) {
        console.log('Deleting hero media from Cloudinary:', heroMediaUrl);
        
        // Call API to delete from Cloudinary
        const response = await fetch('/api/admin/delete-cloudinary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl: heroMediaUrl
          })
        });
        
        const responseData = await response.json();
        console.log('Delete API response:', responseData);
        
        if (!response.ok) {
          console.error('Failed to delete hero media from Cloudinary');
          showToastMessage('Hero media removed from page but failed to delete from Cloudinary', 'error');
        } else {
          console.log('Successfully deleted hero media from Cloudinary');
          showToastMessage('Hero media removed from page and Cloudinary!', 'success');
        }
      } else {
        showToastMessage('Hero media removed from page!', 'success');
      }
      
      // Remove from form state
      setForm(f => ({ ...f, heroMedia: { ...f.heroMedia, url: '' } }));
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview('');
      if (heroImageInputRef.current) heroImageInputRef.current.value = '';
      
    } catch (error) {
      console.error('Error removing hero media:', error);
      showToastMessage('Failed to remove hero media', 'error');
    }
  };

  if (loading) return <div style={{ color: '#fff' }}>Loading...</div>;

  return (
    <>
      <style jsx>{`
        .edit-homepage-form .input-field, .edit-homepage-form textarea {
          background: #171717;
          border: 1.5px solid #232428;
          color: #fff;
          border-radius: 6px;
          padding: 10px 14px;
          font-size: 1rem;
          font-family: 'NeueMachina', sans-serif;
          margin-top: 6px;
          margin-bottom: 2px;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .edit-homepage-form .input-field:focus, .edit-homepage-form textarea:focus {
          border: 1.5px solid #9747ff;
          outline: none;
          box-shadow: 0 0 0 2px #9747ff33;
        }
        .edit-homepage-form textarea {
          min-height: 48px;
          resize: vertical;
        }
        .admin-section-card {
          background: #18181c;
          border-radius: 14px;
          box-shadow: 0 2px 16px 0 #0004;
          padding: 28px 24px 18px 24px;
          margin-bottom: 28px;
          border: 1.5px solid #232428;
          max-width: 700px;
          width: 100%;
        }
        .admin-section-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #9747ff;
          margin-bottom: 18px;
          border-left: 4px solid #9747ff;
          padding-left: 12px;
          letter-spacing: 0.01em;
        }
        .admin-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 12px;
        }
        .admin-btn-primary {
          background: linear-gradient(90deg, #9747ff 0%, #7c3aed 100%);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          padding: 8px 22px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .admin-btn-primary:hover {
          background: #7c3aed;
        }
        .admin-btn-danger {
          background: none;
          border: none;
          color: #ff4d4f;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 4px 10px;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .admin-btn-danger:hover {
          background: #2a0a0a;
        }
        @media (max-width: 700px) {
          .admin-section-card { padding: 16px 6vw 12px 6vw; }
        }
        @media (max-width: 500px) {
          .admin-section-card { padding: 10px 2vw 8px 2vw; }
          .admin-section-title { font-size: 1.1rem; padding-left: 7px; }
        }
      `}</style>
      <form onSubmit={handleSave} className="add-course-form edit-homepage-form" style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        <h3 style={{ color: '#9747ff', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Edit Home Page Content</h3>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'limegreen' }}>{success}</div>}

        {/* Main Heading Section */}
        <div className="admin-section-card">
          <div className="admin-section-title">Main Heading</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Main Heading (White):</label>
            <input name="mainHeadingWhite" value={form.mainHeadingWhite} onChange={handleChange} className="input-field" placeholder="e.g. This isn't school. This is" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#ff6a32', fontWeight: 500, marginRight: 8 }}>Main Heading (Orange):</label>
            <input name="mainHeadingOrange" value={form.mainHeadingOrange} onChange={handleChange} className="input-field" placeholder="e.g. Shoora.Tech" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Hero Image Text (White):</label>
            <input name="heroImageText" value={form.heroImageText} onChange={handleChange} className="input-field" placeholder="e.g. we do whatever it takes to help you" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#9747ff', fontWeight: 500, marginRight: 8 }}>Hero Image Text (Purple):</label>
            <input name="heroImageTextHighlight" value={form.heroImageTextHighlight} onChange={handleChange} className="input-field" placeholder="e.g. understand the concepts." />
          </div>
        </div>

        {/* Typewriter Texts Section */}
        <div className="admin-section-card">
          <div className="admin-section-title">Typewriter Texts</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Typewriter Texts:</label>
            <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 8 }}>
              {Array.isArray(form.typewriterTexts) && form.typewriterTexts.map((t, i) => {
                if (!t || typeof t !== 'object' || typeof t.text !== 'string') return null;
                const safeText = t.text;
                const highlights = Array.isArray(t.highlights) ? t.highlights : [];
                const words = safeText.split(/\s+/).filter(Boolean);
                return (
                  <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    <input
                      value={safeText}
                      onChange={e => handleTypewriterEditText(i, e.target.value)}
                      className="input-field"
                      style={{ width: '100%' }}
                      placeholder={`Typewriter line ${i+1}`}
                    />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                      {words.map((word, wi) => (
                        <label key={wi} style={{ color: highlights.includes(word) ? '#ff6a32' : '#fff', cursor: 'pointer', fontWeight: highlights.includes(word) ? 700 : 400, border: highlights.includes(word) ? '1.5px solid #ff6a32' : '1.5px solid #232428', borderRadius: 6, padding: '2px 10px', marginRight: 4, background: highlights.includes(word) ? '#18181c' : 'transparent' }}>
                          <input
                            type="checkbox"
                            checked={highlights.includes(word)}
                            onChange={e => handleTypewriterEditHighlights(i, word, e.target.checked)}
                            style={{ marginRight: 4 }}
                          />
                          {word}
                        </label>
                      ))}
                    </div>
                    <button type="button" onClick={() => handleTypewriterRemove(i)} className="admin-btn-danger" title="Delete" style={{ marginTop: 4, alignSelf: 'flex-end' }}><i className="ri-delete-bin-line"></i></button>
                  </li>
                );
              })}
            </ul>
            <div className="admin-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
              <input
                value={newTypewriterText}
                onChange={e => {
                  setNewTypewriterText(e.target.value);
                  // Remove highlights for words that no longer exist
                  const words = e.target.value.split(/\s+/).filter(Boolean);
                  setNewTypewriterHighlights(hs => hs.filter(w => words.includes(w)));
                }}
                placeholder="Add new line..."
                className="input-field"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {newTypewriterText.split(/\s+/).filter(Boolean).map((word, wi) => (
                  <label key={wi} style={{ color: newTypewriterHighlights.includes(word) ? '#ff6a32' : '#fff', cursor: 'pointer', fontWeight: newTypewriterHighlights.includes(word) ? 700 : 400, border: newTypewriterHighlights.includes(word) ? '1.5px solid #ff6a32' : '1.5px solid #232428', borderRadius: 6, padding: '2px 10px', marginRight: 4, background: newTypewriterHighlights.includes(word) ? '#18181c' : 'transparent' }}>
                    <input
                      type="checkbox"
                      checked={newTypewriterHighlights.includes(word)}
                      onChange={e => {
                        const checked = e.target.checked;
                        setNewTypewriterHighlights(hs =>
                          checked
                            ? [...hs, word]
                            : hs.filter(w => w !== word)
                        );
                      }}
                      style={{ marginRight: 4 }}
                    />
                    {word}
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleTypewriterAdd} className="admin-btn-primary" style={{ marginTop: 4 }}>Add</button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="admin-section-card">
          <div className="admin-section-title">Stats</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Stats:</label>
            <div className="admin-row">
              <input name="studentsTaught" value={form.stats.studentsTaught} onChange={handleStatChange} placeholder="Students taught" type="number" className="input-field" />
              <input name="instructors" value={form.stats.instructors} onChange={handleStatChange} placeholder="Instructors" type="number" className="input-field" />
              <input name="liveProjects" value={form.stats.liveProjects} onChange={handleStatChange} placeholder="Live Projects" type="number" className="input-field" />
            </div>
          </div>
        </div>

        {/* Hero Media Section */}
        <div className="admin-section-card">
          <div className="admin-section-title">Hero Media (Image/Video)</div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: '#fff', fontWeight: 500, marginRight: 8 }}>Hero Media:</label>
            <select name="type" value={form.heroMedia?.type || 'image'} onChange={handleHeroMediaChange} className="input-field" style={{ width: 120, marginRight: 8 }}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input name="url" value={form.heroMedia?.url || ''} onChange={handleHeroMediaChange} className="input-field" placeholder="Image or video URL" style={{ width: 60 + '%', marginRight: 8 }} />
            {/* File upload for image or video */}
            {(form.heroMedia?.type === 'image' || form.heroMedia?.type === 'video') && (
              <>
                <label htmlFor={form.heroMedia?.type === 'image' ? 'hero-image-upload' : 'hero-video-upload'} style={{
                  display: 'inline-block',
                  background: '#232428',
                  color: '#fff',
                  border: '2px solid #9747ff',
                  borderRadius: '8px',
                  padding: '10px 28px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginBottom: 8,
                  marginTop: 8,
                  boxShadow: '0 2px 8px #0002',
                  transition: 'background 0.2s, border 0.2s',
                  textAlign: 'center',
                  width: form.heroMedia?.type === 'video' ? 220 : undefined,
                  textTransform: form.heroMedia?.type === 'video' ? 'uppercase' : undefined,
                }}>
                  {form.heroMedia?.type === 'image' ? (saving ? 'Uploading...' : 'Choose Image') : 'Choose Video'}
                  <input
                    id={form.heroMedia?.type === 'image' ? 'hero-image-upload' : 'hero-video-upload'}
                    type="file"
                    accept={form.heroMedia?.type === 'image' ? 'image/*' : 'video/*'}
                    style={{ display: 'none' }}
                    onChange={handleHeroMediaFileChange}
                  />
                </label>
                {/* Unified preview for image, video, or YouTube */}
                {(imagePreview || form.heroMedia?.url) && (
                  <div style={{
                    width: 240,
                    height: 140,
                    background: '#18191c',
                    border: '2px solid #9747ff',
                    borderRadius: '8px',
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {/* Delete button at top right (same as course card) */}
                    <button
                      onClick={handleRemoveHeroImage}
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
                      title="Delete Image or Video"
                    >
                      <img
                        src="https://ik.imagekit.io/cybershoora/Shooraverse/Logos%20of%20Web%20Panel%20or%20Web%20aap/dlt-btn.svg?updatedAt=17528757107599"
                        alt="Delete"
                        style={{ width: 18, height: 18, objectFit: 'contain', display: 'block' }}
                      />
                    </button>
                    {/* Preview logic */}
                    {form.heroMedia?.type === 'image' ? (
                      <img
                        src={imagePreview || form.heroMedia?.url}
                        alt="Hero Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                    ) : form.heroMedia?.type === 'video' ? (
                      (() => {
                        const url = imagePreview || form.heroMedia?.url;
                        const ytMatch = url && url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
                        if (ytMatch) {
                          return <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} width={240} height={140} frameBorder={0} allow="autoplay; encrypted-media" allowFullScreen style={{ borderRadius: 10, background: '#000' }} />;
                        }
                        return <video src={url} controls style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 10, background: '#000' }} />;
                      })()
                    ) : null}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Companies Logos Section */}
        <div className="admin-section-card">
          <div className="admin-section-title">Companies Logos</div>
          <div style={{ marginBottom: 16, color: '#ccc', fontSize: 14 }}>
            First 3 logos will appear in top row, next 4 logos in bottom row. Mobile: Auto-scroll with direction based on page scroll.
            <br />
            <span style={{ color: '#9747ff', fontWeight: 600 }}>Upload Preset:</span> shoora_verse
            <br />
            <span style={{ color: '#9747ff', fontWeight: 600 }}>Folder:</span> companies-logo (auto-created in preset)
          </div>
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 24, padding: 0, listStyle: 'none', marginBottom: 8 }}>
            {(form.companies || []).map((c, i) => (
              <li key={i} style={{
                background: '#232428',
                borderRadius: 10,
                boxShadow: '0 2px 8px #0002',
                padding: 12,
                width: 140,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative'
              }}>
                <div style={{
                  height: 120,
                  width: 140,
                  borderRadius: 10,
                  border: '1px solid #333',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: 8,
                  padding: 8
                }}>
                  {c.src && (
                    <img src={c.src} alt={c.alt} style={{
                      height: 60,
                      width: '100%',
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: 60,
                      marginBottom: 4
                    }} />
                  )}
                  <div style={{ color: '#333', fontWeight: 600, fontSize: 11, textAlign: 'center', marginBottom: 2 }}>
                    {c.title || c.alt}
                  </div>
                  <div style={{ color: '#9747ff', fontSize: 9, textAlign: 'center' }}>
                    {i < 3 ? 'Top Row' : 'Bottom Row'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCompanyRemove(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                    padding: '4px 10px',
                    borderRadius: 6,
                    position: 'absolute',
                    top: 4,
                    right: 4
                  }}
                  title="Remove"
                >
                  <i className="ri-delete-bin-line" style={{ color: '#ff4d4f', fontSize: 18 }}></i>
                </button>
              </li>
            ))}
          </ul>
          <div className="admin-row">
            <input 
              value={newCompany.src} 
              onChange={e => setNewCompany(nc => ({ ...nc, src: e.target.value }))} 
              placeholder="Logo URL (optional if uploading file)..." 
              className="input-field" 
              style={{ width: '30%' }} 
            />
            <input 
              value={newCompany.title} 
              onChange={e => setNewCompany(nc => ({ ...nc, title: e.target.value }))} 
              placeholder="Company name (hover title)..." 
              className="input-field" 
              style={{ width: '25%' }} 
            />
            <div style={{ 
              width: '20%', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input 
                ref={companyFileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleCompanyLogoFile} 
                style={{ 
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  zIndex: 2
                }} 
              />
              <button 
                type="button"
                onClick={() => companyFileInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  background: '#2a2a2a',
                  border: '2px dashed #555',
                  borderRadius: '8px',
                  color: '#ccc',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#9747ff';
                  e.target.style.background = '#1a1a1a';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#555';
                  e.target.style.background = '#2a2a2a';
                  e.target.style.color = '#ccc';
                }}
              >
                <i className="ri-image-add-line" style={{ fontSize: '16px' }}></i>
                Choose Logo
              </button>
            </div>
            {newCompanyUploading && <span style={{ color: '#9747ff' }}>Uploading...</span>}
            <button 
              type="button" 
              onClick={handleCompanyAdd} 
              className="admin-btn-primary"
              disabled={!newCompany.src || !newCompany.title}
            >
              Add Logo
            </button>
          </div>
          
          {/* Preview Section */}
          {newCompany.src && (
            <div style={{ marginTop: 16, padding: 16, background: '#1a1a1a', borderRadius: 8, border: '1px solid #333' }}>
              <div style={{ color: '#9747ff', fontSize: 14, marginBottom: 8, fontWeight: 600 }}>
                Logo Preview: {newCompany.src.startsWith('blob:') ? '(File Upload)' : '(URL Input)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  height: 120,
                  width: 140,
                  borderRadius: 10,
                  border: '1px solid #333',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: 8
                }}>
                  <img 
                    src={newCompany.src} 
                    alt={newCompany.title || 'Company logo'} 
                    style={{ 
                      height: 60,
                      width: '100%', 
                      objectFit: 'contain',
                      maxWidth: '100%',
                      maxHeight: 60,
                      marginBottom: 4
                    }} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{ color: '#333', fontWeight: 600, fontSize: 11, textAlign: 'center', marginBottom: 2 }}>
                    {newCompany.title || 'Company Name'}
                  </div>
                  <div style={{ color: '#9747ff', fontSize: 9, textAlign: 'center' }}>
                    Preview
                  </div>
                </div>
                <div style={{ 
                  display: 'none', 
                  height: 120, 
                  width: 140, 
                  borderRadius: 10, 
                  border: '1px solid #333', 
                  background: '#f0f0f0', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: 12,
                  flexDirection: 'column'
                }}>
                  <div>Invalid URL</div>
                  <div style={{ fontSize: 10, marginTop: 4 }}>Please check the URL</div>
                </div>
                <div>
                  <div style={{ color: '#fff', fontSize: 14, marginBottom: 4 }}>
                    <strong>Company:</strong> {newCompany.title || 'Not set'}
                  </div>
                  <div style={{ color: '#ccc', fontSize: 12 }}>
                    <strong>Source:</strong> {newCompany.src.startsWith('blob:') ? 'File Upload' : 'URL Input'}
                  </div>
                  <div style={{ color: '#ccc', fontSize: 12 }}>
                    <strong>URL:</strong> {newCompany.src.length > 50 ? newCompany.src.substring(0, 50) + '...' : newCompany.src}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FAQs Section */}
        <div className="admin-section-card">
          <div className="admin-section-title">FAQs</div>
          <ul style={{ paddingLeft: 0, listStyle: 'none', marginBottom: 8 }}>
            {form.faqs.map((faq, i) => (
              <li key={i} style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                <input value={faq.question} onChange={e => handleFaqEdit(i, 'question', e.target.value)} placeholder="Question" className="input-field" style={{ width: '40%' }} />
                <input value={faq.answer} onChange={e => handleFaqEdit(i, 'answer', e.target.value)} placeholder="Answer" className="input-field" style={{ width: '55%' }} />
                <button type="button" onClick={() => handleFaqRemove(i)} className="admin-btn-danger" title="Delete"><i className="ri-delete-bin-line"></i></button>
              </li>
            ))}
          </ul>
          <div className="admin-row">
            <input value={faqQ} onChange={e => setFaqQ(e.target.value)} placeholder="New question..." className="input-field" style={{ width: '40%' }} />
            <input value={faqA} onChange={e => setFaqA(e.target.value)} placeholder="New answer..." className="input-field" style={{ width: '55%' }} />
            <button type="button" onClick={handleFaqAdd} className="admin-btn-primary">Add FAQ</button>
          </div>
        </div>

        <button type="submit" disabled={saving} className="submit-btn" style={{ background: '#9747ff', color: '#fff', padding: '10px 24px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 18 }}>Save Changes</button>
      </form>
    </>
  );
} 