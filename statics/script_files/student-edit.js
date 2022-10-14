function filter() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("student-filter");
    filter = input.value.toLowerCase();
    table = document.getElementById("usr");
    tr = table.getElementsByTagName("tr");
    
    for (i = 0; i < tr.length; i++) {
        // td = tr[i].getElementsByTagName("td")[0];
        alltags = tr[i].getElementsByTagName("td");
        isFound = false;
        for(j=0; j< alltags.length; j++) {
          td = alltags[j];
          console.log(td)
          if (td) {
              txtValue = td.textContent || td.innerText;
              console.log(txtValue)
              if (txtValue.toLowerCase().indexOf(filter) > -1) {
                  tr[i].style.display = "";
                  j = alltags.length;
                  isFound = true;
              }
            }       
          }
          if(!isFound && tr[i].className !== "header") {
            tr[i].style.display = "none";
          }
        }
    }
        function deletestudent(id) {
          url = "https://schooltestproject.herokuapp.com/api/user-details/"
          fetch(`${url}${id}/`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'token' + ' ' + localStorage.getItem('token')
            },
          }).then(res => {
            userdetails();
          })
        }