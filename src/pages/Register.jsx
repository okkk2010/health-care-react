import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const roles = ['patient', 'doctor'];
const specialty = ['신경과', '외과', '소아과'];

const Register = () => {
    const [currentRole, setCurrentRole] = useState(roles[0]);
    const [currentSpecialty, setCurrentSpecialty] = useState('');

    const [form, setForm] = useState({
        email: '',
        name: '',
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
        
        let response;
        if (currentRole === 'doctor') {
            const payload = {
                email: form.email,
                name: form.name,
                password: form.password,
                specialty: currentSpecialty,
                role: currentRole
            }
            console.log(payload);
            response = await apiService.doctorRegister(payload);
        } else {
            const payload = {
                email: form.email,
                name: form.name,
                password: form.password,
                role: currentRole
            }
            console.log(payload);
            response = await apiService.patientRegister(payload);
        }

        if (response.status === 200) {
            alert('회원가입 성공');
        } else {
            alert(response.data.message);
        }
    }

    return (
        <main className = 'min-h-screen bg-[#eef2f7] px-4 pb-8 pt-28  '>
            <section className = 'shadow-sm mx-auto w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 '>
                <h1 className = 'pb-4 mb-2 text-3xl font-bold text-slate-900 '>Sign Up</h1>
                <section className =''>
                    <form onSubmit={handleSubmit} className='space-y-5'>
                        <div>
                            <p><label htmlFor='role'>Role</label></p>
                            <select value= {currentRole} onChange = {(e) => setCurrentRole(e.target.value)} 
                                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'>

                                {roles.map((role) => {
                                    return <option key = {role} value = {role}>{role}</option>
                                })}
                            </select>
                        </div>
                        <div>
                            <p><label htmlFor='email'>email</label></p>
                            <p><input id = 'email' type = 'text' placeholder='email' value={form.email} onChange={handleChange} name='email'
                                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'/></p>
                        </div>
                        <div>
                            <p><label htmlFor='name'>name</label></p>
                            <p><input id = 'name' type = 'text' placeholder='name' value={form.name} onChange={handleChange} name='name'
                                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'/></p>
                        </div>
                        <div>
                            <p><label htmlFor='password'>password</label></p>
                            <p><input id = 'password' type = 'password' placeholder='password' value={form.password} onChange={handleChange} name='password'
                                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white'/></p>
                        </div>
                        <div>
                            { currentRole === 'doctor' &&
                                <select value={currentSpecialty} onChange={(e) => setCurrentSpecialty(e.target.value)}>
                                    {specialty.map((exp) => {
                                        return <option key={exp} value={exp}>{exp}</option>
                                    })}
                                </select>
                            }
                        </div>
                        <button type='submit' className='border border-slate-500 px-4 py-2 mt-4 rounded-md bg-blue-600 text-white'>회원가입</button>
                    </form>
                </section>
            </section>
        </main>
    )
}

export default Register;