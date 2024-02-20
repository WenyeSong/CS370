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
    const { mobile, code } = values
    console.log(mobile, code)
    // try {
    //   await loginStore.login({ mobile, code })
    //   navigate('/')
    // } catch (e) {
    //   message.error(e.response?.data?.message || 'log in failed')
    // }
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
              { required: true, message: "please input your account" }
            ]}>
            <Input size="large" placeholder="please input your account" />
          </Form.Item>
          <Form.Item name="password"
            rules={[
              { required: true, message: 'please input your password' }
            ]}>
            <Input size="large" placeholder="please input your password" />
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