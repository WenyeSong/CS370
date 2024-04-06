import { Form, Input, Button, Checkbox } from "antd"
import { Card } from 'antd'
import './index.scss'
// import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"
import { message } from 'antd'

// check backend status
async function checkBackendStatus() {
  try {
    const response = await fetch('http://127.0.0.1:5000/health');
    return response.ok;
  } catch (error) {
    console.error('Error when checking backend status:', error);
    return false;
  }
}

function Login () {

  // const { loginStore } = useStore()
  const navigate = useNavigate()
  const goBackToMainPage = () => {
    navigate('/');
};
  const onFinish = async values => {
    // const { mobile, code } = values
    // console.log(mobile, code)
    // try {
    //   await loginStore.login({ mobile, code })
    //   navigate('/')
    // } catch (e) {
    //   message.error(e.response?.data?.message || 'log in failed')
    // }
    
      // fisrt check whether the request can acheive backend
      const isBackendReachable = await checkBackendStatus();
      if (!isBackendReachable) {
        message.error('Cannot reach the backend service. Please try again later.');
        return;
      }


    try {
      const response = await fetch('http://127.0.0.1:5000/login', { // point to flask port, 5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.account,
          password: values.password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // 登录成功，可以将 token 保存在本地存储或状态管理库中
        // loginStore.setToken(data.token);
        localStorage.setItem('token', data['token']);
        console.log(localStorage.getItem['token']);
        message.success('Login is successful!');
        navigate('/'); 
      } else {
        // login fail, with message
        message.error(data.message || 'log in failed');
      }
    }
     catch (e) {
      message.error('Network error or server is down');
    } 
  }
  return (

    <div className="login">
      <h1>Login</h1>
      <Card title="" bordered={true}>
        <Form validateTrigger={['onBlur', 'onChange']}
          onFinish={onFinish} >
          <Form.Item name="account"
            rules={[
              // {
              //   pattern: /^1[3-9]\d{9}$/,
              //   message: 'wrong format',
              //   validateTrigger: 'onBlur'
              // },
              { required: true, message: "please Enter your account" }
            ]}>
            <Input size="large" placeholder="please Enter your account" />
          </Form.Item>
          <Form.Item name="password"
            rules={[
              { required: true, message: 'please Enter your password' }
            ]}>
            <Input size="large" placeholder="please Enter your password" />
          </Form.Item>
          <Form.Item>
            <Checkbox>I have already read the agreement and blah blah blah</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType='submit' size="large" >Login</Button>
          </Form.Item>
        </Form>
        <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
      </Card>
    </div>
  )
}
export default Login