const firebaseConfig = {
    apiKey: "AIzaSyAHMHAHTCMnkxL_N2zLyA52QliQtk5jaqQ",
    authDomain: "budgetmonitor-68d6a.firebaseapp.com",
    projectId: "budgetmonitor-68d6a",
    storageBucket: "budgetmonitor-68d6a.appspot.com",
    messagingSenderId: "407945418401",
    appId: "1:407945418401:web:03595ae744328b452fc2e0",
    measurementId: "G-8D67WHMPXL"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function getEP() {
    return [document.getElementById('InputEmail').value, document.getElementById('InputPassword').value];
}
function getSignUpEP() {
    return [document.getElementById('signUpInputEmail').value, document.getElementById('signUpInputPassword').value, document.getElementById('signUpConfirmInputPassword').value];
}
function validateEmailPassSignUp(info) {
    if (info[1].trim() == '' && info[0].trim() == '') {
        $('#emailSignUpHelp').text('Provide Email')
        $('#passwordSignUpHelp').text('Provide Password')
        return false;
    }
    if (info[0].trim() == '') {
        $('#emailSignUpHelp').text('Provide Email')
        return false;
    }
    if (info[1].trim() == '') {
        $('#passwordSignUpHelp').text('Provide Password')
        return false;
    }
    return true;
}
document.getElementById('signUpBtn').addEventListener('click', () => {
    let info = getSignUpEP();
    if (!validateEmailPassSignUp(info)) {
        document.getElementById('loginGIF').style.display = 'none';
        document.getElementById("loginUser").disabled = false;
        return
    }
    document.getElementById('signupGIF').style.display = 'inline-block';
    document.getElementById("signUpBtn").disabled = true;
    console.log(info)
    if (info[1] !== info[2]) {
        document.getElementById('passwordSignUpHelp').style.display = 'block';
        document.getElementById('passwordSignUpHelp').innerText = 'Unmatched Passwords';
        document.getElementById("signUpBtn").disabled = false;
        document.getElementById('signupGIF').style.display = 'none';
        console.log('unmatched');
        return;
    }
    else {
        document.getElementById('passwordSignUpHelp').style.display = 'none';
        document.getElementById('passwordSignUpHelp').innerText = '';
    }

    // document.getElementById('InputEmail').style.borderColor='white'

    auth.createUserWithEmailAndPassword(info[0], info[1]).then((res) => {
        db.collection("users").doc(res.user.uid).set({})
            .then(() => {
            })
            .catch((error) => {
            });
        document.getElementById('signupGIF').style.display = 'none';
        document.getElementById("signUpBtn").disabled = false;
        $('#signUpConfirmInputPassword').val('')
        $('#signUpInputPassword').val('')
        $('#signUpInputEmail').val('')
        $('.signUpErr').text('')
        document.getElementById('InputEmail').classList.add('blinkInput')
        document.getElementById('collapseOne').classList.add('show');
        document.getElementById('collapseTwo').classList.remove('show');

    })
        .catch((err) => {
            console.log(err.messagingSenderId, err.code,err);
            if (err.code.includes('invalid')) {
                document.getElementById('emailSignUpHelp').style.display = 'block'
                document.getElementById('emailSignUpHelp').innerText = 'Invalid Email'
            }
            if (err.code.includes('already')) {
                document.getElementById('emailSignUpHelp').style.display = 'block'
                document.getElementById('emailSignUpHelp').innerText = 'Already a user Exist'
            }
            if (err.code.includes('weak')) {
                document.getElementById('passwordSignUpHelp').style.display = 'block'
                document.getElementById('passwordSignUpHelp').innerText = 'Weak password'
            }
            document.getElementById('signupGIF').style.display = 'none';
            document.getElementById("signUpBtn").disabled = false;
        })
})
function validateEmailPass(info) {
    if (info[1].trim() == '' && info[0].trim() == '') {
        $('#emailHelp').text('Provide Email')
        $('#passwordHelp').text('Provide Password')
        console.log('n=both');
        return false;
    }
    if (info[0].trim() == '') {
        $('#emailHelp').text('Provide Email')
        return false;
    }
    if (info[1].trim() == '') {
        $('#passwordHelp').text('Provide Password')
        return false;
    }
    return true;
}
document.getElementById('loginUser').addEventListener('click', () => {

    let info = getEP();
    document.getElementById('loginGIF').style.display = 'inline-block';
    document.getElementById("loginUser").disabled = true;

    if (!validateEmailPass(info)) {
        document.getElementById('loginGIF').style.display = 'none';
        document.getElementById("loginUser").disabled = false;
        return
    }

    auth.signInWithEmailAndPassword(info[0], info[1]).then((res) => {
        localStorage.setItem('UID', res.user.uid)

        location.href = 'dashboard.html';
        document.getElementById('loginGIF').style.display = 'none';
        document.getElementById("loginUser").disabled = false;
    })
        .catch((err) => {
            // alert(err.messagingSenderId +" -> "+ err.code);
            console.log(err.messagingSenderId + " -> " + err.code);
            if (err.code.includes('email'))
                document.getElementById('emailHelp').innerText = 'Invalid UserID'

            if (err.code.includes('found'))
                document.getElementById('emailHelp').innerText = 'No user with this email'

            if (err.code.includes('password'))
                document.getElementById('passwordHelp').innerText = 'Wrong password'

            document.getElementById('loginGIF').style.display = 'none';
            document.getElementById("loginUser").disabled = false;
        })
})

function validateEmail() {
    let email = document.getElementById('InputEmail');
    document.getElementById('emailHelp').innerText = ''
    document.getElementById('passwordHelp').innerText = ''
    if (!email.value.includes('@')) {
        email.style.borderColor = 'red'
        email.style.boxShadow = '0 0 0 0.2rem rgba(197, 0, 69, 0.25)'
    }
    else {
        email.style.borderColor = 'green';
        email.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)'
    }

}

