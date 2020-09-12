let startChat = (id) => {
    document.getElementById("chatDiv").classList.remove("d-none")
    document.getElementById("divStart").classList.add("d-none")
    document.getElementById("chat-list-col").classList.add("d-none")
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

    document.getElementById("msg").scrollTo(0,  document.getElementById("msg").clientHeight)
   
}