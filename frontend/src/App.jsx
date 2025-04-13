import { useState } from 'react';
import axios from 'axios';

function App() {
  const [code, setCode] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [language, setLanguage] = useState('python');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setImage(null);

    console.log('====================');
    console.log('Submit Button Clicked');
    console.log('Selected Language:', language);
    console.log('Code Provided:', code);
    console.log('====================');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';
      console.log('Backend URL:', backendUrl);

      console.log('Sending API Request to Backend...');
      const res = await axios.post(`${backendUrl}/execute`, { code, language });
      console.log('Backend Response Received:', res.data);

      if (res.data.image) {
        const finalImageUrl = `${backendUrl}${res.data.image}`;
        console.log('Constructed Image URL:', finalImageUrl);

        setImage(finalImageUrl);
        setSuccess('Chart generated successfully!');
        console.log('Chart generation successful!');
      } else {
        console.warn('Backend Response does not have Image URL');
        setError('Output image not found in backend response');
      }
    } catch (err) {
      console.error('API Request Failed!', err);
      console.error('Error Details from Backend:', err?.response?.data);
      setError(err?.response?.data?.error || 'Something went wrong while executing your code');
    }

    console.log('====================');
    console.log('Process Completed');
    console.log('====================');
  };

  const getReadmeText = () => {
    if (language === 'python') {
      return `
Python Guidelines:
- Use matplotlib or plotly.
- Save output using:
    plt.savefig('/app/output/visualization.png')
- For 3D plots: Use mpl_toolkits.
- For static/interactive: Remove plt.show() (optional).
- File must be saved at: /app/output/visualization.png
`;
    } else if (language === 'r') {
      return `
R Guidelines:
- Use ggplot2, plot3D, or base R.
- Save plots using:
    png('/app/output/visualization.png')
    # your plot code
    dev.off()
- 3D plots: Use plot3D.
- Output path is fixed: /app/output/visualization.png
`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      background: 'linear-gradient(to right, #74ebd5, #ACB6E5)',
      padding: '40px 0',
      fontFamily: 'Arial'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '40px',
        color: '#333',
        fontSize: '3rem'
      }}>
        Code → Chart Magic!
      </h1>

      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
          width: '60%',
          minWidth: '800px'
        }}>
          <label style={{ fontWeight: 'bold' }}>Select Language: </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '5px', marginBottom: '10px', marginLeft: '10px' }}
          >
            <option value="python">Python</option>
            <option value="r">R</option>
          </select>

          <pre style={{
            backgroundColor: '#f4f4f4',
            padding: '15px',
            borderRadius: '5px',
            marginTop: '10px',
            whiteSpace: 'pre-wrap',
            color: '#333',
            fontSize: '0.85rem'
          }}>
            {getReadmeText()}
          </pre>

          <textarea
            rows="15"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              resize: 'vertical'
            }}
          />

          <br /><br />

          <button onClick={handleSubmit} style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}>
            Generate Chart
          </button>

          <br /><br />

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}

          {image && (
            <div style={{ marginTop: '40px', textAlign: 'center' }}>
              <h3>Output Visualization:</h3>
              <img
                src={image}
                alt="Chart Output"
                style={{ maxWidth: '100%', borderRadius: '10px', border: '3px solid #ccc' }}
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                  setError('Image failed to load from backend. Check URL and backend server.');
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;