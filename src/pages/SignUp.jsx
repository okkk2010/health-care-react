import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const roles = ['patient', 'doctor'];
const specialty = ['신경과', '외과', '소아과'];

const SignUp = () => {
    const [currentRole, setCurrentRole] = useState(roles[0]);
    const [currentSpecialty, setCurrentSpecialty] = useState('');

    const [form, setForm] = useState({
        email: '',
        name: '',
        password: ''
    })

    useEffect(() => {
        console.log(currentRole);
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (currentRole === 'doctor') {
            const payload = {
                email: form.email,
                name: form.name,
                password: form.password,
                specialty: currentSpecialty,
                role: currentRole
            }
            console.log(payload);
        } else {
            const payload = {
                email: form.email,
                name: form.name,
                password: form.password,
                role: currentRole
            }
            console.log(payload);
        }
    }

    return (
        <div>
            <h1>Sign Up</h1>
            <select value= {currentRole} onChange = {(e) => setCurrentRole(e.target.value)}>
                {roles.map((role) => {
                    return <option key = {role} value = {role}>{role}</option>
                })}
            </select>
            <form >
                <div>
                    <p><label htmlFor='email'>email</label></p>
                    <p><input id = 'email' type = 'text' placeholder='email' value={form.email} onChange={handleChange} name='email'/></p>
                    <p><label htmlFor='name'>name</label></p>
                    <p><input id = 'name' type = 'text' placeholder='name' value={form.name} onChange={handleChange} name='name'/></p>
                    <p><label htmlFor='password'>password</label></p>
                    <p><input id = 'password' type = 'password' placeholder='password' value={form.password} onChange={handleChange} name='password'/></p>
                    { currentRole === 'doctor' &&
                        <select value={currentSpecialty} onChange={(e) => setCurrentSpecialty(e.target.value)}>
                            {specialty.map((exp) => {
                                return <option key={exp} value={exp}>{exp}</option>
                            })}
                        </select>
                    }
                </div>
                <br/>
                <button type='submit' onClick={handleSubmit}>Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp;