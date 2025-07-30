'use client';

export default function GlobalError({
  error,
  reset,
}) {
  return (
    <html>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0c0c0c',
          color: '#e9e9e9',
          fontFamily: 'Helvetica, sans-serif',
          padding: '2rem'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff4757' }}>Something went wrong!</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>
            An error occurred while loading this page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#9747ff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7a3acc'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#9747ff'}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
} 