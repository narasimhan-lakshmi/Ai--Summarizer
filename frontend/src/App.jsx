import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const SummarizerComponent = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSummarize = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await axios.post('http://localhost:5000/api/summarize', {
        text: inputText,
      });

      setSummary(result.data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
      setError('An error occurred while summarizing the text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <textarea
        className="text-input"
        placeholder="Enter text to summarize"
        value={inputText}
        onChange={handleInputChange}
      />
      <button className="summarize-button" onClick={handleSummarize} disabled={loading}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {summary && (
        <div className="summary-container">
          <h2 className="summary-header">Summary:</h2>
          <p className="summary-text">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default SummarizerComponent;
