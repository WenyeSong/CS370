import { Form, Input, Button, Checkbox } from "antd"
import { Card } from 'antd'
import './index.css'
import { useNavigate } from "react-router-dom"
import { message } from 'antd'

function Login () {
  const navigate = useNavigate()
  const onFinish = async values => {
  }

  const goBackToMainPage = () => {
    navigate('/');
  };
  var token = localStorage.getItem('token');
  return (
    //create the error page
    <div className="Error">
      <h1>
      </h1>
      How did you even get here -(0 o 0）-？{token}
      <br />
      <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
    </div>
  )
}
export default Login