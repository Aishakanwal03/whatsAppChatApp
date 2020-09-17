var currentUserKey = ""

//////////////////////////////////////////////////

let startChat = (friendKey, friendName, friendPhoto) => {
    var friendList = {
        friendId: friendKey ,
        userId: currentUserKey,
    }

    var db = firebase.database().ref("friend-list")
    var flag = true
    db.on('value', function (friends) {
        friends.forEach(function (data) {
            var user = data.val();
            if ((user.friendId === friendList.friendId && user.userId === friendList.userId) || (user.friendId === friendList.userId && user.userId === friendList.friendId)) {
                flag = false
            }
        })
            if (flag === true) {
                firebase.database().ref("friend-list").push(friendList, function(error){
                    if (error) {
                        alert(error)
                    }
                    else{
                        document.getElementById("chatDiv").classList.remove("d-none")
                        document.getElementById("divStart").classList.add("d-none")
                        document.getElementById("chat-list-col").classList.add("d-none")
                    }
                })
            }
            else {
                document.getElementById("chatDiv").classList.remove("d-none")
                document.getElementById("divStart").classList.add("d-none")
                // document.getElementById("chat-list-col").classList.add("d-none")
            }
            /////////////display frnd name and photo
            document.getElementById("chat-div-name").innerHTML = friendName
            document.getElementById("chat-div-image").src = friendPhoto
            // document.getElementById("chat-dive-name").innerHTML = friendName
        })
    // })   
}

let showChatList = () => {
    document.getElementById("chat-list-col").classList.remove("d-none")
    document.getElementById("divStart").classList.add("d-none")
    document.getElementById("chatDiv").classList.add("d-none")
}

let onKeyPress = () => {
    document.addEventListener('keydown', function (key) {
        if (key.which === 13) {
            sendMessage();

        }
    })
}

let sendMessage = () => {
    var message = `<div class="row justify-content-end">
                       <div class="col-6 col-sm-6 col-md-5 col-lg-5">
                           <p id="send">${document.getElementById("input-msg").value}
                                <span class="time">12:15 am</span>
                            </p>
                        </div>
                    </div>`
    document.getElementById("msg").innerHTML += message
    document.getElementById("input-msg").value = ""

    document.getElementById("msg").scrollTo(0, document.getElementById("msg").clientHeight)

}

//////////////////////// populateFriendList

function populate() {
    document.getElementById("lst-friend").innerHTML = `<div class="text-center mt-5">
                                                            <span class="spinner-border text-primary" style="width:7rem; height:7rem">
                                                            </span>
                                                       </div>`
    var db = firebase.database().ref("users");
    db.on("value", function (users) {
        if (users.hasChildren()) {
            var lst = `<li class="list-group-item" style="background-color: #f0f0f0;">
                           <input type="text" placeholder="Search or new chat" class="form-control form-rounded">
                       </li>`

        }
        users.forEach(function (data) {
            var user = data.val()
            if (user.email !== firebase.auth().currentUser.email) {
                lst += `<li class="list-group-item list-group-item-action" data-dismiss="modal"
                 onclick="startChat('${data.key}' , '${user.name}', '${user.photoURL}')">
                       <div class="row">
                            <div class="col-2 col-sm-2 col-md-3 col-lg-2">
                                <img class="friend-pic " src="${user.photoURL}" alt="">
                            </div>
                            <div class="col-10 col-sm-10 col-md-9 col-lg-10" style="cursor: pointer;">
                                <div class="name">${user.name}</div>
                             </div>
                        </div>
                    </li>`
            }
        })
        document.getElementById("lst-friend").innerHTML = lst
    })
}
////////////////sign in function

let signIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)

}

let signOut = () => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
}

let onFirebaseStateChanged = () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //   User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
            //   ...
            //   alert(displayName + email)
            var userData = {
                email: "",
                name: "",
                photoURL: "",
            }
            userData.email = firebase.auth().currentUser.email;
            userData.name = firebase.auth().currentUser.displayName;
            userData.photoURL = firebase.auth().currentUser.photoURL;

            var db = firebase.database().ref("users");
            var flag = true
            db.on("value", function (users) {
                users.forEach(function (data) {
                    var user = data.val();
                    if (user.email === userData.email){
                        currentUserKey = data.key;
                        flag = false
                    }
                })

                if (flag === true) {
                    firebase.database().ref("users").push(userData, callback)

                }
                else {
                    document.getElementById("user-image").src = firebase.auth().currentUser.photoURL
                    document.getElementById("user-image").title = firebase.auth().currentUser.displayName

                    document.getElementById("sign-in").classList.add("d-none")
                    document.getElementById("sign-out").classList.remove("d-none")
                    document.getElementById("sign-out").classList.remove("disabled")
                }
            })

            console.log(userData.email)
            // firebase.database().ref("users").push(userData, callback)

        } else {
            // User is signed out.
            document.getElementById("user-image").src = "images/ppp.jpg"
            document.getElementById("user-image").title = ""

            document.getElementById("sign-in").classList.remove("d-none")
            document.getElementById("sign-out").classList.add("d-none")
            document.getElementById("link-new-chat").classList.add("disabled")
        }
    });
}

let callback = (error) => {
    if (error) {
        alert(error)
    }
    else {
        document.getElementById("user-image").src = firebase.auth().currentUser.photoURL
        document.getElementById("user-image").title = firebase.auth().currentUser.displayName

        document.getElementById("sign-in").classList.add("d-none")
        document.getElementById("sign-out").classList.remove("d-none")
    }
}

onFirebaseStateChanged()


