import { Link } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { apiService } from '../services/api';

const DoctorCard = ({ doctor }) => {
    const [specialty, setSpecialty] = useState('');

    useEffect(() => {
        const fetchSpecialty = async () => {
            if (!doctor?.specialtyCode) {
                setSpecialty('-');
                return;
            }

            try {
                const res = await apiService.getSpecialtyByCode(doctor.specialtyCode);
                setSpecialty(res.data.data ?? '-');
            } catch (e) {
                console.error('전공 정보 조회 실패:', e);
                setSpecialty('-');
            }
        };

        fetchSpecialty();
    }, [doctor?.specialtyCode]);

    const appointmentDoctor = useMemo(
        () => ({
            id: doctor?.id ?? '',
            name: doctor?.name ?? '',
            email: doctor?.email ?? '',
            specialty,
        }),
        [doctor?.id, doctor?.name, doctor?.email, specialty]
    );

    return (
        <article className='mb-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-start gap-4'>
                    <div className='h-35 w-25 flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50' />

                    <div className='grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-2'>
                        <span className='text-sm font-medium text-slate-600'>이름</span>
                        <div className='min-w-[120px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800'>
                            {doctor?.name ?? '-'}
                        </div>

                        <span className='text-sm font-medium text-slate-600'>Email</span>
                        <div className='min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800'>
                            {doctor?.email ?? '-'}
                        </div>
                    </div>

                    <div className='grid grid-cols-[auto,1fr] items-center gap-x-3 gap-y-2'>
                        <span className='text-sm font-medium text-slate-600'>전공</span>
                        <div className='min-w-[220px] rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800'>
                            {specialty}
                        </div>
                    </div>
                </div>

                <Link
                    to='/MedicalAppointment/Appointment'
                    state={{ doctor: appointmentDoctor }}
                    className='inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700'
                >
                    예약하기
                </Link>
            </div>
        </article>
    );
};

export default DoctorCard;
