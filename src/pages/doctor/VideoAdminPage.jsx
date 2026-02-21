import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebRTCCall } from '../../hooks/useWebRTCCall';

const getStatusText = (state) => {
    if (state === 'waiting') return '상대 입장 대기 중';
    if (state === 'connecting') return '연결 중';
    if (state === 'connected') return '연결됨';
    if (state === 'error') return '오류';
    return '통화 준비 중';
};

const VideoAdminPage = () => {
    const { appointmentCode } = useParams();
    const navigate = useNavigate();

    const { callState, errorMessage, localStream, remoteStream, startCall, leaveCall } = useWebRTCCall({
        role: 'admin',
        appointmentCode,
    });

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        startCall();
        return () => {
            leaveCall();
        };
    }, [leaveCall, startCall]);

    useEffect(() => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const handleLeave = () => {
        leaveCall();
        navigate('/CurrentAppointments');
    };

    return (
        <main className='min-h-screen bg-[#eef2f7] px-4 pb-8 pt-24'>
            <section className='mx-auto w-full max-w-5xl'>
                <h1 className='text-2xl font-bold text-slate-900'>의사용 화상 진료</h1>
                <p className='mt-2 text-sm text-slate-600'>예약 코드: {appointmentCode ?? '-'}</p>

                <div className='mt-6 grid gap-4 md:grid-cols-2'>
                    <div className='rounded-2xl border border-slate-200 bg-black p-2'>
                        <video ref={remoteVideoRef} autoPlay playsInline className='h-[320px] w-full rounded-xl object-cover' />
                    </div>

                    <div className='rounded-2xl border border-slate-200 bg-slate-900 p-2'>
                        <video ref={localVideoRef} autoPlay muted playsInline className='h-[320px] w-full rounded-xl object-cover' />
                    </div>
                </div>

                <div className='mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700'>
                    <p>상태: {getStatusText(callState)}</p>
                    {errorMessage && <p className='mt-2 text-red-600'>{errorMessage}</p>}
                </div>

                <button
                    type='button'
                    onClick={handleLeave}
                    className='mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-slate-800 px-6 text-sm font-semibold text-white transition hover:bg-slate-700'
                >
                    통화 종료
                </button>
            </section>
        </main>
    );
};

export default VideoAdminPage;
