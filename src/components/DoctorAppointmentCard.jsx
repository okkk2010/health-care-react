const DoctorAppointmentCard = ({ appointment }) => {
    const name = appointment?.patientName ?? appointment?.name ?? appointment?.doctorName ?? '-';
    const purpose = appointment?.title ?? appointment?.purpose ?? appointment?.detail ?? '-';
    const appointmentDate = appointment?.appointmentTime ?? appointment?.appointmentDate ?? '-';
    const createRoomLink = appointment?.meetingLink ?? '#';

    return (
        <article className='mb-4 rounded-3xl border border-slate-200 bg-slate-100 p-4 shadow-sm'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                <div className='flex flex-1 items-start gap-4'>
                    <div className='h-20 w-20 flex-shrink-0 rounded-md bg-slate-300' />

                    <div className='grid flex-1 grid-cols-[auto,1fr] items-center gap-x-4 gap-y-2 text-slate-900'>
                        <span className='text-xl font-medium'>이름</span>
                        <div className='rounded-sm bg-slate-300 px-3 py-1 text-xl'>{name}</div>

                        <span className='text-xl font-medium'>진료 목적</span>
                        <div className='rounded-sm bg-slate-300 px-3 py-1 text-xl'>{purpose}</div>

                        <span className='text-xl font-medium'>진료 날짜</span>
                        <div className='rounded-sm bg-slate-300 px-3 py-1 text-xl'>{appointmentDate}</div>
                    </div>
                </div>

                <a
                    href={createRoomLink}
                    className='inline-flex h-12 items-center justify-center rounded-md bg-slate-300 px-6 text-xl font-medium text-slate-900 transition hover:bg-slate-400'
                >
                    화상 진료 방 만들기
                </a>
            </div>
        </article>
    );
};

export default DoctorAppointmentCard;
