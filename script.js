const logout = document.getElementById('logout')

import { login } from "./login.js";
login();
const userType = localStorage.getItem('userType')

console.log(userType)

if (logout) {//logout function with no errors! 'if logout is not true gives unexpected errors'
    logout.onclick = () => {
        window.location = 'index.html'
    }
}

