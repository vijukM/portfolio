/*Inicijalizacija tabova sa tabelama */
M.Tabs.init(document.querySelectorAll('.tabs'),{swipeable:true});

/*Funkcija uklanja scrollbar sa prethodnog slajda o turama */
function removeOverflow(){
    let previous_tab = document.querySelector('#ture');
    previous_tab.classList.remove('overflow-all');
}
/*Funkcija dodaje scrollbar kada se vraca na prethodni slajd o turama */
function addOverflow(){
    let previous_tab = document.querySelector('#ture');
    previous_tab.classList.add('overflow-all');
}

/*Select box inicijalizacija*/
document.addEventListener('DOMContentLoaded', function() {
    let elems_select= document.querySelectorAll('select');
     M.FormSelect.init(elems_select, {});
    
  });

let row_to_delete = "";
let chosen_entity = "";


document.addEventListener('mouseover',() => {
    let element  = M.Modal.getInstance(document.getElementById('modal-ture'));
    if(element.isOpen){
        document.querySelector('.modal-overlay').addEventListener('click', () => resetForm((field_list_ture), izmeni))
    }
});

document.getElementById('korisnici-trigger').addEventListener('click', removeOverflow);
document.getElementById('ture-trigger').addEventListener('click', addOverflow);
/*Klik na dugme Da,obrisi turu u modalu za potvrdu se brise element iz tabele tura */
document.getElementById('btnDel').addEventListener('click',() => row_to_delete = document.getElementById('kod-ture').value);

document.getElementById('delete').addEventListener('click',obrisiTuru);

/*Funkcija brise turu iz tabele i pokazuje poruku nakon potvrde od strane korisnika */
function obrisiTuru(toDelete){

    toDelete = row_to_delete;
    document.getElementById('ture_table').removeChild(document.getElementById(toDelete));
    let elem = document.getElementById('modal-ture');
    let instance = M.Modal.getInstance(elem);
    instance.close();
    M.toast({html: 'Tura uspešno obrisana!'});
}

/*Dobavi sve dostupne ture u bazi */
let request_all_tours = new XMLHttpRequest();
request_all_tours.open('GET', firebase_url + "/turistickeAtrakcije.json");

request_all_tours.onreadystatechange = function(){
    if(this.readyState == 4){
        if (this.status == 200){
            parsed_tours = JSON.parse(request_all_tours.responseText);
            for(let id in parsed_tours){
                for(let model in parsed_tours[id]){
                    createTableRow(parsed_tours[id][model],'#modal-ture','ture_table');
                }
            }
        }
    }
}
request_all_tours.send();

/*Zahteva SVE podatke o svim korisnicima (request_all_users iz javascript.js dobavlja samo username sa password-om) */
let request_users_all_info = new XMLHttpRequest();
request_users_all_info.open('GET', firebase_url + "/korisnici.json");

request_users_all_info.onreadystatechange = function(){
    if(this.readyState == 4){
        if (this.status == 200){
            parsed_users = JSON.parse(request_users_all_info.responseText);
            for(let id in parsed_users){
                createTableRow(parsed_users[id],'#modal-korisnik','korisnici_table');
                
            }
        }
    }
}
request_users_all_info.send();

