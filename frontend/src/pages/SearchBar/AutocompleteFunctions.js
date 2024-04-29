export function Autocomplete(inp, info) {
  
  let currentFocus; // Ensure currentFocus is defined in the correct scope
  var arr;
  const config = require('../../config.json');
  const serverIP = config.serverIP;


  inp.addEventListener("input", async function(e) {
    
    var a, b, i, val = this.value;
    let language_id = localStorage.getItem('language_id');
    console.log(language_id);
    // if (!(language_id in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])) {
    //   language_id = 1;
    // }
    console.log(language_id);
    arr = await fetch(`http://${serverIP}/api/user/words/${val}/${language_id}`, {method: 'GET'})
      .then(response => response.json())
      .then(data => data)    
    closeAllLists(null, inp); // Pass inp to closeAllLists
    if (!val) { return false;}
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < arr.length; i++) {
      if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        b.addEventListener("click", ()=> {
          info();
          closeAllLists(null, inp); // Pass inp to closeAllLists
        });
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode === 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode === 38) {
      currentFocus--;
      addActive(x);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(elmnt, inp) {
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt !== x[i] && elmnt !== inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target, inp); // Pass inp to closeAllLists
  });
}
