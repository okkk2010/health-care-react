import AppointmentCard from '../../components/AppointmentCard';
import { apiService } from '../../services/api';
import { useState, useEffect } from 'react';
import storageService from '../../services/storage';


const MyAppointment = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchMyAppointments = async () => {
            try {
                const email = storageService.getEmail();
                const response = await apiService.myAppointment(email);
                if (response.status === 200) {
                    setAppointments(response.data.data);
                }
            } catch (error) {
                console.error("나의 예약 조회 실패:", error);
            }
        }
        fetchMyAppointments();
    }, []);


    return (
        <main className='min-h-screen bg-[#eef2f7] px-4 pb-8 pt-28'>
            <section className='mx-auto w-full max-w-4xl'>
                <h1 className='text-2xl font-bold text-slate-900'>나의 예약</h1>
                <div className='mt-4'>
                    {appointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default MyAppointment;