/*S obzirom da su i tabela tura i tabela korisnika isto formatirane, funkcija kreira jedan red u tabeli */
function createTableRow(entry,modal_trigger,tableID){
    let tr = document.createElement('tr');
    if(tableID == "ture_table"){
        tr.id = entry.kod;
    }
    else{
        tr.id = entry.username;
    }

    let first = document.createElement('td');
    let a_first = document.createElement('a');
    a_first.classList.add('modal-trigger','block','black-text');
    a_first.href = modal_trigger;
    if(tableID == "ture_table"){
        a_first.innerHTML = entry.kod;
    }
    else{
        a_first.innerHTML = entry.username;
    }
    /*S obzirom da je svaka kolona trigger za modal o detaljnijim podacima o turi/korisnicima,
     preko composedPath() funkcije saznajemo koja tabela je okinula event i na osnovu toga prikazujemo podatke
     u odgovarajucem modalu za ture/korisnike*/
    a_first.addEventListener('click', function(e){
        if(e.composedPath()[3].id == "ture_table"){
            displayData(e.composedPath()[2].id, 'ture');
        }
        else{
            displayData(e.composedPath()[2].id, 'korisnici');
        }
    });
    first.appendChild(a_first);

    let second = document.createElement('td');
    let a_second = document.createElement('a');
    a_second.classList.add('modal-trigger','block','black-text');
    a_second.href = modal_trigger;
    if(tableID == "ture_table"){
        a_second.innerHTML = entry.naziv;
    }
    else{
        a_second.innerHTML = entry.email;
    }
    a_second.addEventListener('click', function(e){

        if(e.composedPath()[3].id == "ture_table"){
            displayData(e.composedPath()[2].id, 'ture');
        }
        else{
            displayData(e.composedPath()[2].id, 'korisnici');
        }
    });
    second.appendChild(a_second);

    let third = document.createElement('td');
    let a_third = document.createElement('a');
    a_third.classList.add('modal-trigger','block','black-text');
    a_third.href = modal_trigger;
    if(tableID == "ture_table"){
        a_third.innerHTML = entry.tip;
    }
    else{
        a_third.innerHTML = entry.ime + " " + entry.prezime;
    }

    a_third.addEventListener('click', function(e){
        if(e.composedPath()[3].id == "ture_table"){
            displayData(e.composedPath()[2].id, 'ture');
        }
        else{
            displayData(e.composedPath()[2].id, 'korisnici');
        }
    });
    third.appendChild(a_third);

    tr.appendChild(first);
    tr.appendChild(second);
    tr.appendChild(third);
    document.getElementById(tableID).appendChild(tr);

}

/*Funkcija prikazuje sve podatke o turi/korisniku 
 mode je u stvari koji podatak o tome da li se zahteva prikaz podataka o korisniku ili turi
 entitity je objekt ture/korisnika sa svim njegovim podacima */
function displayData(entitity,mode){
    let toDisplay = "";
    if(mode == "ture"){
        /*Prvo nadji objekat ture koja je okinula event */
        for(let i in parsed_tours){
            for(let j in parsed_tours[i]){
                if(parsed_tours[i][j].kod == entitity){
                    toDisplay = parsed_tours[i][j];
                    break;
                }
                if(toDisplay != ""){
                    break;
                }
            }  
        }

        document.getElementById('kod-ture').value = toDisplay.kod;
        document.getElementById('naziv-ture').value = toDisplay.naziv;
        document.getElementById('adresa-polaska').value = toDisplay.adresaPolaska;
        document.getElementById('trajanje').value = toDisplay.trajanje;
        document.getElementById('kod-ture').value = toDisplay.kod;
        document.getElementById(toDisplay.tip).selected = true;
        document.getElementById("max-osoba").value = toDisplay.maxOsobe;
        document.getElementById('kratak-opis').innerHTML = toDisplay.kratakOpis;
        document.getElementById('kratak-opis').value = toDisplay.kratakOpis;
        M.textareaAutoResize(document.getElementById('kratak-opis'));
        document.getElementById('detaljan-opis').innerHTML = toDisplay.opis;
        document.getElementById('detaljan-opis').value = toDisplay.opis;
        M.textareaAutoResize(document.getElementById('detaljan-opis'))
        document.getElementById("slika").value = toDisplay.slika;
        document.getElementById("cena").value = toDisplay.cena;
        document.getElementById("prosecna-ocena").value = toDisplay.ocena;
        document.getElementById("ocene-korisnika").value = parseOcene(toDisplay.ocene);

    }
    else{

        for(let i in parsed_users){
            if (parsed_users[i].username == entitity){
                toDisplay = parsed_users[i];
                break;
            }
        }
        document.getElementById('ime').value = toDisplay.ime;
        document.getElementById('prezime').value = toDisplay.prezime;
        document.getElementById('korisnicko-ime').value = toDisplay.username;
        document.getElementById('lozinka').value = toDisplay.password;
        document.getElementById('datum-rodj').value = parseDate(toDisplay.datumRodjenja);
        document.getElementById("mail").value = toDisplay.email;
        document.getElementById('adresa').value = toDisplay.adresa;
        document.getElementById('telefon').value = toDisplay.telefon;

    }
}

