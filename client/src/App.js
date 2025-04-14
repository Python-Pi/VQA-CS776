import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ImageUpload from './components/ImageUpload';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <h1>Image Upload</h1>
        <p>Drop your image below and click submit</p>
        <ImageUpload />
      </main>
      <Footer />
    </div>
  );
}

export default App;