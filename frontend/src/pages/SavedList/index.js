import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Space, Table, Popconfirm, Input, Form } from 'antd'; // Import Input and Form
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foreignWord, setForeignWord] = useState(''); // Added state for foreignWord
  const userId = -1; // Dynamically manage this in a real application
  const navigate = useNavigate();

  useEffect(() => {
    fetchWords();
  }, []);

  var token = localStorage.getItem('token');

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/user/${token}/words`);
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

  const deleteWord = async (foreignId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${token}/words/${foreignId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Update state to reflect the deletion
      setWords(words.filter(word => word.foreign_id !== foreignId));
    } catch (error) {
      console.error("Delete error: ", error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(`http://localhost:5000/user/${token}/words`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ foreign_word: foreignWord }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        fetchWords(); // Refresh the list after adding
        setForeignWord(''); // Reset input field
    } catch (error) {
        console.error("Failed to add word:", error);
    }
};


  const columns = [
    {
      title: 'Foreign Word',
      dataIndex: 'foreign_word',
      key: 'foreign_word',
    },
    {
      title: 'English Translations',
      dataIndex: 'english_translations',
      key: 'english_translations',
      render: translations => translations.join(', '),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteWord(record.foreign_id)}>
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = words.map((word) => ({
    key: word.foreign_id,
    foreign_word: word.foreign_word,
    english_translations: word.english_translations,
    foreign_id: word.foreign_id,
  }));

  return (
    <Row>
      <Col span={24}>
        <Card title="Your Saved Words">
          {/* Add Word Form */}
          <Form layout="inline" onSubmitCapture={handleSubmit}>
            <Form.Item>
              <Input placeholder="Type a foreign word" value={foreignWord} onChange={e => setForeignWord(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Add New Word</Button>
            </Form.Item>
          </Form>
          <Table loading={loading} columns={columns} dataSource={dataSource} />
        </Card>
      </Col>
    </Row>
  );
}

export default SavedList;
