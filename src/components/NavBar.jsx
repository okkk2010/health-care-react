import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <section className='navBar'>
            <Link to='/'>Home</Link>
            <Link to='/Login'>Login</Link>
        </section>
    )
}

export default NavBar;