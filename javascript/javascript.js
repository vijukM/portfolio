/*Ovde se nalaze odredjene promenljive i podaci/funkcije koje se na vise mesta zahtevaju */

const firebase_url = "https://xyz-travel-71c29-default-rtdb.firebaseio.com";
let url = window.location.href;
let acc = document.getElementById('acc');
let acc_side = document.getElementById('acc-side');
let login_btn = document.getElementById('login-btn');
let login_side = document.getElementById('login-side');
let btnLogin = document.getElementById('btn_login');

let today_date = new Date();

/* Pronadji status cookie po imenu */
let cookie_list = document.cookie.split(';');
let status = "";
for(let i =0;i<cookie_list.length;i++){
  if (cookie_list[i].includes('status')){
      status = cookie_list[i].split('=')[1];
      break;
  }
}
/*Na stranicama city i city all se prikazuje trajanje ture */
/*Funkcija na osnovu trajanja vraca string sa "lepim" ispisom trajanja (sati + minuti...) */
function parseTime(duration){       
  let hours = 0;
  while(duration >= 60){
      hours ++;
      duration -= 60;
  }

  if(hours == 0 && duration !=0){
      return duration + "min";
  }
  else if(hours !=0 && duration == 0){
      return hours + "h";
  }
  else{
      return hours + "h " + duration + "min";
  }
}

/*Inicijalizacija nekih elemenata koji se nalaze na svim/vecini stranica */
document.addEventListener('DOMContentLoaded', function() {
  let elems_sidenav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(elems_sidenav, {});

  let elems_parallax = document.querySelectorAll('.parallax');
  M.Parallax.init(elems_parallax, {});

  let elems_tooltip = document.querySelectorAll('.tooltipped');
  M.Tooltip.init(elems_tooltip, {});

  let elems_modal = document.querySelectorAll('.modal');
  M.Modal.init(elems_modal, {});

  let elems_collapsible = document.querySelectorAll('.collapsible');
  M.Collapsible.init(elems_collapsible, {});

  checkLogin();
});

/*Funkcija u odnosu na sadrzaj cookie-ja odredjuje da li je korisnik ulogovan ili ne */
/*S obzirom da se nav meni menja u odnosu na sirinu ekrana, sve je duplirano 
(za meni kada je u normalnom formatu i kada je u mobile prikazu) */
function checkLogin(){
  if (status == ""){

      acc.classList.add('disabled-link');
      acc_side.classList.add('disabled-link-side');
      login_btn.firstChild.innerHTML = "Prijava/Registracija";
      login_side.firstChild.innerHTML = "Prijava/Registracija";

  }

  else{
    
    acc.classList.remove('disabled-link');
    acc.firstChild.href = "account.html";
    acc_side.classList.remove('disabled-link-side');
    acc_side.firstChild.href = "account.html";
    login_btn.firstChild.innerHTML = "Odjava";
    login_side.firstChild.innerHTML = "Odjava";
    login_btn.firstChild.href = "#!";
    login_side.firstChild.href = "#!";
    login_btn.firstChild.classList.remove('modal-trigger');
    login_side.firstChild.classList.remove('modal-trigger') ;
  }
}

/*Dugme u donjem desnom uglu koje vraca korisnika na pocetak stranice */
document.getElementById('to-top-btn').addEventListener('click', () => window.scrollTo({top:0}));

function changeStatus(user_data){
  document.cookie = "status=logged-in";
  document.cookie = "first_name=" + user_data.ime + ";";
  document.cookie = "last_name=" + user_data.prezime + ";";
  document.cookie = "username=" + user_data.username + ";";
  document.cookie = "password=" + user_data.password + ";";
  document.cookie = "birthdate=" + user_data.datumRodjenja + ";";
  document.cookie = "email=" + user_data.email + ";";
  document.cookie = "address=" + user_data.adresa + ";";
  document.cookie =  "phone_num=" + user_data.telefon + ";";
  location.reload();
}


let btnOtkazi = document.getElementById('otkazi').addEventListener('click', () =>{
  clearForm('registracija');
  closeModalTab(1);
});

/*Funkcija brise unesene podatke u formi za registraciju ukoliko je korisnik kliknuo na dugme Otkazi */
function clearForm(form){
  document.getElementById(form).reset();

}

