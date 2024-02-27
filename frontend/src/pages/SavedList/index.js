import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Popconfirm,
} from 'antd'
import React from 'react'
import './index.css'

function SavedList() {
  return (
    <div>
      <Row>
        <Col span={24}>
          <Card
            title="Saved List"
            extra={<Button type="primary">Add New</Button>}>
            <Table
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: '',
                  dataIndex: 'word',
                  key: 'word',
                },
                {
                  title: 'definition',
                  dataIndex: 'definition',
                  key: 'definition',
                },
                {
                  title: '',
                  key: 'action',
                  render: (text: string, record: any) => (
                    <Space size="middle">
                      <Button type="primary">Edit</Button>
                      <Popconfirm
                        title="Sure to delete?"
                        okText="Yes"
                        cancelText="No">
                        <Button type="primary" danger>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
              dataSource={[
                {
                  key: '1',
                  word: 'meticulous',
                  definition:
                    'Showing great attention to detail; very careful and precise.',
                },
                {
                  word: 'vivacious',
                  definition: 'Attractively lively and animated.',
                },
                {
                  word: 'obstinate',
                  definition:
                    'Stubbornly refusing to change opinion or chosen course of action.',
                },
                {
                  word: 'pensive',
                  definition:
                    'Engaged in, involving, or reflecting deep or serious thought.',
                },
                {
                  word: 'cognizant',
                  definition: 'Having knowledge or being aware of.',
                },
                {
                  word: 'diligent',
                  definition:
                    'Having or showing care and conscientiousness in one’s work or duties.',
                },
                {
                  word: 'resilient',
                  definition:
                    'Able to withstand or recover quickly from difficult conditions.',
                },
                {
                  word: 'altruistic',
                  definition:
                    'Showing a disinterested and selfless concern for the well-being of others; unselfish.',
                },
                {
                  word: 'intrepid',
                  definition:
                    'Fearless; adventurous (often used for rhetorical or humorous effect).',
                },
                {
                  word: 'magnanimous',
                  definition:
                    'Very generous or forgiving, especially toward a rival or someone less powerful than oneself.',
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SavedList
