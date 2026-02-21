import { Link } from 'react-router-dom';

const AppointmentCard = ({ appointment }) => {
    const doctorName = appointment?.doctorName ?? '-';
    const doctorSpecialty = appointment?.doctorSpecialty ?? '-';
    const title = appointment?.title ?? '-';
    const detail = appointment?.detail ?? '-';
    const appointmentTime = appointment?.appointmentTime ?? '-';
    const appointmentCode = appointment?.appointmentCode;
    const hasCode = Boolean(appointmentCode);

    return (
        <article className='mb-4 rounded-3xl border border-slate-200 bg-slate-100 p-4 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-1 flex-col gap-3 text-slate-900 md:flex-row md:gap-10'>
                    <div className='flex min-w-[180px] flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-semibold'>의사 이름</span>
                            <p className='text-base'>{doctorName}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-semibold'>진료과</span>
                            <p className='text-base'>{doctorSpecialty}</p>
                        </div>
                    </div>

                    <div className='flex min-w-[260px] flex-col gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-semibold'>진료명</span>
                            <p className='text-base'>{title}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-semibold'>진료 상세 내용</span>
                            <p className='text-base'>{detail}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-base font-semibold'>진료 날짜</span>
                            <p className='text-base'>{appointmentTime}</p>
                        </div>
                    </div>
                </div>

                {hasCode ? (
                    <Link
                        to={`/video/visitor/${appointmentCode}`}
                        className='inline-flex h-12 items-center justify-center rounded-md bg-slate-200 px-6 text-base font-medium text-slate-900 transition hover:bg-slate-300'
                    >
                        화상 회의 참여
                    </Link>
                ) : (
                    <button
                        type='button'
                        disabled
                        className='inline-flex h-12 cursor-not-allowed items-center justify-center rounded-md bg-slate-300 px-6 text-base font-medium text-slate-600'
                    >
                        코드 없음
                    </button>
                )}
            </div>
        </article>
    );
};

export default AppointmentCard;
