import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Input, Form, Table, Popconfirm, Space } from 'antd';

function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foreignWord, setForeignWord] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState(''); // For user contributions

  // Define goBackToMainPage function
  const goBackToMainPage = () => {
    navigate('/'); // Navigate to the main page
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const token = localStorage.getItem('token');

  const fetchWords = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/user/${token}/words`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.error("Fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteWord = async (record) => {
    console.log("Deleting word with record:", record);
  
    // Ensure the correct identification of the record based on its type
    let endpoint;
    if (record.type === 'dictionary') {
      // Use foreign_id for dictionary words
      endpoint = `http://localhost:5000/user/${token}/words/${record.foreign_id}`; 
    } else if (record.type === 'contribution') {
      // Use id for user contributions
      endpoint = `http://localhost:5000/user/${token}/contributions/${record.id}`;
    }
  
    console.log("Constructed endpoint URL:", endpoint);
  
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      await fetchWords(); // Refresh list after successful deletion
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };
  
  
  
  



  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { foreign_word: foreignWord, english_translation: englishTranslation };
      const response = await fetch(`http://localhost:5000/user/${token}/words`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchWords(); // Refresh list
      setForeignWord(''); // Reset fields
      setEnglishTranslation('');
    } catch (error) {
      console.error("Failed to add word:", error.message);
    }
  };

  const columns = [
    { title: 'Foreign Word', dataIndex: 'foreign_word', key: 'foreign_word' },
    {
      title: 'English Translations',
      dataIndex: 'english_translations',
      key: 'english_translations',
      render: translations => Array.isArray(translations) ? translations.join(", ") : translations, // Updated this line
    },
    {
      title: 'Action', 
      key: 'action', 
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm title="Sure to delete?" onConfirm={() => deleteWord(record)}>
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  

  const dataSource = words.map(word => ({
    key: word.type === 'contribution' ? `contribution-${word.id}` : `dictionary-${word.foreign_id}`,
    ...word,
    id: word.id, // Ensure this exists for contributions
    foreign_id: word.foreign_id // Ensure this exists for dictionary words
  }));
  
  
  
  

  return (
    <>
    <Row>
      <Col span={24}>
        <Card title="Your Saved Words">
          <Form layout="inline" onSubmitCapture={handleSubmit}>
            <Form.Item>
              <Input placeholder="Type a foreign word" value={foreignWord} onChange={e => setForeignWord(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Input placeholder="English Translation" value={englishTranslation} onChange={e => setEnglishTranslation(e.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Add New Word</Button>
            </Form.Item>
          </Form>
          <Table loading={loading} columns={columns} dataSource={dataSource} />
        </Card>
      </Col>
    </Row>  <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
    </>
  );
}

export default SavedList;
