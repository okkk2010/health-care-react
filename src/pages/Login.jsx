import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import { apiService } from '../services/api';

const Login = () => {
    const [form, setForm] = useState({
    email: '',
    password: ''
    });
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            email: form.email,
            password: form.password
        }
        console.log(payload);
        const response = await apiService.login(payload);
        if (response.status === 200) {
            alert('로그인 성공');
        } else {
            alert(response.data.message);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form>
                <div>
                <p><label htmlFor='email'>Email</label></p>
                <p><input id = 'email' type = 'text' placeholder='email' value={form.email} onChange={handleChange} name='email'/></p>
                </div>
                
                <div>
                <p><label htmlFor='password'>Password</label></p>
                <p><input id = 'password' type = 'password' placeholder='password' value={form.password} onChange={handleChange} name='password'/></p>
                </div>

                <button type='submit' onClick={handleSubmit}>Login</button>
            </form>
            <br/>
            <p><Link to = '/ForgotPassword'>비밀번호 찾기</Link> / <Link to = '/Register'>회원가입</Link></p>
        </div>
    )
}

export default Login;