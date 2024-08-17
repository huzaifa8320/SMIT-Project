import { signInWithPopup, auth, google_option, GoogleAuthProvider, createUserWithEmailAndPassword, collection, addDoc, db, setDoc, doc, getDoc } from "./config.mjs"

let btn_sign = document.getElementById('btn_sign')
let btn_sign_google = document.getElementById('btn_sign_google')
let name_sign = document.getElementById('name_sign')
let email_sign = document.getElementById('email_sign')
let pass_sign = document.getElementById('pass_sign')


// Email sign 
btn_sign.addEventListener('click', function () {

    if (name_sign.value == '') {
        Swal.fire("Please Enter Name 📝");
    }

    else if (email_sign.value == '') {
        Swal.fire("Please Enter Email 📝");
    }

    else if (pass_sign.value == '') {
        Swal.fire("Please Enter Password 📝");
    }
    else {
        btn_sign.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2" style="color: #ffffff;"></i>Signup'

        createUserWithEmailAndPassword(auth, email_sign.value, pass_sign.value)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                console.log(user.uid);
                Swal.fire("Account Created Successfully ✅");
                btn_sign.innerHTML = 'Signup'

                setTimeout(() => {
                    window.location.href = 'dashboard.html'
                }, 1000);

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode == 'auth/email-already-in-use') {
                    Swal.fire("Email Already in Use📝");
                }
                else if (errorCode == 'auth/weak-password') {
                    Swal.fire("Password should be at least 6 characters 📝");
                }
                else if (errorCode == 'auth/invalid-email') {
                    Swal.fire("Please Enter a Valid Email 📝");
                }
                btn_sign.innerHTML = 'Signup'
            });
    }

})





// Google sign 
btn_sign_google.addEventListener('click', function () {
    btn_sign.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2" style="color: #ffffff;"></i>Signup'
    signInWithPopup(auth, google_option)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            const docRef = doc(db, "User_details", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                window.location.href = 'dashboard.html'
            }
            else {
                await setDoc(doc(db, "User_details", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    status: user.emailVerified
                });
                Swal.fire("Account Created Successfully ✅");
                setTimeout(() => {
                    window.location.href = 'dashboard.html'
                }, 1000);
            }
            btn_sign.innerHTML = 'Signup'
            console.log(user);
            console.log(user.uid);

            console.log('token', token);
            console.log('user', user);

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            if (errorCode == 'auth/internal-error' || errorCode == 'auth/cancelled-popup-request') {
                Swal.fire("Network Connection Error 🔌");
            }
            btn_sign.innerHTML = 'Signup'
        }
        )
})