import { auth, signInWithPopup, google_option, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, doc, db, setDoc, getDoc } from "./config.mjs";

let btn_login_google = document.getElementById('btn_login_google')
let btn_login = document.getElementById('btn_login')
let email_log = document.getElementById('email_log')
let pass_log = document.getElementById('pass_log')

// Email sign 
btn_login.addEventListener('click', function () {
  if (email_log.value == '') {
    Swal.fire("Please Enter Emial 📝");
  }
  else if (pass_log.value == '') {
    Swal.fire("Please Enter Password 📝");
  }
  else {
    btn_login.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2" style="color: #ffffff;"></i>Login'
    signInWithEmailAndPassword(auth, email_log.value, pass_log.value)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log(user);
      console.log(user.uid);
      Swal.fire("Login Successfully ✅");
      btn_login.innerHTML = 'Login'
      setTimeout(() => {
        window.location.href = './files/dashboard.html'
      }, 1000);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      if (errorCode == 'auth/invalid-email') {
        Swal.fire("Please Enter a Valid Email 📝");
      }
        else if (errorCode == 'auth/invalid-credential') {
          Swal.fire("Account Not Found 📝");
          setTimeout(() => {
            window.location.href = 'files/signup.html'
          }, 1000);
        }
        console.log(errorMessage);
        btn_login.innerHTML = 'Login'
        
      });
    }
  })
  
  // Google Login 
  btn_login_google.addEventListener('click', function () {
    signInWithPopup(auth, google_option)
    .then(async (result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(credential);
      console.log(token);
      console.log(user);
      
      const docRef = doc(db, "User_details", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        window.location.href = 'files/dashboard.html'
      }
      else {
        console.log('h');
        
        await setDoc(doc(db, "User_details", user.uid), {
          name: user.displayName,
          email: user.email,
          status: user.emailVerified,
          photo: user.photoURL
        });
        Swal.fire("Account Created Successfully ✅");
        setTimeout(() => {
          window.location.href = 'files/dashboard.html'
        }, 1000);
      }
      
      
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode);
      console.log(credential);
      if (errorCode == 'auth/internal-error' || errorCode == 'auth/cancelled-popup-request') {
        Swal.fire("Network Connection Error 🔌");
      }
    }
  )
})
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     const uid = user.uid;
//     window.location.href = './files/dashboard.html'
//   }

//   else {
//     console.log('user is not sign');
//   }
// });