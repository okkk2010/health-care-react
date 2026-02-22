import { useNavigate } from 'react-router-dom';
import storageService from '../services/storage';

const MyPage = ({ setIsLogin }) => {

    const navigate = useNavigate();

    const submitHandle = () => {
        storageService.logout();
        setIsLogin(false);
        alert('Logout success');
        navigate('/');
    }

    return (
        <div className='min-h-screen bg-[#eef2f7] px-4 pb-8 pt-28'>
            <h1>My Page</h1>
            <button onClick={submitHandle} className='rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300'>
                log out
            </button>
        </div>
    )
}
 
export default MyPage;