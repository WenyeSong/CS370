import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Input, Form, Table, Popconfirm, Space, Tabs, notification } from 'antd';
import { useNavigate } from "react-router-dom";
import { autocomplete } from '../SearchBar/AutocompleteFunctions';
import SearchBar from '../SearchBar/index.js'



function SavedList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [foreignWord, setForeignWord] = useState('');
  const [englishTranslation, setEnglishTranslation] = useState(''); // For user contributions
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);  // 10 words each page
  const [total, setTotal] = useState(0); // new state
  const navigate = useNavigate();
  
  // Define goBackToMainPage function
  const goBackToMainPage = () => {
  navigate('/'); // Navigate to the main page
  };

  useEffect(() => {
    fetchWords(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const token = localStorage.getItem('token');

  const fetchWords = async (pageNum = currentPage, pageSizeParam = pageSize) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/user/${token}/words?page=${pageNum}&size=${pageSizeParam}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
  
      // Check if data is an array and sort it by 'foreign_word'
      if (Array.isArray(data)) {
        const sortedWords = data.sort((a, b) => {
          return a.foreign_word.localeCompare(b.foreign_word, undefined, {sensitivity: 'base'});
        });
        setWords(sortedWords);
      } else {
        // If no words are returned or the structure is not as expected
        console.error('Expected an array of words, but received:', data);
        setWords([]);
      }
      
      setTotal(data.length || 0);  // Assuming 'data' array length as total, adjust if actual 'total' is provided differently
      setCurrentPage(pageNum);
      setPageSize(pageSizeParam);
    } catch (error) {
      console.error("Fetch error:", error.message);
      setWords([]);  // Reset words state in case of an error
    } finally {
      setLoading(false);
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
          <Popconfirm 
            title="Sure to delete?" 
            onConfirm={() => deleteWord(record)} 
            okButtonProps={{ style: { height: '27px', width: 'auto', padding: '0px 9px' } }} // OK button
            >
            <Button 
            style={{ width: '80px', height:'30px', lineHeight: '30px', textAlign: 'center', padding: 0 }}
            type="primary" 
            danger>
              Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  

  const handleTableChange = (pagination) => { // when page changes call this
    fetchWords(pagination.current, pagination.pageSize);
  };

  const tabItems = [
    {
      label: 'French',
      key: '1',
      children: (
        <Table 
          loading={loading}
          columns={columns}
          dataSource={words.filter(word => word.language_id === 1)}
          pagination={{ current: currentPage, pageSize: pageSize, total: total }}
          onChange={handleTableChange}
        />
      )
    },
    {
      label: 'Spanish',
      key: '3',
      children: (
        <Table 
          loading={loading}
          columns={columns}
          dataSource={words.filter(word => word.language_id === 3)}
          pagination={{ current: currentPage, pageSize: pageSize, total: total }}
          onChange={handleTableChange}
        />
      )
    },
    {
      label: 'Dutch',
      key: '4',
      children: (
        <Table 
          loading={loading}
          columns={columns}
          dataSource={words.filter(word => word.language_id === 4)}
          pagination={{ current: currentPage, pageSize: pageSize, total: total }}
          onChange={handleTableChange}
        />
      )
    }
  ];


  const deleteWord = async (record) => {
    console.log("Deleting word with record:", record);
  
    // Ensure the correct identification of the record based on its type
    let endpoint;
    if (record.type === 'dictionary') {
      // Use foreign_id for dictionary words
      endpoint = `http://localhost:5000/user/${token}/words/${record.foreign_id}`; 
    } else if (record.type === 'contribution') {
      // Use id for user contributions
      endpoint = `http://localhost:5000/user/${token}/contributions/${record.foreign_id}`;
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
  
    if (!foreignWord) {
      notification.error({
        message: 'Missing Input',
        description: 'Please enter a foreign word.',
        duration: 4,
      });
      return;
    }
  
    try {
      const payload = {
        foreign_word: foreignWord,
        english_translation: englishTranslation  // It's okay to send an empty string if no translation is provided
      };
      const response = await fetch(`http://localhost:5000/user/${token}/words`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, Message: ${errorData.error || errorData.message}`);
      }
      
      const responseData = await response.json();
      notification.success({
        message: 'Success',
        description: responseData.message,
        duration: 4,
      });
      
      fetchWords(); // Refresh list
      setForeignWord(''); // Reset fields
      setEnglishTranslation('');
    } catch (error) {
      console.error("Failed to add word:", error.message);
      notification.error({
        message: 'Error Submitting Word',
        description: `An error occurred: ${error.message}`,
        duration: 4,
      });
    }
  };




  const dataSource = words.map(word => ({
    key: word.type === 'contribution' ? `contribution-${word.foreign_id}` : `dictionary-${word.foreign_id}`,
    ...word,
    id: word.id, // Ensure this exists for contributions
    foreign_id: word.foreign_id // Ensure this exists for dictionary words
  }));





  return (
    <>
    <Row>
      <Col span={24}>
        <Card title="Your Saved Words" className="page_container" style={{ maxWidth: '70%', maxheight: '70%', margin: '20px auto', padding: '0 20px' }}>
          <Form layout="inline" onSubmitCapture={handleSubmit} autoComplete="off" action="/action_page.php">
            <Form.Item>
              <SearchBar id = "myInput" placeholder="Type a foreign word" value={foreignWord} onChange={e => setForeignWord(e.target.value)} />            
            </Form.Item>
            {/* <Form.Item>
              <Input id = "myInput" placeholder="Type a foreign word" value={foreignWord} onChange={e => setForeignWord(e.target.value)} />
            </Form.Item> */}
            <Form.Item>
              <Input placeholder="English Translation" value={englishTranslation} onChange={e => setEnglishTranslation(e.target.value)} />
            </Form.Item>
            <Form.Item style={{ display: 'flex', alignItems: 'start' }}>
            <Button 
                type="primary" htmlType="submit"
                style={{ width: '170px', height: '40px', lineHeight: '40px', // Ensure that this is the same as your height for vertical center
                textAlign: 'center', // For horizontal center
                padding: '0', // Removing padding can help in centering the text
                justifyContent: 'center', marginTop: '-5px'
              }}
            >Add New Word    
              </Button>
            </Form.Item>
          </Form>
          <Table loading={loading} columns={columns} dataSource={dataSource} // do i still need table here?
            pagination={{ 
              current: currentPage, 
              pageSize: pageSize, 
              total: total 
            }}
          onChange={handleTableChange} />
          <Tabs defaultActiveKey="1" items={tabItems} /> {/* This line adds the tabs to your UI */}
        </Card>
      </Col>
  
   </Row> 
    <div className="link-btn-container">
      <button className="link-btn" onClick={goBackToMainPage}
      >Back to Main Page</button>
    </div>
    </>
  );
}

export default SavedList;

