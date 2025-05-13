/*Dobavi sve dostupne gradove iz firebase-a*/ 
let request = new XMLHttpRequest();
    request.onreadystatechange = function(){
        if (this.readyState == 4){
            if (this.status == 200){
                let all_cities = JSON.parse(request.responseText);
                for(let city_id in all_cities){
                    createCard(all_cities[city_id],city_id);
                }
                 /*s obzirom da ce se tooltip iz javascript.js fajla inicijalizovati pre kreiranja kartica, potrebno je zasebno inicijalizovati
                 tooltipove za kartice nakon njihovog kreiranja */
                let elems_tooltip = document.querySelectorAll('.tooltipped');
                M.Tooltip.init(elems_tooltip, {});
            }
            else{
                alert("Greška!");
            }
        }
    }  

    request.open("GET", firebase_url + "/gradovi.json");
    request.send();

/*Funkcija koja stvara pojedinacne kartice sa turama*/

function createCard(city,city_id){
    let column = document.createElement('div');
    column.classList.add('col','m4');

    let card = document.createElement('div');
    card.classList.add('card');
    card.id = city_id;

    let image_container = document.createElement('div');
    image_container.classList.add('card-image');

    let image = document.createElement('img');
    image.src = city.slika;
    image.alt = city.naziv;

    let link = document.createElement('a');
    link.classList.add('btn-floating','halfway-fab', 'waves-effect', 'waves-light', 'dark-pink', 'tooltipped');
    link.id = "city_more";
    link.href = "city.html?city=" + city_id;

    link.dataset.position = "top";
    link.dataset.tooltip = "Prikaži sve ture";

    let icon = document.createElement('i');
    icon.classList.add('material-icons');
    icon.innerText = "add";

    link.appendChild(icon);
    image_container.appendChild(image);
    image_container.appendChild(link);

    let card_content = document.createElement('div');
    card_content.classList.add('card-content');

    let city_name = document.createElement('span');
    city_name.classList.add('card-title');
    city_name.innerText = city.naziv;

    let tours_num = document.createElement('h6');
    tours_num.innerText = "Broj tura: " + city.brojAtrakcija;
    
    card_content.appendChild(city_name);
    card_content.appendChild(tours_num);

    card.appendChild(image_container);
    card.appendChild(card_content);

    column.appendChild(card);

    document.getElementById('gradovi').appendChild(column);
}






































