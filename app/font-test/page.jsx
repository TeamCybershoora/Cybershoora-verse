export default function FontTestPage() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#0c0c0c', color: '#e9e9e9', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Font Test Page</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
        <h2 style={{ fontFamily: 'Beni', fontWeight: 900, fontSize: '2rem', marginBottom: '1rem' }}>
          Beni Font (Black - 900)
        </h2>
        <p style={{ fontFamily: 'Beni', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>
          Beni Font (Bold - 700)
        </p>
        <p style={{ fontFamily: 'Beni', fontWeight: 400, fontSize: '1.2rem', marginBottom: '1rem' }}>
          Beni Font (Regular - 400)
        </p>
        <p style={{ fontFamily: 'Beni', fontWeight: 300, fontSize: '1rem', marginBottom: '2rem' }}>
          Beni Font (Light - 300)
        </p>

        <h2 style={{ fontFamily: 'Juan', fontWeight: 900, fontSize: '2rem', marginBottom: '1rem' }}>
          Juan Font (Black - 900)
        </h2>
        <p style={{ fontFamily: 'Juan', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem' }}>
          Juan Font (Bold - 700)
        </p>
        <p style={{ fontFamily: 'Juan', fontWeight: 500, fontSize: '1.2rem', marginBottom: '1rem' }}>
          Juan Font (Medium - 500)
        </p>
        <p style={{ fontFamily: 'Juan', fontWeight: 400, fontSize: '1rem', marginBottom: '1rem' }}>
          Juan Font (Regular - 400)
        </p>
        <p style={{ fontFamily: 'Juan', fontWeight: 200, fontSize: '1rem', marginBottom: '2rem' }}>
          Juan Font (Extra Light - 200)
        </p>

        <h2 style={{ fontFamily: 'NeueMachina', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem' }}>
          NeueMachina Font (Bold - 700)
        </h2>
        <p style={{ fontFamily: 'NeueMachina', fontWeight: 500, fontSize: '1.5rem', marginBottom: '1rem' }}>
          NeueMachina Font (Medium - 500)
        </p>
        <p style={{ fontFamily: 'NeueMachina', fontWeight: 400, fontSize: '1.2rem', marginBottom: '2rem' }}>
          NeueMachina Font (Regular - 400)
        </p>

        <h2 style={{ fontFamily: 'Gilroy', fontWeight: 700, fontSize: '2rem', marginBottom: '1rem' }}>
          Gilroy Font (Extra Bold - 700)
        </h2>
        <p style={{ fontFamily: 'Gilroy', fontWeight: 600, fontSize: '1.5rem', marginBottom: '1rem' }}>
          Gilroy Font (Bold - 600)
        </p>
        <p style={{ fontFamily: 'Gilroy', fontWeight: 400, fontSize: '1.2rem', marginBottom: '2rem' }}>
          Gilroy Font (Medium - 400)
        </p>

        <h2 style={{ fontFamily: 'Helvetica', fontWeight: 'bold', fontSize: '2rem', marginBottom: '1rem' }}>
          Helvetica Font (Bold)
        </h2>
        <p style={{ fontFamily: 'Helvetica', fontWeight: 'normal', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Helvetica Font (Regular)
        </p>

        <h2 style={{ fontFamily: 'SourceCodePro', fontSize: '2rem', marginBottom: '1rem' }}>
          Source Code Pro Font
        </h2>
        <p style={{ fontFamily: 'SourceCodePro', fontSize: '1.2rem', marginBottom: '2rem' }}>
          This is a monospace font for code and technical content.
        </p>

        <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Font Loading Status:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>✅ Beni fonts (local TTF files)</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Juan/Juana fonts (ImageKit CDN)</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ NeueMachina fonts (ImageKit CDN)</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Gilroy fonts (ImageKit CDN)</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Helvetica fonts (ImageKit CDN)</li>
            <li style={{ marginBottom: '0.5rem' }}>✅ Source Code Pro font (ImageKit CDN)</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
          <h4 style={{ marginBottom: '1rem' }}>CSS Classes Available:</h4>
          <p className="font-beni" style={{ marginBottom: '0.5rem' }}>.font-beni - Beni font family</p>
          <p className="font-juan" style={{ marginBottom: '0.5rem' }}>.font-juan - Juan font family</p>
          <p className="font-neue-machina" style={{ marginBottom: '0.5rem' }}>.font-neue-machina - NeueMachina font family</p>
          <p className="font-gilroy" style={{ marginBottom: '0.5rem' }}>.font-gilroy - Gilroy font family</p>
          <p className="font-helvetica" style={{ marginBottom: '0.5rem' }}>.font-helvetica - Helvetica font family</p>
          <p className="font-source-code" style={{ marginBottom: '0.5rem' }}>.font-source-code - Source Code Pro font family</p>
        </div>
      </div>
    </div>
  );
} 