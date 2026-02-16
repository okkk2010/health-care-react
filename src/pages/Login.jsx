import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Login = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <div>
                <p><label htmlFor='email'>Email</label></p>
                <p><input id = 'email' type = 'text' placeholder='email' /></p>
                </div>
                
                <div>
                <p><label htmlFor='password'>Password</label></p>
                <p><input id = 'password' type = 'password' placeholder='password' /></p>
                </div>

                <button type='submit'>Login</button>
            </form>
            <br/>
            <p><Link to = '/ForgotPassword'>비밀번호 찾기</Link> / <Link to = '/SignUp'>회원가입</Link></p>
        </div>
    )
}

export default Login;