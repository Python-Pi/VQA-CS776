import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-simple">
        <p>&copy; {new Date().getFullYear()} Medical VQA System | All rights reserved</p>
      </div>
    </footer>
  );
}

export default Footer;