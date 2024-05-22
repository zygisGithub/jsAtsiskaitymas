export function login () {
    const loginBoxes = document.querySelectorAll('.loginBox')
    const audioElement = document.getElementById('clickSound')

    loginBoxes.forEach(loginBox => {
        loginBox.addEventListener('click', () => {
            audioElement.play();
            let userType;

            if (loginBox.id === 'userLogin') {
                setTimeout(function (){
                    window.location = 'userPage.html'
                },700)
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
