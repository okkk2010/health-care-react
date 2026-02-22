import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import DoctorCard from '../../components/DoctorCard';

const MedicalAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await apiService.getDoctorsAll();
                setDoctors(res.data.data ?? []);
            } catch (e) {
                console.error('의사 목록 조회 실패:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <main className='min-h-screen bg-[#eef2f7] px-4 pb-8 pt-28'>
            <section className='mx-auto w-full max-w-4xl'>
                <h1 className='text-2xl font-bold text-slate-900'>의사 목록</h1>
                <div className='mt-4'>
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default MedicalAppointment;