function validateSignUpEmail() {
    let password = document.getElementById('signUpInputPassword');
    let confirmPassword = document.getElementById('signUpConfirmInputPassword');
    document.getElementById('passwordSignUpHelp').innerText = ''
    document.getElementById('emailSignUpHelp').innerText = ''
    console.log('rrrun');
    // document.getElementById('passwordSignUpHelp').style.display='block'
    if (password.value !== confirmPassword.value) {
        confirmPassword.style.borderColor = 'red'
        confirmPassword.style.boxShadow = '0 0 0 0.2rem rgba(197, 0, 69, 0.25)'
    }
    else {
        confirmPassword.style.borderColor = 'green';
        confirmPassword.style.boxShadow = '0 0 0 0.2rem rgba(40, 167, 69, 0.25)'
    }

}

document.getElementById('signUpInputEmail').addEventListener('input', validateSignUpEmail)
document.getElementById('InputEmail').addEventListener("input", validateEmail);
// document.getElementById('signUpConfirmInputPassword').addEventListener("input", validateSignUpEmail);
$('.passwordChange').on('input propertychange', validateSignUpEmail);

function changeBackground() {
    let li = ['https://img.freepik.com/free-vector/happy-rich-banker-celebrating-income-growth_74855-5867.jpg?w=1380&t=st=1660213809~exp=1660214409~hmac=4ddd4f0742304ff9729e43b83caa2ea36b29c5b0e5fb91005fa274973b0f4bf8', 'https://img.freepik.com/free-vector/family-couple-saving-money_74855-5240.jpg?w=1800&t=st=1660213703~exp=1660214303~hmac=48f9a5f0b5159d57416a668056cb3bc4cd18a342395ff0a09fe6978e6f41aceb', 'https://img.freepik.com/free-vector/woman-investing-getting-profit_74855-11229.jpg?w=1380&t=st=1660214471~exp=1660215071~hmac=ecd303135823f537883a99a7f58ba96b60fe26b54633af80b816b5ea58c51088', 'https://img.freepik.com/premium-vector/tiny-people-putting-clocks-money-box-flat-vector-illustration-time-turning-into-finance-income-women-men-taking-care-work-organization-planning-tasks-business-time-management-concept_74855-22575.jpg?w=1380', 'https://img.freepik.com/free-vector/social-support-concept-residents-getting-basic-benefits-from-government_74855-11060.jpg?w=1380&t=st=1660837068~exp=1660837668~hmac=34641c77c09df802b46b3a8bc2e489162d33dd732339a90c51f61f5dbeb17963', 'https://img.freepik.com/premium-vector/hand-giving-money-entrepreneurs-local-shopkeepers-tiny-people-shop-owners-receiving-loan-flat-vector-illustration-small-business-support-collateral-financial-help-subsidy-concept_74855-21134.jpg?w=1380']

    // if(window.screen.width>950)
    document.getElementById('image').setAttribute('src', li[Math.floor(Math.random() * 6)])
}
// let p = setInterval(changeBackground, 3000)

let portrait = window.matchMedia("(orientation: portrait)");

portrait.addEventListener("change", function (e) {
    if (e.matches) {
        // Portrait mode
        document.getElementById('image').setAttribute('src', 'https://images.pexels.com/photos/9822690/pexels-photo-9822690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')
        clearInterval(p)
        console.log('portrait');
    } else {
        changeBackground()
        p = setInterval(changeBackground, 3000)
    }
})

const track=document.getElementById('image-track');

// document.getElementById('imgDisplay').onmousedown=e=>{
window.onmousedown=e=>{
    track.dataset.mouseDownAt = e.clientX;
    const mouseDelta=parseFloat(track.dataset.mouseDownAt)
}

// document.getElementById('imgDisplay').onmousemove=e=>{
window.onmousemove=e=>{
    if(track.dataset.mouseDownAt==="0") return

    const mouseDelta=parseFloat(track.dataset.mouseDownAt)-e.clientX;
    let maxDelta=window.innerWidth/2;

    const percentage=(mouseDelta/maxDelta)*-100;
    let nextPercentage=parseFloat(track.dataset.prevPercentage)+percentage;
    nextPercentage=Math.min(nextPercentage,0)
    nextPercentage=Math.max(nextPercentage,-100)

    track.dataset.percentage=nextPercentage;
    // track.style.transform=`translate(${nextPercentage}%, -50%)`;
    track.animate({
        transform:`translate(${nextPercentage}%, -50%)`
    },{duration:1200,fill:'forwards'})
    for(const image of track.getElementsByClassName("image")){
        // image.style.objectPosition=`${nextPercentage+100}% 50%`;
        image.animate({
            objectPosition:`${100+nextPercentage}% center`
        },{duration:1200,fill:'forwards'})
    }
}

window.onmouseup=()=>{
    track.dataset.mouseDownAt="0";
    track.dataset.prevPercentage=track.dataset.percentage;
}