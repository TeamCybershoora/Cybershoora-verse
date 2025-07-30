export default function NotFound() {
  return (
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
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#9747ff' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center' }}>
        The page you're looking for doesn't exist.
      </p>
      <a 
        href="/"
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#9747ff',
          color: '#ffffff',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '1.1rem',
          fontWeight: 'bold'
        }}
      >
        Go Back Home
      </a>
    </div>
  );
} 