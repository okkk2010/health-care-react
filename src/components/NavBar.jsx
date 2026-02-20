import { Link } from 'react-router-dom';
import storageService from '../services/storage';

const NavBar = ({ isLogin }) => {



    return (
        <section className='fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm'>
            <div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6'>
                <Link to='/' className='flex items-center gap-3'>
                    <span className='grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-xl font-semibold text-white shadow-lg shadow-blue-200'>
                        +
                    </span>
                    <span className='text-xl font-extrabold tracking-tight text-slate-800'>HEALTH SYNC</span>
                </Link>

                {
                    isLogin && (
                        localStorage.getItem('role') === '의사' && (
                            <>
                                <Link to='/CheckAppointments' className='px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'>
                                    예약 확인
                                </Link>
                                <Link to='/CurrentAppointments' className='px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'>
                                    현재 예약
                                </Link>
                            </>
                        ),

                        localStorage.getItem('role') === '환자' && (
                            <>
                                <Link to='/MedicalAppointment' className='px-4 py-2 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'>
                                    예약하기
                                </Link>
                                <Link to='/MyAppointments' className='px-4 py-2 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'>
                                    예약 확인
                                </Link>
                            </>
                        )
                    )
                }

                {
                    !isLogin ? (
                        <Link
                            to='/Login'
                            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
                        >
                            Login
                        </Link>
                    ) : (
                        <Link
                            to='/MyPage'
                            className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
                        >
                            {storageService.getName()}
                        </Link>
                    )
                }
            </div>
        </section>
    )
}

export default NavBar;
