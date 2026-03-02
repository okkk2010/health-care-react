import DoctorAppointmentCard from '../../components/DoctorAppointmentCard';
import { apiService } from '../../services/api';
import { useState, useEffect } from 'react';
import storageService from '../../services/storage';

const CurrentAppointment = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchDoctorAppointments = async () => {
            try {
                const email = storageService.getEmail();
                const response = await apiService.doctorAppointment(email);
                if (response.status === 200) {
                    const normalized = (response.data.data ?? []).map((appointment) => ({
                        ...appointment,
                        appointmentCode: appointment.appointmentCode,
                    }));
                    setAppointments(normalized);
                }
            } catch (error) {
                console.error('의사 예약 조회 실패:', error);
            }
        };

        fetchDoctorAppointments();
    }, []);

    return (
        <main className='min-h-screen bg-[#eef2f7] px-4 pb-8 pt-28'>
            <section className='mx-auto w-full max-w-4xl'>
                <h1 className='text-2xl font-bold text-slate-900'>현재 예약</h1>
                <div className='mt-4'>
                    {appointments.map((appointment) => (
                        <DoctorAppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default CurrentAppointment;
