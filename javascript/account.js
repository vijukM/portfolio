let field_list_user = [
    document.getElementById('ime'),
    document.getElementById('prezime'),
    document.getElementById('korisnicko-ime'),
    document.getElementById('lozinka'),
    document.getElementById('datum-rodj'),
    document.getElementById('mail'),
    document.getElementById('adresa'),
    document.getElementById('broj-tel')
];

/*Popuni podatke o korisniku na osnovu cookie vrednosti */
let user_data = document.cookie.split(';');
for(let i = 0;i<(user_data.length);i++){
    
    let pair_value = user_data[i].split('=');
    if(pair_value[0].trim() == "first_name"){
        field_list_user[0].value = pair_value[1];
        field_list_user[0].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "last_name"){
        field_list_user[1].value = pair_value[1];
        field_list_user[1].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "username"){
        field_list_user[2].value = pair_value[1];
        field_list_user[2].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "password"){
        field_list_user[3].value = pair_value[1];
        field_list_user[3].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "birthdate"){
        field_list_user[4].value = pair_value[1];
        field_list_user[4].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "email"){
        field_list_user[5].value = pair_value[1];
        field_list_user[5].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "address"){
        field_list_user[6].value = pair_value[1];
        field_list_user[6].innerHTML = pair_value[1];
    }

    if(pair_value[0].trim() == "phone_num"){
        field_list_user[7].value = pair_value[1];
        field_list_user[7].innerHTML = pair_value[1];
    }
}

let list_without_username = field_list_user.filter(el => el.id != 'korisnicko-ime');


/*Potrebno je aktivirati polja za izmenu podataka */
let izmeni = document.getElementById('izmeni');

for(let i=0;i<list_without_username.length;i++){
    list_without_username[i].addEventListener('input', () => validateUserData(list_without_username[i], list_without_username, izmeni));
}

izmeni.addEventListener('click', () => {

    for(let i = 0;i<list_without_username.length;i++){
        list_without_username[i].classList.add('valid');
    }
    izmeniPodatke(list_without_username,true);


    if(izmeni.innerText == "IZMENI PODATKE"){
        M.toast({html: 'Podaci uspešno izmenjeni!'});
    }

});

/*Deaktivacija naloga nakon potvrde izaziva isti efekat kao odjava */
document.getElementById('deactivate').addEventListener('click', () => odjava(true));



