import React from 'react';
import QRCode from 'qrcode.react'; // Assuming you have a QRCode library installed
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import watermark from "./img/unaab.jpeg"
import avatar from "./img/Avatart1.jpg";
const data = [
  {  username: "john_smith", score: 80 },
  {  username: "kevin_jones", score: 80 },
  {  username: "emily_parker", score: 80 },
  {  username: "michael_adams", score: 80 },
  {  username: "kelvin", score: 50 }
];

export const WatermarkTable = () => {
  return (
    <div style={{ position: 'relative' }}>
      {/* Watermark image */}
      <img src={watermark} alt="Watermark" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 0.1, // Adjust opacity as needed
        pointerEvents: 'none' // Prevent interaction with the watermark
      }} />

      {/* Table with Bootstrap styling */}
      <table className="table table-striped" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <caption>Results of Physics for Science Department</caption>
        <thead>
          <tr>
            <th>Image</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index}>
              <td>
                <img src={avatar} alt={entry.username} width="50" />
              </td>
              <td>{entry.username}</td>
              <td>{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* QR code image */}
      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
        <QRCode value="this is the original physics result" size={64} />
      </div>
    </div>
  );
};


