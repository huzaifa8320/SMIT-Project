import { onAuthStateChanged, auth } from "./config.mjs";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        const uid = user.uid;
        window.location.href = '../index.html'
    }
    else{
        console.log('User Is login');
        
    }
});

let profile = document.getElementById('profile')
let data = document.getElementById('data')

profile.addEventListener('click' , function(){
    data.style.display = 'flex'
})

window.addEventListener('click', function (e) {
    if (e.target.id == 'data') {
        data.style.display = 'none'
    }
})