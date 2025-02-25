function Footer() {
  return (
    <footer style={{
      background: '#000080',
      color: '#FFFFFF',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    }}>
      <div style={columnStyle}>
        <h3 style={{ color: '#FFD700' }}>About Us</h3>
        <p style={{ color: '#C0C0C0', maxWidth: '200px' }}>
          DomainDiscoverer is your go-to resource for finding the best domaining tools and insights.
        </p>
      </div>
      <div style={columnStyle}>
        <h3 style={{ color: '#FFD700' }}>Explore</h3>
        <a href="/resources" style={linkStyle}>Resources</a>
        <a href="/blog" style={linkStyle}>Blog Posts</a>
        <a href="/advertise" style={linkStyle}>Advertisement</a>
        <a href="/contact" style={linkStyle}>Contact Us</a>
      </div>
      <div style={columnStyle}>
        <h3 style={{ color: '#FFD700' }}>Legal</h3>
        <a href="/privacy" style={linkStyle}>Privacy Policy</a>
        <a href="/terms" style={linkStyle}>Terms of Service</a>
      </div>
      <div style={columnStyle}>
        <h3 style={{ color: '#FFD700' }}>Follow Us</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <a href="https://facebook.com" target="_blank" style={socialLinkStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          <a href="https://x.com" target="_blank" style={socialLinkStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="https://whatsapp.com" target="_blank" style={socialLinkStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.89.52 3.67 1.42 5.21L2 22l4.8-1.42c1.54.89 3.32 1.42 5.2 1.42 5.52 0 10-4.48 10-10S17.52 2 12 2zm3.79 14.37c-.24.68-.76 1.14-1.43 1.29-.53.11-1.22.19-2.38-.38-1-.48-1.84-1.27-2.56-2.27-.72-1-.94-2.07-.87-3.23.06-.92.42-1.73 1.11-2.34.31-.27.73-.43 1.15-.47.36-.04.72-.01 1.04.03.34.04.76.17 1.15.51.48.42.91 1.03 1 1.71-.03.58-.31 1.14-.81 1.58-.11.1-.23.2-.34.3-.46.39-.92.79-.53 1.49.38.69 1.14 1.41 1.84 1.87.18.12.36.23.55.31z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}

const columnStyle = {
  flex: '1',
  minWidth: '200px',
  margin: '10px 0',
};

const linkStyle = {
  display: 'block',
  color: '#C0C0C0',
  textDecoration: 'none',
  margin: '5px 0',
  transition: 'color 0.3s',
};

const socialLinkStyle = {
  color: '#FFFFFF',
  textDecoration: 'none',
};

export default Footer;
