import { Form, Input, Button, Checkbox } from "antd"
import { Card } from 'antd'
import './index.scss'
// import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"
import { message } from 'antd'

function Login () {

  // const { loginStore } = useStore()
  const navigate = useNavigate()
  const onFinish = async values => {
    // const { mobile, code } = values
    // console.log(mobile, code)
    // try {
    //   await loginStore.login({ mobile, code })
    //   navigate('/')
    // } catch (e) {
    //   message.error(e.response?.data?.message || 'log in failed')
    // }
    

    //Wenye has changed this part
    try {
      const response = await fetch('/login', {
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
        navigate('/'); // 导航到其他页面，待添加
      } else {
        // 登录失败，显示错误消息
        message.error(data.message || 'log in failed');
      }
    } catch (e) {
      // 网络或其他错误，显示错误消息
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
      </Card>
    </div>
  )
}
export default Login