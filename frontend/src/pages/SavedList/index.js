import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Space, Table, Popconfirm } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './index.css'; // Import your CSS file

function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 7; // Consider replacing this with actual user ID logic or state
  const navigate = useNavigate(); // Initialize useNavigate
  
  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/words`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error("Fetch error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async (wordId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/words/${wordId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setWords(words.filter(word => word.id !== wordId));
    } catch (error) {
      console.error("Delete error: ", error.message);
    }
  };
  
  const columns = [
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteWord(record.id)}>
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = words.map((word, index) => ({
    key: word.id,
    word: word.french_word,
    definition: [...new Set(word.english_translations)].join(', '),
    id: word.id,
  }));

  return (
    <Row>
      <Col span={24}>
        <Card
          title="Saved List"
          extra={
            <Space>
              <Link to="/flashcards">
                <Button type="primary">Go to Flashcard Page</Button>
              </Link>
            </Space>
          }
        >
          <AddWordForm userId={userId} onWordAdded={fetchWords} />
          <Table
            loading={loading}
            columns={columns}
            dataSource={dataSource}
          />
        </Card>
      </Col>
    </Row>
  );
}

function AddWordForm({ userId, onWordAdded }) {
  const [frenchTermId, setFrenchTermId] = useState('');
  const [masteryLevel, setMasteryLevel] = useState(1);
  const navigate = useNavigate(); // Initialize useNavigate
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/words`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ french_term_id: frenchTermId, mastery_level: masteryLevel }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      onWordAdded();
    } catch (error) {
      console.error("Failed to add word:", error);
    }
  };

  return (
    <div className="SavedList">
      <form onSubmit={handleSubmit}>
        <label>
          French Term ID:
          <input
            type="text"
            value={frenchTermId}
            onChange={(e) => setFrenchTermId(e.target.value)}
          />
        </label>
        <label>
          Mastery Level:
          <input
            type="number"
            value={masteryLevel}
            onChange={(e) => setMasteryLevel(e.target.value)}
          />
        </label>
        <button type="submit">Add Word</button>
      </form>
      <div className="bottomButtonContainer">
        <button className="link-btn" onClick={() => navigate('/')}>Back to Main Page</button>
      </div>
    </div>
  );
}


export default SavedList;
