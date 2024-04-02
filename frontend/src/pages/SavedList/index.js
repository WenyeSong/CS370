import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Space, Table, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 7; // Consider replacing this with actual user ID logic or state


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
      
      console.log("Fetched words data:", data); // For debugging, consider removing for production
      
      setWords(data);
    } catch (error) {
      console.error("Fetch error: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async (wordId) => {
    console.log("Deleting word with ID:", wordId); // This line will print the ID to the console
  
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/words/${wordId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // If deletion was successful, remove the word from the state
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

// Assuming the `words` state is correctly structured and includes an `id` for each word
const dataSource = words.map((word, index) => ({
  key: word.id,  // Use the actual word id as the key for each row
  word: word.french_word,
  // Use a Set to ensure unique translations before joining them
  definition: [...new Set(word.english_translations)].join(', '),
  id: word.id,  // Ensure this matches the property name used in the backend response
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
      onWordAdded(); // Callback to refresh the word list in the parent component
    } catch (error) {
      console.error("Failed to add word:", error);
    }
  };

  return (
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
  );
}


export default SavedList;
