import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Space, Table, Popconfirm } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = 7; // Dynamically manage this in a real application
  const navigate = useNavigate();
  
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

  const deleteWord = async (foreignId) => {
    try {
      const response = await fetch(`http://localhost:5000/user/${userId}/words/${foreignId}`, {
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
        <Card
          title="Your Saved Words"
          extra={
            <Space>
              <Link to="/add-word">
                <Button type="primary">Add New Word</Button>
              </Link>
            </Space>
          }
        >
          <Table loading={loading} columns={columns} dataSource={dataSource} />
        </Card>
      </Col>
    </Row>
  );
}

export default SavedList;
