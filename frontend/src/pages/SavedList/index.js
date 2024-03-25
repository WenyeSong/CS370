import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Row,
  Space,
  Table,
  Popconfirm,
  Select,
} from 'antd';
import './index.css';

const { Option } = Select;

function SavedList() {
  // State for storing the words list and the current directory
  const [words, setWords] = useState([]);
  const [directories, setDirectories] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState('');

  // Fetch directories
  const fetchDirectories = async () => {
    const dirs = ['English', 'French'];
    setDirectories(dirs);
    if(dirs.length > 0) {
      setCurrentDirectory(dirs[0]);
    }
  };

  // Function to fetch words from the backend based on the current directory
  const fetchWords = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/words?directory=${currentDirectory}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWords(data);
    } catch (error) {
      console.log("Fetch error: " + error.message);
    }
  };

  useEffect(() => {
    fetchDirectories();
  }, []);

  useEffect(() => {
    if(currentDirectory) {
      fetchWords();
    }
  }, [currentDirectory]);

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

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };  

  const columns = [
    {
      title: 'Word',
      dataIndex: 'word',
      key: 'word',
      sorter: (a, b) => a.word.localeCompare(b.word),
      sortDirections: ['ascend', 'descend', 'ascend'],
    
    },
    {
      title: 'Definition',
      dataIndex: 'definition',  
      key: 'definition',
    },
    {
      title: 'Action',
      key: 'action',
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
            extra={
              <Space>
                <Select defaultValue={currentDirectory} style={{ width: 120 }} onChange={setCurrentDirectory}>
                  {directories.map(dir => <Option key={dir} value={dir}>{dir}</Option>)}
                </Select>
                <Button type="primary">Add New</Button>
              </Space>
            }>
            <Table
              onChange={onChange}
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
