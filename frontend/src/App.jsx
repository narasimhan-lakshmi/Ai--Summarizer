// SummarizerComponent.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSummarize = async () => {
    try {
      setLoading(true); // Set loading to true when summarization starts

      const result = await axios.post('http://localhost:5000/api/summarize', {
        inputs: inputText,
        parameters: {
          max_length: 100,
          min_length: 30,
        },
      });

      setSummary(result.data);
    } catch (error) {
      console.error('Error summarizing text:', error);
    } finally {
      setLoading(false); // Set loading to false when summarization is complete (success or error)
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
      <button className="summarize-button" onClick={handleSummarize}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {summary && (
        <div className="summary-container">
          <h2 className="summary-header">Summary:</h2>
          <p className="summary-text">{summary}</p>
        </div>
      )}
    </div>
  );
};

export default App;
