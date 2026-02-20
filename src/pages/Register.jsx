import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';



const Register = () => {

    const [roles, setRoles] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(true);


    const [currentRole, setCurrentRole] = useState('');
    const [currentSpecialty, setCurrentSpecialty] = useState('');

    const [form, setForm] = useState({
        email: '',
        name: '',
        password: ''
    });

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const [rolesRes, specsRes] = await Promise.all([
                    apiService.getRolesAll(),
                    apiService.getSpecialtiesAll(),
                ]);

                const roleList = rolesRes.data.data ?? [];
                const specList = specsRes.data.data ?? [];

                setRoles(roleList);
                setSpecialties(specList);

                if (roleList.length > 0) {
                    setCurrentRole(roleList[0]);
                }
                if (specList.length > 0) {
                    setCurrentSpecialty(specList[0]);
                }
                console.log('珥덇린 ?곗씠??濡쒕뱶 ?깃났');
            } catch (e) {
                console.error('珥덇린 ?곗씠??濡쒕뱶 ?ㅽ뙣:', e);
            } finally {
                setLoading(false);
            }
        }

        fetchInitData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let response;

            const roleRes = await apiService.getRoleByName(currentRole);
            const roleCode = roleRes.data.data;

            if (currentRole === '?섏궗') {
                const specRes = await apiService.getSpecialtyByName(currentSpecialty);
                const specialtyData = specRes.data.data;

                const payload = {
                    email: form.email,
                    name: form.name,
                    password: form.password,
                    specialtyCode: specialtyData,
                    roleCode: roleCode
                }
                console.log(payload);
                response = await apiService.doctorRegister(payload);
            } else {
                const payload = {
                    email: form.email,
                    name: form.name,
                    password: form.password,
                    roleCode: roleCode
                }
                console.log(payload);
                response = await apiService.patientRegister(payload);
            }

            if (response.data?.statusCode === 201 || response.status === 201 || response.status === 200) {
                alert('?뚯썝媛???깃났');
                return;
            }

            alert(response.data?.message ?? '?붿껌 泥섎━ ?ㅽ뙣');
        } catch (error) {
            const status = error?.status ?? error?.statusCode ?? 500;
            const message = error?.message ?? '?붿껌 泥섎━ 以??ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.';
            alert(`[${status}] ${message}`);
            console.error('register error:', error);
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

                                {roles?.map((role) => {
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
                            { currentRole === '?섏궗' &&
                                <select value={currentSpecialty} onChange={(e) => setCurrentSpecialty(e.target.value)}>
                                    {specialties?.map((exp) => {
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
