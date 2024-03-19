import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { message } from 'antd';


const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

  // 处理提交表单，swy改了这个handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 发送 POST 请求到后端的注册接口
      const response = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password: pass,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        // 注册成功, 可以重定向到登录页面或主页，待添加
        navigate('/');
      } else {
        // 注册失败，显示错误消息
        message.error(data.message || 'Registration failed');
      }
    } catch (error) {
      // 网络错误或服务器下线
      message.error('Network error or server is down');
    }
  };
    
    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input value={name} name="name" onChange={(e) => setName(e.target.value)} id="name" placeholder="full Name" />
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <label htmlFor="password">password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <button type="submit">Log In</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
    </div>
    )

}

export default Register 