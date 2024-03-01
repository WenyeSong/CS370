import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Popconfirm,
} from 'antd';
import './index.css';

function SavedList() {
  // State for storing the words list
  const [words, setWords] = useState([]);

  // Function to fetch words from the backend
  const fetchWords = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/words');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.log("Fetch error: " + error.message);
    }
  };

  // Use useEffect to fetch words when the component mounts
  useEffect(() => {
    fetchWords();
  }, []);

  const deleteWord = async (index) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/words/${index}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Fetch the updated words list after deletion
      fetchWords();
    } catch (error) {
      console.log("Delete error: " + error.message);
    }
  };
  

  // Define your table columns
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
      // Correctly use the render method's arguments
      render: (text, record, index) => (
        <Space size="middle">
          <Button type="primary">Edit</Button>
          <Popconfirm title="Sure to delete?" okText="Yes" cancelText="No" onConfirm={() => deleteWord(index)}>
            <Button type="primary" danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  

  return (
    <div>
      <Row>
        <Col span={24}>
          <Card
            title="Saved List"
            extra={<Button type="primary">Add New</Button>}>
            <Table
              pagination={{ pageSize: 5 }}
              columns={columns}
              dataSource={words}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SavedList;

