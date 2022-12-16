
    var token = localStorage.getItem('token')
    var host = window.location.protocol + "//" + window.location.host;
   
    $(document).ready(function(){ 
      if(!token){
      return window.location.href = '/login';
    }
      var user = localStorage.getItem('user_type')
      if (user == 'is_student'){
       return window.location.href = '/404'; 
      }
      document.getElementById('nav-instruction').style.opacity = '0.5';
    })
    function createinstruction() {
       var instruction = document.getElementById('id_instruction').value
       console.log(instruction)
       let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
       fetch(`https://schooltestproject.herokuapp.com/api/instructions/`,
            {
           method: 'POST',
           body: JSON.stringify({ 'note': instruction }),
           headers: {
               'Accept':'application/json',
               'Content-Type': 'application/json',
               'Authorization':'token'+' '+token,
               'X-CSRFToken': csrftoken
           },
       })
       .then(function(response) {
       location.reload();
       })
      }
var list = document.querySelector('.instructions');
function get(){
  var content = ''
  fetch( `https://schooltestproject.herokuapp.com/api/instructions/`,{
      method : 'GET',
      headers : {
        'Authorization':'token'+' '+token 
      },
    }).then(res => { 
      return res.json()})
    .then(data => {
    console.log(data.data)
    data.data.forEach((d, index) => {
      console.log(d.note)
      content += `<div class="cards" id=${d.id}>
        <li class="grade text-white">${d.note} <button class="btn btn-danger btn-sm" id=delete-ins  data-toggle="modal" data-target="#instruction-delete" >Delete</button>  </li> 
       
       </div>`
      })
      list.innerHTML = content;
  })
  
  }
  get();

  function deleteInstruction(id){
    console.log(id)
    fetch( `https://schooltestproject.herokuapp.com/api/instructions/${id}/`,{
      method : 'DELETE',
      headers : {
      'Content-Type': 'application/json',
      'Authorization': 'token' + ' ' + token,
      },
    }).then(res => { 
      get();
    })
  }
let yes_button = document.getElementById('delete-btn-yes')
  let container= document.querySelector('.instructions')
  container.addEventListener('click',(e) =>{
    e.preventDefault();
    let delbutton = e.target.id == 'delete-ins';
    let id = e.target.parentElement.parentElement.id
    console.log(e.target.parentElement.parentElement.id)
    if(delbutton){
      yes_button.setAttribute("onClick", `deleteInstruction(${id})`);
    }
 })
