import { onAuthStateChanged, auth, doc, getDoc, db, signOut, collection, addDoc, onSnapshot, ref, storage, uploadBytesResumable, getDownloadURL, deleteDoc, updateDoc } from "./config.mjs";

// Getting 
let data = document.getElementById('data')
let edit_data = document.getElementById('edit_data')
let login_go = document.getElementById('login_go')
let name_show = document.getElementById('name_show')
let create_post = document.getElementById('create_post')
let save = document.getElementById('save')
let title_post = document.getElementById('title_post')
let dis_post = document.getElementById('dis_post')
let div4 = document.getElementById('div4')
let my_post_show = document.getElementById('my_post_show')
let home_post_show = document.getElementById('home_post_show')
let div8 = document.getElementById('div8')
let main_fo = document.getElementById('main_fo')
let loader_div = document.getElementById('loader_div')
let edit_title_post = document.getElementById('edit_title_post')
let edit_dis_post = document.getElementById('edit_dis_post')
let edit_save = document.getElementById('edit_save')
let edit_img_post = document.getElementById('edit_img_post')

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const docRef = doc(db, "User_details", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            login_go.style.display = 'none'
            name_show.style.display = 'block'
            name_show.innerHTML = `👋 ${docSnap.data().name}`
            create_post.style.display = 'block'
            my_post_show.style.display = 'block'
        }
    }
});

// Save post Button 
save.addEventListener('click', async () => {
    if (title_post.value == '') {
        Swal.fire("Please Enter Title");
    }
    else if (dis_post.value == '') {
        Swal.fire("Please Enter Description");
    }
    else {
        save.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2" style="color: #4070F4;"></i>Save`
        save.disabled = true;
        title_post.readOnly = true;
        dis_post.readOnly = true;
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const docRef = doc(db, "User_details", uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let img_post = document.getElementById('img_post').files[0]
                    console.log(img_post);
                    if (img_post) {

                        const storageRef = ref(storage, `images/${img_post.name}`);
                        const uploadTask = uploadBytesResumable(storageRef, img_post);


                        uploadTask.on('state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                switch (snapshot.state) {
                                    case 'paused':
                                        console.log('Upload is paused');
                                        break;
                                    case 'running':
                                        console.log('Upload is running');
                                        break;
                                }
                            },
                            (error) => {
                                console.log(error);

                            },
                            () => {
                                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                    console.log(downloadURL);
                                    console.log("Document data:", docSnap.data().name);

                                    const docRef = await addDoc(collection(db, "post"), {
                                        uid: uid,
                                        display_name: docSnap.data().name,
                                        display_photo: docSnap.data().photo,
                                        date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                                        title: title_post.value,
                                        discription: dis_post.value,
                                        post_image: downloadURL
                                    });
                                    console.log("Document written with ID: ", docRef.id);
                                    title_post.value = '';
                                    dis_post.value = '';
                                    document.getElementById('img_post').value = '';
                                    save.innerHTML = 'Save'
                                    data.style.display = 'none'
                                    show_post()
                                });
                            }
                        );
                    }
                    else {
                        const docRef = await addDoc(collection(db, "post"), {
                            uid: uid,
                            display_name: docSnap.data().name,
                            display_photo: docSnap.data().photo,
                            date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                            title: title_post.value,
                            discription: dis_post.value,
                            post_image: null
                        });
                        console.log("Document written with ID: ", docRef.id);
                        title_post.value = '';
                        dis_post.value = '';
                        document.getElementById('img_post').value = '';
                        save.innerHTML = 'Save'
                        data.style.display = 'none'
                        show_post()
                    }
                }
            }
        });
    }
})



// Automatic Show post update 

