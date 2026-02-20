import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import storageService from '../services/storage';
import { apiService } from '../services/api'; 

const Appointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const doctor = location.state?.doctor;

    const [appointmentForm, setAppointmentForm] = useState({
        doctorEmail: doctor?.email || '',
        patientEmail: storageService.getEmail() || '',
        appointmentTime: '',
        title: '',
        detail: ''
    });

    const submitAppointment = async () => {
        try {
            const payload = {
                doctorEmail: appointmentForm.doctorEmail,
                patientEmail: appointmentForm.patientEmail,
                appointmentTime: appointmentForm.appointmentTime+":00+09:00",
                title: appointmentForm.title,
                detail: appointmentForm.detail
            }
            const response = await apiService.bookAppointment(payload);
            if(response.status === 200) {
                alert("예약이 성공적으로 완료되었습니다.");

                navigate('/'); // 예약 성공 후 홈으로 이동
            }
        } catch (error) {
            console.error("예약 실패:", error);
        }
    }

    return (
        <div className='mx-auto max-w-4xl pt-28'>
            <h1 className='text-2xl font-bold'>예약 페이지</h1>

            <div className='mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5'>
                <label className='block text-sm font-medium text-slate-700'>의사 정보</label>

                {doctor ? (
                    <div className='mt-2 space-y-1 text-sm text-slate-700'>
                        <p>이름: {doctor.name || '-'}</p>
                        <p>Email: {doctor.email || '-'}</p>
                        <p>전공: {doctor.specialty || '-'}</p>
                    </div>
                ) : (
                    <p className='mt-2 text-sm text-slate-500'>선택된 의사 정보가 없습니다.</p>
                )}

                <div>
                    <label>증상</label><p/>
                    <input 
                        type='text' 
                        placeholder='증상을 입력하세요'
                        value={appointmentForm.title}
                        onChange={(e) => setAppointmentForm({...appointmentForm, title: e.target.value})}
                    />
                </div>
                <div>
                    <label>세부 증상</label><p/>
                    <input 
                        type='text' 
                        placeholder='세부 증상을 입력하세요'
                        value={appointmentForm.detail}
                        onChange={(e) => setAppointmentForm({...appointmentForm, detail: e.target.value})}
                    />
                </div>
                <div>
                    <label>예약 날짜 시간</label><p/>
                    <input 
                        type='datetime-local' 
                        value={appointmentForm.appointmentTime}
                        onChange={(e) => setAppointmentForm({...appointmentForm, appointmentTime: e.target.value})}
                    />
                </div>
            </div>
            <button className='mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white'
                onClick={submitAppointment}
            >
                예약하기
            </button>
        </div>
    );
};

export default Appointment;