/*Zatvara jedan od tabova za prijavu/registraciju */
function closeModalTab(index){
  let elem = document.getElementById('modal-tabs');
  let instance = M.Collapsible.getInstance(elem);
  instance.close(index);
}


login_btn.addEventListener('click', odjava);
login_side.addEventListener('click',odjava);

/*Funkcija odjavljuje korisnika u zavisnosti od toga da li se nalazi na nalog stranici/ostalim */
function odjava(deactivate = false){
  if ((login_btn.firstChild.innerText == "ODJAVA" | login_btn.firstChild.innerText == "Odjava") | deactivate == true){
    
    let cookie_list = document.cookie.split(';');
    for(let i=0;i<cookie_list.length;i++){
      document.cookie = cookie_list[i] + ";expires = Thu, 01 Jan 1970 00:00:00 UTC;";
    }
      if (location.href.split('/').splice(-1)[0].includes("account.html")){
          window.location.replace("index.html");}
      else{
        location.reload();
    }
  }
}

/*Dobavi sve korisnike sa njihovim lozinkama (za prijavu ili proveru dostupnosti korisnickog imena kod registracije) */
let request_all_users = new XMLHttpRequest();
request_all_users.open('GET', firebase_url + "/korisnici.json");
let users = [];

request_all_users.onreadystatechange = function(){
    if(this.readyState == 4){
        if(this.status == 200){
          let parsed = JSON.parse(request_all_users.responseText);
          for(let user in parsed){
            users.push({"unique_id":user,"username":parsed[user].username,"password":parsed[user].password});
        }
      }
  }
}

request_all_users.send();

/*Tokom registracije se proveravaju svi uneseni podaci kako korisnik kuca, pa je potrebno 
 validaciju raditi "u hodu" */

let field_list = [
document.getElementById('first_name'),
document.getElementById('last_name'),
document.getElementById('username'),
document.getElementById('pass'),
document.getElementById('email'),
document.getElementById('address'),
document.getElementById('tel-num'),
document.getElementById('birthdate')
];


for(let i = 0;i<field_list.length;i++){
  field_list[i].addEventListener('input', () => validateUserData(field_list[i],field_list,btnReg));
}

let field_list_login = [
  document.getElementById('username_login'),
  document.getElementById('password_login')
];

for(let i = 0;i<field_list_login.length;i++){
  field_list_login[i].addEventListener('input', () => validateUserData(field_list_login[i],field_list_login,btnLogin));
}

/*Funkcija aktivira polja za izmenu podataka o turi/korisniku i menja tekst unutar dugmeta Izmeni */
function izmeniPodatke(fields_to_activate,is_user_page = false){

        if(izmeni.innerText == "POTVRDI IZMENE"){
            for(let i = 0;i<fields_to_activate.length;i++){
            fields_to_activate[i].disabled = true;
            let elems = document.querySelectorAll('select');
            M.FormSelect.init(elems, {});
            if(is_user_page == true){
              fields_to_activate[i].classList.remove('valid');
            }
            }
            izmeni.innerText = "IZMENI PODATKE";
          }
        else{
            for(let i = 0;i<fields_to_activate.length;i++){
            fields_to_activate[i].disabled = false;
            let elems = document.querySelectorAll('select');
            M.FormSelect.init(elems, {});
            }
          izmeni.innerText = "POTVRDI IZMENE";
    }
   
}

/*Funkcija provera unesen email */
function checkMail(mail,mail_field){
  let exp = mail.split('@');

  if(mail.length > 60){
    incorrect(mail_field);
  }
  
  else if(exp.length != 2){
      incorrect(mail_field);
      }
  else if(exp[0] == '' | exp[1] == ''){
      incorrect(mail_field);
    }
  
  else if (exp[0].includes(' ') | exp[1].includes(' ')){
    incorrect(mail_field);
  }

  else{
    correct(mail_field); 
  }
    
  }



/*Funkcija parsira string u datum */
function stringToDate(string){
  let elems = string.split('-');
  return new Date(elems[0],elems[1] - 1,elems[2]);
}

