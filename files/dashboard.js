import { onAuthStateChanged, auth, doc, getDoc, db, signOut, collection, addDoc , getDocs} from "./config.mjs";

let data = document.getElementById('data')
let login_go = document.getElementById('login_go')
let name_show = document.getElementById('name_show')
let create_post = document.getElementById('create_post')
let save = document.getElementById('save')
let title_post = document.getElementById('title_post')
let dis_post = document.getElementById('dis_post')
let div4 = document.getElementById('div4')

save.addEventListener('click', async () => {
    if (title_post.value == '') {
        Swal.fire("Please Enter Title");
    }
    else if (dis_post.value == '') {
        Swal.fire("Please Enter Description");
    }
    else {
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "post"), {
            date:  new Date(),
            title: title_post.value,
            discription: dis_post.value
        });
        console.log("Document written with ID: ", docRef.id);
        show_post()
    }
})
data.style.display = 'none'


async function show_post() {
    div4.innerHTML=''
    const querySnapshot = await getDocs(collection(db, "post"));
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        div4.innerHTML+=`
        <div id="div5" class='col-3 mb-3'>
          <div class='div6 p-3'>
             <p class='fw-bold fs-5'>${doc.data().title.slice(0,1).toUpperCase()}${doc.data().title.slice(1)}</p>
             <p>${doc.data().discription}</p>
          </div>
        </div>
        `
        data.style.display = 'none'
    });
}
show_post()


onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "User_details", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data().name);
            login_go.style.display = 'none'
            name_show.style.display = 'block'
            name_show.innerHTML = `👋 ${docSnap.data().name}`
            create_post.style.display = 'block'
            // loader_div.style.display = 'none'
            // main_fo.style.display = 'block'
        }
    }
    else {
        // console.log('User Is login');
        // console.log(user);

    }
});

name_show.addEventListener('click', function () {
    Swal.fire({
        title: "Are you You want to logout?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            signOut(auth).then(() => {
                console.log('Sign-out successful.');
                name_show.style.display = 'none'
                login_go.style.display = 'block'
                create_post.style.display = 'none'

            }).catch((error) => {
                console.log('Ops Erro');
            });
        }
    });
})


create_post.addEventListener('click', function () {
    data.style.display = 'flex'
})
// profile.addEventListener('click', function () {
//     data.style.display = 'flex'
// })

window.addEventListener('click', function (e) {
    if (e.target.id == 'data') {
        data.style.display = 'none'
    }
})