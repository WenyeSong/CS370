import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Space, Table, Tag, Typography, Popconfirm } from 'antd';
import './index.css';

function SavedList() {
  // State to store the data fetched from Flask
  const [dictFlask, setDictFlask] = useState([]);

  // Fetch data from Flask on component mount
  useEffect(() => {
    fetch('http://127.0.0.1:5000/words')
      .then((response) => response.json())
      .then((data) => {
        // Assuming the data is the array of objects you want to use as dataSource for the Table
        setDictFlask(data);
        console.log('Data from Flask: ', data);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div>
      <Row>
        <Col span={24}>
          <Card
            title="Saved List"
            extra={<Button type="primary">Add New</Button>}
          >
            <Table
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: '',
                  dataIndex: 'word',
                  key: 'word',
                },
                {
                  title: 'Definition',
                  dataIndex: 'definition',
                  key: 'definition',
                },
                {
                  title: '',
                  key: 'action',
                  render: (text, record) => (
                    <Space size="middle">
                      <Button type="primary">Edit</Button>
                      <Popconfirm
                        title="Sure to delete?"
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="primary" danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              dataSource={dictFlask} // Use state variable as dataSource
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SavedList;
