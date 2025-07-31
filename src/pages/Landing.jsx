import React from 'react';

const Landing = () => {
  return (
    <div style={landingStyle}>
      <h2 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0', color: '#7B3F00' }}>
        Baked with Love, Delivered with Care
      </h2>
      <p style={{ fontSize: '1.3rem' }}>
        Discover our collection of artisanal breads, decadent pastries, and custom cakes.
      </p>
    </div>
  );
};

const landingStyle = {
  textAlign: 'center',
  padding: '6rem 1rem',
  color: '#3D2B1F'
}

export default Landing;