const url = 'http://localhost:5001/egetapi/us-central1/users'

let users = [];
let selectedUser = {};



//Get buttons, textfields, messages and give them an id.
const userTable = document.querySelector("#userTable");
const createUserButton = document.querySelector("#createUserButton");
const deleteUserButton = document.querySelector("#deleteUser");
const cancelButton = document.querySelector("#cancelButton");
const userNameInput = document.querySelector("#userNameField");
const userEmailInput = document.querySelector("#userEmailField");
const createUserErrorMessage = document.querySelector("#createUserErrorMessage");
const deleteUserMessage = document.querySelector("#deleteUserMessage");

initialize();

//Get users and creates usertable
function initialize() {
    getUsers();
    createUserButton.addEventListener("click", createUser);
    deleteUserButton.addEventListener("click", deleteUser);
    //cancelButton.addEventListener("click", showTableSection);
}

async function getUsers() {
    try {
        const response = await fetch(url);
        
        if(response.ok) {
            users = await response.json();
            renderUserTable();
        }
        else {
            throw new Error(response.statusText);
        }
    }
    catch (err) {
        throw err;
    }
}

//Display editSection and buttons.
const editUserSection = (userId) => {
    if(!userId) {
        throw new Error("no id");
    }
    selectedUser = userId;
    tableSection.style.display = "none";
    buttonSection.style.display = "none";
    editSection.style.display = "block";
}

const showTableSection = () => {
    tableSection.style.display = "block";
    editSection.style.display = "none";
}

async function createUser () {
    const newUser = { firstname: userNameInput.value, email: userEmailInput.value};
    
    // Checks that there is some input.
    if(!newUser.firstname || !validateEmail(newUser.email)) {
        return showErrorMessage();
    }
    
    try {
        const response = await fetch(url, { method: "POST",
         headers: {
            'Content-Type': 'application/json',
        },
         body: JSON.stringify(newUser)});
        
        if(response.ok) {
            // If adding a new user was ok.
            users.push(newUser);
            renderUserTable();
            clearForm();
        }
        // Bad request error
        else {
            throw err;
            }  
        } 
    catch (err) {
        console.log(err);
        
        alert(err);
        }
}


//Delete user
async function deleteUser() {
    try {
        const userToDelete = selectedUser;
        const response = await fetch(url + userToDelete, {method: "DELETE"});

        if(response.ok) {
            users = users.filter(user => user.id !== userToDelete)
            renderUserTable();
            showTableSection();
            
        }
        else {
            throw new error(response.statusText);
        }
    }
    catch (err) {
        throw err;
    }
} 

//Creates the userTable and listen to click on userId for each row.
function renderUserTable() {
    let tableRow = "";

    users.forEach(user => {
        tableRow += 
        `<tr id=${user.id} onclick="editUserSection(this.id)">
            <td>${user.firstname}</td>
            <td>${user.email}</td>
        </tr>`;
    });

    userTable.innerHTML = tableRow;
}

function showErrorMessage() {
    createUserErrorMessage.style.display = "block";
    createUserErrorMessage.innerHTML = "Name and/or E-mail not correct.";
} 

function showDeleteMessage () {
    deleteUserMessage.style.display = "block";
    deleteUserMessage.innerHTML = "Are you sure to delete?";
}

//Check that email is correct.
function validateEmail(email) {
    if(!email || !email.includes("@")) {
        return false;
    }
    else return true;
}

//Clear inputs.
function clearForm() {
    userNameInput.value = '';
    userEmailInput.value = '';
    createUserErrorMessage.style.display = "none";
    createUserErrorMessage.innerHTML = "";
}

