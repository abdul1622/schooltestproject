
var host = window.location.protocol + "//" + window.location.host;
function logout() {
    var host = window.location.protocol + "//" + window.location.host;
    fetch('http://127.0.0.1:8000/api/logout/',
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
        nav = `
        <li class="nav-item" id="nav-profile">
        <a href= '${host}/profile' class="nav-link" tabindex="1">Profile</a>
    </li>
    <li class="nav-item" id="nav-test">
        <a id="nav-test-link" href='${host}/test-list' class="nav-link" >Test</a></li>
        <li class="nav-item" id="nav-testhistory">
        <a id="nav-testhistory-link" class="nav-link" href='${host}/test-history' tabindex="1">Test History</a>
    </li>
    <li class="nav-item">
    <a href="#" class="nav-link" onclick="logout()">Logout</a>
</li>`
        document.querySelector('.navbar-nav').innerHTML = nav
    }
    else if (user == 'is_staff' && dataentry) {
        nav = ` 
        <li class="nav-item" id="nav-profile">
            <a href= '${host}/profile' class="nav-link" tabindex="1">Profile</a>
        </li>

        <li class="nav-item" id="nav-academics">
            <a id="nav-academics-link" class="nav-link" href="${host}/academics" tabindex="1">Academics</a>
        </li>
        <li class="nav-item" id="nav-chapterlist">
            <a id="nav-chapterlist-link" class="nav-link" href='${host}/chapterlist' tabindex="1">ChapterList</a>
        </li>
        <li class="nav-item" id="nav-students">
            <a id="nav-students-link" class="nav-link" href='${host}/students' tabindex="1">Students</a>
        </li>
        <li class="nav-item" id="nav-question">
            <a id="nav-question-link" class="nav-link" href='${host}/questions' tabindex="1">Question</a>
        </li>
        <li class="nav-item" id="nav-questionpaperlist">
            <a id="nav-questionpaperlist-link"  class="nav-link" href='${host}/test-create' tabindex="1">QuestionPaperlist</a>
        </li>
        <li class="nav-item" id="nav-testhistory">
            <a id="nav-testhistory-link" class="nav-link" href='${host}/test-history' tabindex="1">Test History</a>
        </li>
        <li class="nav-item" id="nav-instruction">
            <a id="nav-instruction-link" class="nav-link" href='${host}/instructions' tabindex="1">Instruction</a>
        </li>
        <li class="nav-item">
            <a href="#" class="nav-link" onclick="logout()">Logout</a>
        </li>`
        document.querySelector('.navbar-nav').innerHTML = nav
    }
    else if (user == 'is_admin' && dataentry) {
        nav = ` 
        </li> <li class="nav-item" id="nav-profile">
            <a href= '${host}/profile' tabindex="1" class="nav-link">Profile</a>
        </li>

        <li class="nav-item" id="nav-academics">
            <a id="nav-academics-link" href="${host}/academics" tabindex="1" class="nav-link">Academics</a>
        </li>
        <li class="nav-item" id="nav-chapterlist">
            <a id="nav-chapterlist-link" href='${host}/chapterlist' tabindex="1" class="nav-link">ChapterList</a>
        </li>
        <li class="nav-item" id="nav-students">
            <a id="nav-students-link" href='${host}/students' tabindex="1" class="nav-link">Students</a>
        </li>
        <li class="nav-item" id="nav-staffs">
            <a id="nav-staffs-link" href='${host}/staffs' tabindex="1" class="nav-link">Staff</a>
        </li>
        <li class="nav-item" id="nav-question">
            <a id="nav-question-link" href='${host}/questions' tabindex="1" class="nav-link">Question</a>
        </li>
        <li class="nav-item" id="nav-questionpaper">
            <a id="nav-questionpaper-link" href='${host}/question-paper' tabindex="1" class="nav-link">QuestionPaper</a>
        </li>
        <li class="nav-item" id="nav-questionpaperlist">
            <a id="nav-questionpaperlist-link" href='${host}/test-create'tabindex="1" class="nav-link">QuestionPaperlist</a>
        </li>
        <li class="nav-item" id="nav-studenttesthistory">
            <a id="nav-studenttesthistory-link" href='${host}/student-test-history'tabindex="1" class="nav-link">Testresults</a>
        </li>
        <li class="nav-item" id="nav-instruction">
            <a id="nav-instruction-link" href='${host}/instructions' tabindex="1" class="nav-link">Instruction</a>
        </li>
        <li class="nav-item">
            <a href="#" onclick="logout()" class="nav-link">Logout</a>
        </li>`
        document.querySelector('.navbar-nav').innerHTML = nav

    }
    if (dataentry && user == '') {
        nav = ` 
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

