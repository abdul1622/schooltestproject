
var host = window.location.protocol + "//" + window.location.host;
function logout() {
    var host = window.location.protocol + "//" + window.location.host;
    fetch('https://schooltestproject.herokuapp.com/api/logout/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token' + ' ' + localStorage.getItem('token')
                // 'Content-Type': 'application/x-www-form-urlencoded', 
            }
        }).then(response => response.text())
    localStorage.clear()
    window.location.href = `${host}/login`
}
function navbar() {
    var user = localStorage.getItem('user_type');
    var dataentry = localStorage.getItem('data_entry');
    if (user == 'is_student') {
        nav = ` <li class="back-btn-nav">
            <button data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation"> &#x2715; </button>
        </li> 
    </li> <li class="nav-item" id="nav-profile">
        <a href= '${host}/profile'>Profile</a>
    </li>
    <li class="nav-item" id="nav-test">
        <a id="nav-test-link" href='${host}/test-list'>Test</a></li>
        <li class="nav-item" id="nav-testhistory">
            <a id="nav-testhistory-link" href='${host}/test-history'>Test History</a>
        </li>
        <li class="nav-item">
            <a href="#" onclick="logout()">Logout</a>
        </li>`
        document.querySelector('.navbar-nav').innerHTML = nav
    }
    else if (user == 'is_staff' && dataentry) {
        nav = ` 
        <li class="back-btn-nav">
            <button data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation"> &#x2715; </button>
        </li> <li class="nav-item" id="nav-profile">
            <a href= '${host}/profile' tabindex="1">Profile</a>
        </li>

        <li class="nav-item" id="nav-academics">
            <a id="nav-academics-link" href="${host}/academics" tabindex="1">Academics</a>
        </li>
        <li class="nav-item" id="nav-chapterlist">
            <a id="nav-chapterlist-link" href='${host}/chapterlist' tabindex="1">ChapterList</a>
        </li>
        <li class="nav-item" id="nav-students">
            <a id="nav-students-link" href='${host}/students' tabindex="1">Students</a>
        </li>
        <li class="nav-item" id="nav-question">
            <a id="nav-question-link" href='${host}/questions' tabindex="1">Question</a>
        </li>
        <li class="nav-item" id="nav-questionpaperlist">
            <a id="nav-questionpaperlist-link" href='${host}/test-create' tabindex="1">QuestionPaperlist</a>
        </li>
        <li class="nav-item" id="nav-testhistory">
            <a id="nav-testhistory-link" href='${host}/test-history' tabindex="1">Test History</a>
        </li>
        <li class="nav-item" id="nav-instruction">
            <a id="nav-instruction-link" href='${host}/instructions' tabindex="1">Instruction</a>
        </li>
        <li class="nav-item">
            <a href="#" onclick="logout()">Logout</a>
        </li>`
        document.querySelector('.navbar-nav').innerHTML = nav
    }
    else if (user == 'is_admin' && dataentry) {
        nav = ` 
        <li class="back-btn-nav">
            <button data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation"> &#x2715; </button>
        </li> <li class="nav-item" id="nav-profile">
            <a href= '${host}/profile' tabindex="1">Profile</a>
        </li>

        <li class="nav-item" id="nav-academics">
            <a id="nav-academics-link" href="${host}/academics" tabindex="1">Academics</a>
        </li>
        <li class="nav-item" id="nav-chapterlist">
            <a id="nav-chapterlist-link" href='${host}/chapterlist' tabindex="1">ChapterList</a>
        </li>
        <li class="nav-item" id="nav-students">
            <a id="nav-students-link" href='${host}/students' tabindex="1">Students</a>
        </li>
        <li class="nav-item" id="nav-staffs">
            <a id="nav-staffs-link" href='${host}/staffs' tabindex="1">Staff</a>
        </li>
        <li class="nav-item" id="nav-question">
            <a id="nav-question-link" href='${host}/questions' tabindex="1">Question</a>
        </li>
        <li class="nav-item" id="nav-questionpaper">
            <a id="nav-questionpaper-link" href='${host}/question-paper' tabindex="1">QuestionPaper</a>
        </li>
        <li class="nav-item" id="nav-questionpaperlist">
            <a id="nav-questionpaperlist-link" href='${host}/test-create'tabindex="1">QuestionPaperlist</a>
        </li>
        <li class="nav-item" id="nav-studenttesthistory">
            <a id="nav-studenttesthistory-link" href='${host}/student-test-history'tabindex="1">Testresults</a>
        </li>
        <li class="nav-item" id="nav-instruction">
            <a id="nav-instruction-link" href='${host}/instructions' tabindex="1">Instruction</a>
        </li>
        <li class="nav-item">
            <a href="#" onclick="logout()">Logout</a>
        </li>`
        document.querySelector('.navbar-nav').innerHTML = nav

    }
    if (dataentry && user == '') {
        nav = ` 
        <li class="back-btn-nav">
            <button data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation"> &#x2715; </button>
        </li> <li class="nav-item" id="nav-profile">
            <a href= '${host}/profile' tabindex="1">Profile</a>
        </li>
        <li class="nav-item" id="nav-academics">
            <a id="nav-academics-link" href="${host}/academics" tabindex="1">Academics</a>
        </li>
        <li class="nav-item" id="nav-chapterlist">
            <a id="nav-chapterlist-link" href='${host}/chapterlist' tabindex="1">ChapterList</a>
        </li>
        <li class="nav-item" id="nav-students">
            <a id="nav-students-link" href='${host}/students' tabindex="1">Students</a>
        </li>

        <li class="nav-item" id="nav-question">
            <a id="nav-question-link" href='${host}/questions' tabindex="1">Question</a>
        </li>
        <li class="nav-item" id="nav-questionpaper">
            <a id="nav-questionpaper-link" href='${host}/question-paper' tabindex="1">QuestionPaper</a>
        </li>
        <li class="nav-item" id="nav-questionpaperlist">
            <a id="nav-questionpaperlist-link" href='${host}/test-create'tabindex="1">QuestionPaperlist</a>
        </li>
        <li class="nav-item" id="nav-instruction">
            <a id="nav-instruction-link" href='${host}/instructions' tabindex="1">Instruction</a>
        </li>
        <li class="nav-item">
            <a href="#" onclick="logout()">Logout</a>
        </li>`
        document.querySelector('.navbar-nav').innerHTML = nav


    }
} navbar();

