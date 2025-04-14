import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>ImageProcessor</h3>
          <p>Easy image processing solution for all your needs. Upload, process, and download in seconds.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: info@imageprocessor.com</p>
          <p>Phone: +1 (123) 456-7890</p>
          <div className="social-icons">
            <a href="#" className="social-icon">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fa fa-instagram"></i>
            </a>
            <a href="#" className="social-icon">
              <i className="fa fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ImageProcessor. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;