const unsubscribe = onSnapshot(collection(db, "post"), (snapshot) => {
    div4.innerHTML = '';
    snapshot.forEach((doc) => {
        const data = doc.data();
        const userPhoto = data.display_photo ? data.display_photo : 'files/default_user.avif'; // Default image path
        div4.innerHTML += `
            <div id="div5" class='col-12 mb-5 d-flex justify-content-center'>
                    <div class='div6 w-50 p-3'>
                           <div class="show_dp d-flex align-items-center">
                                <div class="dp">
                                   <img src="${userPhoto}" alt="" class='h-100 dp_img'>
                                </div>
                                <div class='ms-2'>
                                      <p class='mb-0 fs-5 fw-bold'>${data.display_name}</p>
                                      <p class='mb-0 timing_post'>${data.date}</p>
                                </div>
                           </div>
                                      
                            <p class='fw-semibold title_post_user mt-3'>${data.title.slice(0, 1).toUpperCase()}${data.title.slice(1)} :-</p>
                            <p class='w-100 dis_post_user'>${data.discription}</p>
                            ${data.post_image ? `
                            <div class='div7 d-flex justify-content-center'>
                                <img src="${data.post_image}" alt="" class='h-100'>
                            </div>
                            ` : ''}
                    </div>
            </div>
                    `;
    });
    loader_div.style.display = 'none'
    main_fo.style.display = 'block'
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

// Create post show 
create_post.addEventListener('click', function () {
    save.disabled = false;
    title_post.readOnly = false;
    dis_post.readOnly = false;
    data.style.display = 'flex'
})



// Create post show none
window.addEventListener('click', function (e) {
    if (e.target.id == 'data') {
        title_post.value = '';
        dis_post.value = '';
        document.getElementById('img_post').value = '';
        data.style.display = 'none'
    }
})

my_post_show.addEventListener('click', function () {
    div4.style.display = 'none'
    div8.style.display = 'block'
    show_post()
});

function show_post() {
    div8.innerHTML = ''
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const unsubscribe = onSnapshot(collection(db, "post"), (snapshot) => {
                div8.innerHTML = ''
                let userPostsFound = false;
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const userPhoto = data.display_photo ? data.display_photo : 'files/default_user.avif'; // Default image path

                    if (data.uid == user.uid) {
                        userPostsFound = true;
                        div8.innerHTML += `
            <div id="div5" class='col-12 mb-5 d-flex justify-content-center'>
            <div class='div6 w-50 p-3'>
            <div class="show_dp d-flex align-items-center">
                        <div class="dp">
                        <img src="${userPhoto}" alt="" class='h-100 dp_img'>
                        </div>
                        <div class='ms-2'>
                           <p class='mb-0 fs-5 fw-bold'>${data.display_name}</p>
                           <p class='mb-0 timing_post'>${data.date}</p>
                        </div>
                    </div>
                    
                    <p class='fw-semibold title_post_user mt-3'>${data.title.slice(0, 1).toUpperCase()}${data.title.slice(1)} :-</p>
                    <p class='w-100 dis_post_user'>${data.discription}</p>
                    ${data.post_image ? `
                    <div class='div7 d-flex justify-content-center'>
                        <img src="${data.post_image}" alt="" class='h-100 img_post_user'>
                    </div>
                    ` : ''}
                     <button data-id="${doc.id}" class='del_spec_post' >Delete Post</button>
                     <button data-id="${doc.id}" class='edit_spec_post' >Edit Post</button>
                </div>
                </div>
            `;
                    }
                });

                if (!userPostsFound) {
                    div8.classList.add('no_post')
                    div8.innerHTML = `
                    <p class='text-center'>No post 😕</p>
                    `;
                }
                else {
                    div8.classList.remove('no_post')
                }
                let del_spec_post = document.querySelectorAll('.del_spec_post')

                for (let i = 0; i < del_spec_post.length; i++) {
                    del_spec_post[i].addEventListener('click', async function () {




                        Swal.fire({
                            title: "Are You Sure You wat to delete this post? 🗑️",
                            showDenyButton: true,
                            confirmButtonText: "Yes",
                            denyButtonText: `No`
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const delet_post_id = this.getAttribute('data-id');
                                await deleteDoc(doc(db, "post", delet_post_id));

                                console.log('deleted');
                                show_post()
                            }
                        });
                    })
                }

                let edit_spec_post = document.querySelectorAll('.edit_spec_post')
                for (let i = 0; i < edit_spec_post.length; i++) {
                    edit_spec_post[i].addEventListener('click', async function (e) {

                        const edit_post_id = this.getAttribute('data-id');
                        const docRef = doc(db, "post", edit_post_id);

                        edit_save.disabled = false;
                        edit_title_post.readOnly = false;
                        edit_dis_post.readOnly = false;

                        edit_data.style.display = 'flex'
                        console.log(e.target.parentElement);
                        let parent = e.target.parentElement
                        let edit_title = parent.querySelectorAll('.title_post_user')[0].innerHTML.slice(0, -3)
                        let dis_post_user = parent.querySelectorAll('.dis_post_user')[0].innerHTML
                        edit_title_post.value = edit_title
                        edit_dis_post.value = dis_post_user

                        edit_save.addEventListener('click', async function () {
                            if (edit_title_post.value == '') {
                                Swal.fire("Please Enter Title 📝");
                            }
                            else if (edit_dis_post.value == '') {
                                Swal.fire("Please Enter Description 📝");
                            }
                            else {
                                edit_save.disabled = true;
                                edit_title_post.readOnly = true;
                                edit_dis_post.readOnly = true;
                                edit_save.innerHTML = `<i class="fa-solid fa-spinner fa-spin me-2" style="color: #4070F4;"></i>Save`

                                if (edit_img_post.files[0]) {
                                    const storageRef = ref(storage, `images/${edit_img_post.files[0].name}`);
                                    const uploadTask = uploadBytesResumable(storageRef, edit_img_post.files[0]);


                                    uploadTask.on('state_changed',
                                        (snapshot) => {
                                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                            console.log('Upload is ' + progress + '% done');
                                            switch (snapshot.state) {
                                                case 'paused':
                                                    console.log('Upload is paused');
                                                    break;
                                                case 'running':
                                                    console.log('Upload is running');
                                                    break;
                                            }
                                        },
                                        (error) => {
                                            console.log(error);

                                        },
                                        () => {
                                            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                                                console.log(downloadURL);
                                                await updateDoc(docRef, {
                                                    title: edit_title_post.value,
                                                    date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                                                    discription: edit_dis_post.value,
                                                    post_image: downloadURL
                                                });
                                                edit_save.innerHTML = 'Save'
                                                edit_data.style.display = 'none'
                                                console.log('Edit');
                                                show_post()
                                            });
                                        }
                                    );







                                }

                                else {
                                    await updateDoc(docRef, {
                                        title: edit_title_post.value,
                                        date: `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`,
                                        discription: edit_dis_post.value
                                    });
                                    edit_save.innerHTML = 'Save'
                                    edit_save.disabled = false;
                                    edit_title_post.readOnly = false;
                                    edit_dis_post.readOnly = false;

                                    edit_data.style.display = 'none'
                                    console.log('Edit not img');
                                    show_post()
                                }
                            }
                        })
                    })
                }
            });
        }
    });
}
window.addEventListener('click', function (e) {
    if (e.target.id == 'edit_data') {
        title_post.value = '';
        dis_post.value = '';
        document.getElementById('img_post').value = '';
        edit_data.style.display = 'none'
    }
})


home_post_show.addEventListener('click', function () {
    div4.style.display = 'flex'
    div8.style.display = 'none'
})


