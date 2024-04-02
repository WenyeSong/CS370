import React, { useState, useEffect } from 'react'; // Fix for 'useState' and 'useEffect' not defined
import { Button, Card, Col, Row, Space, Table, Popconfirm } from 'antd'; // Fix for Ant Design components not defined
import { Link } from 'react-router-dom'; // Ensures 'Link' is defined

function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 7; // Replace with actual user ID logic or state

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
          <Table
            loading={loading}
            columns={columns}
            dataSource={words.map((word, index) => ({
              key: index,
              word: word.french_word,
              definition: word.english_translations.join(', '),
              id: word.id,
            }))}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default SavedList;
