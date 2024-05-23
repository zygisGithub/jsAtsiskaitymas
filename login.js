export function login () {
    const loginBoxes = document.querySelectorAll('.loginBox')

    loginBoxes.forEach(loginBox => {
        loginBox.addEventListener('click', () => {
            let userType

            if (loginBox.id === 'userLogin') {
                setTimeout(function (){
                    window.location = 'userPage.html'
                },10)
                userType = 'user'
            } else {
                setTimeout(function (){
                    window.location = 'adminPage.html'
                },700)
                userType = 'admin'
            }

            localStorage.setItem('userType', userType)
        })
    })
}