/*Funkcija validira podatke za registraciju
elem je element koji se validira
which_fields je lista elemenata koji se validira (za prijavu/registraciju) u kojoj se nalazi elem
which_btn je dugme koje treba da se aktivira ukoliko je korisnik uneo tacne podatke
*/
function validateUserData(elem,fields_list,which_btn){
  
  let input = elem.value.trim(); // izbaci razmake sa pocetka/kraja
  if(elem.id == "birthdate" | elem.id == "datum-rodj"){
    if(stringToDate(input) >= today_date){
      incorrect(elem);
    }
    else{
      correct(elem);
    }
  }

  else{
    if (input.length === 0){
      incorrect(elem);
    }
    else{
      correct(elem);
    }

    if(elem.id == "first_name" | elem.id == 'ime'){
      if(input.length > 35){
        incorrect(elem);
      }
    }

    if(elem.id == "last_name" | elem.id == 'prezime'){
      if(input.length > 50){
        incorrect(elem);
      }
    }

    if(elem.id == "address" | elem.id == 'adresa'){
      if(input.length > 70){
        incorrect(elem);
      }
    }

    if(elem.id == "username" | elem.id == 'korisnicko-ime'){
      if (input.length > 30){
        incorrect(elem);
      }
      
      if (users.find(el => el.username == input)){

        incorrect(elem);
        M.toast({html: 'Korisničko ime zauzeto!'});
      }
    }

    if(elem.id == "pass" | elem.id == "lozinka"){
      if(input.length < 8 | input.length > 30){
        incorrect(elem);

      }
      else{
        correct(elem);
        }
    }


    if(elem.id == "tel-num" | elem.id == "broj-tel"){
        if(input.length < 4 | input.length > 11){
          incorrect(elem);
        }
        else{
          if(
            
          !(['060','061','062','063','064','065','066','067','068','069'].find(el => el == input.substring(0,3))) |
          checkForCharacters(input)
          ){
            incorrect(elem);
          }
        else{
          correct(elem);
        }
    }
    }

    if(elem.id == "email" | elem.id == "mail"){
      checkMail(elem.value, elem)
    }
  }
  readyForSubmit(fields_list,which_btn);
}



/*Funkcija vraca true/false ukoliko u broju telefona postoji/ ne postoji karakter koji nije nula */
function checkForCharacters(string){
  for(let i = 0; i<string.length;i++){
    if(string.charCodeAt(i) < 47 | string.charCodeAt(i) > 58){
      return true;
    }
  }
  return false;
}

let btnReg = document.getElementById('registruj');
/*Funkcija pokazuje poruku o gresci ispod polja za unos */
function incorrect(id){
  id.classList.add('invalid');
  id.classList.remove('valid');
}

/*Funkcija pokazuje poruku 'Tacno' ispod polja za unos */
function correct(id){
  id.classList.add('valid');
  id.classList.remove('invalid');
}

/*Ukoliko je validacija prosla za sva polja neke forme */
function readyForSubmit(field_list1,btn){

  let valid_count = 0;
  for(let i=0;i<field_list1.length;i++){
    if(field_list1[i].classList.contains('valid')){
      valid_count++;
    }
  }
  if (valid_count == field_list1.length){
    btn.disabled = false;
  }
  else{
    btn.disabled = true;
  }
}

/*Nakon uspesne validacije podataka za registraciju */
btnReg.addEventListener('click', () => { 
  M.toast({html: 'Registracija uspešna!'});
  clearForm('registracija');
  closeModalTab(1);
  let instance = M.Modal.getInstance(document.getElementById('modal-prijava'));
  instance.close();
});

/*Logovanje */
btnLogin.addEventListener('click', () =>{
  let user = users.find(el => el.username == field_list_login[0].value.trim());
  if(!user){
    clearForm('prijava');
    M.toast({html: 'Korisničko ime ne postoji!'});
    incorrect(field_list_login[0]);
  }
  else if(user && field_list_login[1].value != user.password){
    field_list_login[1].value = "";
    M.toast({html: 'Pogrešna lozinka!'});
    incorrect(field_list_login[1]);
  }

  else{
    let request_user = new XMLHttpRequest();
    request_user.open('GET', firebase_url + "/korisnici/" + user.unique_id + ".json");
    request_user.onreadystatechange = function(){
      if(request_user.readyState == 4){
        if(request_user.status == 200){
          changeStatus(JSON.parse(request_user.responseText));
        }
      }
    }
    request_user.send();
  }
});






