let chosen_city = url.split("?")[1].split('=')[1];    //procitaj grad koji je zahtevan
let all_tours_per_city = [];
let tours_info = "";
let city_name = "";
let request_city = new XMLHttpRequest();
let request_tours = new XMLHttpRequest();
let redirect = "";

/*Dobavi ture za trazeni grad*/ 
request_city.open("GET", firebase_url + "/gradovi/" + chosen_city +  ".json");
    
request_city.onreadystatechange = function(){
    if (this.readyState == 4){
        if (this.status == 200){
            let parsed = JSON.parse(request_city.responseText);
            tours_info = parsed.idAtrakcija;
            city_name = parsed.naziv;
            redirect = 'city-all.html?city=' + city_name + '&tours=' + tours_info;
            document.getElementById('naslov').innerHTML = "Preporučene ture (" + city_name + "):";
            /*Dobavi set tura koje pripadaju trazenom gradu */
            request_tours.open("GET", firebase_url + "/turistickeAtrakcije/" + tours_info + ".json");
            request_tours.send();
        }
        
        else{
            alert("Greška!");
        }
    }
};

request_city.send();

request_tours.onreadystatechange = function(){
    if(this.readyState == 4){
        if(this.status == 200){
            let cities = JSON.parse(request_tours.responseText);

            for(let id in cities){
                all_tours_per_city.push(cities[id]);
            }
            /*Prvo sortiraj sve ture za grad po prosecnoj oceni */
            all_tours_per_city.sort((a,b) => b.ocena - a.ocena); 

            /*Fiksno se prikazuje 4 preporucenih tura za grad (top 4 iz sortirane liste tura) */

            /*Ukoliko grad ima manje tura od 4 (u nasem slucaju ne, ali pokriven je slucaj) */
            if (all_tours_per_city.length < 4){
                for(let j = 0; j< all_tours_per_city.length ; j++){
                    createCarouseItem(all_tours_per_city[j]);
                }
            }
            /*Inace se kreira fiksno 4 tura */
            else{
                for(let i = 0; i < 4; i++){
                    createCarouseItem(all_tours_per_city[i]);
                }
            }

            /*inicijalizacija slider elemenata koji se dinamicki prave*/
            let elems_slider = document.querySelectorAll('.slider');
            let instances_slider = M.Slider.init(elems_slider, {height:600});

            /*nicijalizacija tooltipova dinamicki stvorenih slajdova*/
            let elems_tooltip_dynamic = document.querySelectorAll('.tooltipped');
            let instances_tooltip = M.Tooltip.init(elems_tooltip_dynamic, {});
  
        }
    } 
};

/*Funkcija kreira slajdove preporucenih tura */
function createCarouseItem(tour){
    let item = document.createElement('li');

    item.classList.add('tooltipped');
    item.dataset.position = "top";
    item.dataset.tooltip = "Pogledaj";
    item.id = tour.kod;


    let tour_info = document.createElement('a');
    tour_info.href = "#modal-tour";
    tour_info.classList.add('modal-trigger');

    let image = document.createElement('img');
    image.src = tour.slika;
    image.alt = tour.naziv;

    let caption_wrapper = document.createElement('div');
    caption_wrapper.classList.add('caption','left-align');

    let caption = document.createElement('h3');
    caption.classList.add('resize-font');
    caption.innerHTML = tour.naziv;

    let duration = document.createElement('h5');
    duration.classList.add('light','grey-text','text-lighten-3');
    duration_time = parseTime(tour.trajanje);
    duration.innerHTML = duration_time;


    caption_wrapper.appendChild(caption);
    caption_wrapper.appendChild(duration);

    tour_info.appendChild(image);
    tour_info.appendChild(caption_wrapper);
    item.appendChild(tour_info);

    document.getElementById('slides').appendChild(item);
}


/*Klik na slajd otvara modal sa najosnovnijim informacijama o preporucenoj turi */
document.getElementById('slides').addEventListener('click', function(e){
    let tour_code = e.composedPath()[2].id;

    /*Namesta se sadrzaj modala u odnosu na kliknutu turu */
    let the_tour = all_tours_per_city.find(el => el.kod === tour_code);
    document.getElementById('tura_ime').innerHTML = the_tour.naziv;
    let image = document.getElementById('img');
    image.alt = the_tour.naziv;
    image.src = the_tour.slika;
    document.getElementById('kratak_opis').innerHTML = the_tour.kratakOpis;
    document.getElementById('cena').innerHTML = "Cena po osobi: " + the_tour.cena + "din";

    /*Ukoliko se klikne na dugme Pogledaj detalje, 
    korisnik se premesta na stranicu gde se nalaze sve ture odabranog grada
     gde se otvara kartica sa svim podacima o odabranoj*/
    document.getElementById('details').addEventListener('click', function(){
    window.location = redirect + "&active=" + the_tour.kod;
    });
});

/*Klik na dugme pogledaj celu ponudu vodi korisnika na stranicu za sve ture grada (bez otvaranja neke kartice) */
document.getElementById('btnAll').addEventListener('click', function(){
    window.location = redirect;
});









    






