import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { apiService } from '../services/api';
import storageService from '../services/storage';

const Login = ( { setIsLogin } ) => {

    const navigate = useNavigate();

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
        const response = await apiService.login(payload);
        if (response.status === 200) {
            alert('Login success');
            const { email, name, roleCode } = response.data.data;
            const roleResponse = await apiService.getRoleByCode(roleCode);
            storageService.login(email, name, roleResponse?.data.data);
            setIsLogin(true);
            navigate('/');
        } else {
            alert(response.data.message);
        }
    }

    return (
        <main className='min-h-screen bg-[#eef2f7] px-4 pb-8 pt-28'>
            <section className='mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-sm'>
                <h1 className='mb-2 text-3xl font-bold text-slate-900'>Welcome back</h1>
                <p className='mb-8 text-sm text-slate-500'>Sign in to continue your healthcare dashboard.</p>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div className='space-y-2'>
                        <label htmlFor='email' className='block text-sm font-medium text-slate-600'>Email</label>
                        <input
                            id='email'
                            type='text'
                            placeholder='you@example.com'
                            value={form.email}
                            onChange={handleChange}
                            name='email'
                            className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'
                        />
                    </div>

                    <div className='space-y-2'>
                        <label htmlFor='password' className='block text-sm font-medium text-slate-600'>Password</label>
                        <input
                            id='password'
                            type='password'
                            placeholder='********'
                            value={form.password}
                            onChange={handleChange}
                            name='password'
                            className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'
                        />
                    </div>

                    <button
                        type='submit'
                        className='w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-500'
                    >
                        Login
                    </button>
                </form>

                <p className='mt-6 text-center text-sm text-slate-500'>
                    <Link to='/ForgotPassword' className='text-blue-600 hover:text-blue-500'>Forgot password</Link>
                    {' / '}
                    <Link to='/Register' className='text-blue-600 hover:text-blue-500'>Create account</Link>
                </p>
            </section>
        </main>
    )
}

export default Login;