/*Funkcija prikazuje ocene korisnika na "lepsi nacin" (ne kao obicnu listu) */
function parseOcene(ocene){

    let string = "";
    for(let i=(ocene.length - 1);i>=0;i--){
        string += "|" +  (i+1) + "->" + ocene[i] + "| ";
    }
    return string;
}

/*Funkcija formatira datum iz oblika yyyy-mm-dd u dd.mm.yyyy. */
function parseDate(date_string){
    let elems = date_string.split('-');
    return elems[2] + "." + elems[1] + "." + elems[0] + ".";
}

let field_list_ture = [
    document.getElementById('naziv-ture'),
    document.getElementById('adresa-polaska'),
    document.getElementById('trajanje'),
    document.getElementById('tip'),
    document.getElementById('max-osoba'),
    document.getElementById('kratak-opis'),
    document.getElementById('detaljan-opis'),
    document.getElementById('slika'),
    document.getElementById('cena')
];

for(let i = 0;i<field_list_ture.length;i++){
    field_list_ture[i].addEventListener('input', () => validateTourData(field_list_ture[i],field_list_ture,izmeni));

}

/*Funkcija validira podatke o turi
elem je element koji se validira
which_fields je lista elemenata koji se validira (za prijavu/registraciju) u kojoj se nalazi elem
which_btn je dugme koje treba da se aktivira ukoliko je korisnik uneo tacne podatke*/

function validateTourData(elem,which_fields,which_btn){
    let input = elem.value.trim();

    if(elem.type == "number"){
        if(parseInt(input) > 0){
            correct(elem);
        }
        else{
            incorrect(elem)
        }
    }

    else{
        if(input.length > 0){
            correct(elem);
        }
        else{
            incorrect(elem);
        }

        if(elem.id == 'naziv-ture'){
            if(input.length > 35){
                incorrect(elem);
            }
        }

        if(elem.id == 'adresa-polaska'){
            if(input.length > 70){
                incorrect(elem);
            }
        }

        if(elem.id == 'kratak-opis'){
            if(input.length > 500){
                incorrect(elem);
            }
        }

        if(elem.id == 'detaljan-opis'){
            if(input.length > 1000){
                incorrect(elem)
            }
        }



    }

    readyForSubmit(which_fields, which_btn);
}

/*Klik da dugme Izmeni se aktiviraju sva polja (osim koda,prosecne ocene i ocena korisnika) */
document.getElementById('izmeni').addEventListener('click', () =>{
    for(let i = 0;i<field_list_ture.length;i++){
        field_list_ture[i].classList.add('valid');
    }
    izmeniPodatke(field_list_ture,true);

    if(izmeni.innerText == "IZMENI PODATKE"){
        M.toast({html: 'Podaci uspešno izmenjeni!'});
    }

});


function resetForm(fields,izmeni){
    for(let i = 0;i<fields.length;i++){
        fields[i].disabled = true;
        if(fields[i].tagName== 'SELECT'){
            let elems_select= document.querySelectorAll('select');
            M.FormSelect.init(elems_select, {});
        }
        fields[i].classList.remove('valid');
        fields[i].classList.remove('invalid');
        document.querySelector('label[for=' + fields[i].id + ']').classList.add('active');
    }
    izmeni.disabled = false;
    izmeni.innerText = "IZMENI PODATKE";
}


