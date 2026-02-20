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

                <div className='flex items-center gap-2'>
                    <Link
                        to='/'
                        className='rounded-md px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'
                    >
                        Home
                    </Link>


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
            </div>
        </section>
    )
}

export default NavBar;
