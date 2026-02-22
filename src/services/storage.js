
const storageService = {
    login : (email, name, role) => {
        localStorage.setItem('email', email);
        localStorage.setItem('name', name);
        localStorage.setItem('role', role);

        console.log('User logged in:', email, name, role);
    },

    logout : () => {
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('role');

        console.log('User logged out');
    },

    getEmail : () => {
        return localStorage.getItem('email');
    },

    getName : () => {
        return localStorage.getItem('name');
    },

    getRole : () => {
        return localStorage.getItem('role');
    }
}

export default storageService;