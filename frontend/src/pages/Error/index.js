import { Form, Input, Button, Checkbox } from "antd"
import { Card } from 'antd'
// import './index.scss'
// import { useStore } from "@/store"
import { useNavigate } from "react-router-dom"
import { message } from 'antd'

function Login () {
  const navigate = useNavigate()
  const onFinish = async values => {
  }
  return (
    //create the error page
    <div className="Error">
      this page is not found
      <br />
      <Button type="primary" size="large">return to main page</Button>
    </div>
  )
}
export default Login