import { onAuthStateChanged, auth, doc, getDoc , db} from "./config.mjs";

let profile = document.getElementById('profile')
let data = document.getElementById('data')
let img_user = document.getElementById('img_user')

onAuthStateChanged(auth,async (user) => {
    if (!user) {
        window.location.href = '../index.html'
    }
    else {
        console.log('User Is login');
        console.log(user);
        
        const docRef = doc(db, "User_details", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            if (docSnap.data().photo != null) {
                console.log(docSnap.data().photo);
                

                img_user.src = docSnap.data().photo
            }
        } 
    }
});


profile.addEventListener('click', function () {
    data.style.display = 'flex'
})

window.addEventListener('click', function (e) {
    if (e.target.id == 'data') {
        data.style.display = 'none'
    }
})