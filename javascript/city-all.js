document.addEventListener('DOMContentLoaded', function() {
    /*Dugme za kontakt vidljivo samo na -600px sa leve strane*/
    let elems = document.querySelectorAll('.fixed-action-btn');
    let instances = M.FloatingActionButton.init(elems,{});

    let elems_scrollspy = document.querySelectorAll('.scrollspy');
    let instances_scrollspy = M.ScrollSpy.init(elems_scrollspy, {});
  });

/*kopiranje telefona ili email adrese na city-all stranici*/
document.getElementById("btn-phone").addEventListener('click', () => toClipboard('phone-number'));
document.getElementById("btn-email").addEventListener('click', () => toClipboard('email-address'));
document.getElementById("btn-phone-small").addEventListener('click', () => toClipboard('phone-number'));
document.getElementById("btn-email-small").addEventListener('click', () => toClipboard('email-address'));

function toClipboard(text_to_copy){
    let elem = document.getElementById(text_to_copy).innerHTML;
    let input = document.createElement('input');
    input.value = elem;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

let parameters = url.split('?')[1].split('&');
let city_name = parameters[0].split('=')[1];
let tours_id = parameters[1].split('=')[1];
/*Ukoliko korisnik nije zahtevao detalje o nekoj od preporucenih tura sa prethodne stranice */
let active = "";
if(parameters.length == 3){
    active = parameters[2].split('=')[1];
}

document.getElementById('naslov').innerHTML = "Sve ture (" + city_name + "):";

/*Dobavi sve ture trazenog grada */
let request_all_tours = new XMLHttpRequest();
request_all_tours.open('GET', firebase_url + "/turistickeAtrakcije/" + tours_id + ".json");

request_all_tours.onreadystatechange = function(){
    if (this.readyState == 4){
        if (this.status == 200){
            let parsed = JSON.parse(request_all_tours.responseText);
            for(let tour in parsed){
                createAccordionItem(parsed[tour]);
            }

            /*Ukoliko su zahtevani detalji o nekoj turi na prethodnoj stranici, treba otvoriti tu sekciju */
            if(active != ""){
                let open_index = 0;
                let header_list = document.getElementsByClassName('tura');
                for(let i =0;i<header_list.length;i++){
                    if(header_list[i].id == active){
                        open_index = i;
                    }
                }
                let elem = document.getElementById('tour-list');
                let toOpen = M.Collapsible.getInstance(elem);
                document.getElementById(active).scrollIntoView();
                toOpen.open(open_index);
            }
        }      
        else{
            alert("Greška!");
        }
    }
};
request_all_tours.send();

/*Pomocne funkcije za kreiranje podelemenata accordionItem-a (padajuce liste sa svim podacima o turi) */

function createRow(){
    let row = document.createElement('div');
    row.classList.add('row','no-bottom-margin','margin-fixed');
    return row;
}

function createIcon(icon_text){
    let icon = document.createElement('i');
    icon.classList.add('material-icons','medium-size-icon','margin-right-icon');
    icon.innerHTML = icon_text;
    return icon;
}

function createDiv(...classList){
    let div = document.createElement('div');
    div.classList.add(...classList);
    return div;
}

function createH4(text){
    let h4 = document.createElement('h4');
    h4.innerHTML = text;
    return h4;
}


function createSpan(text){
    let span = document.createElement('span');
    span.classList.add('smaller-font');
    span.innerHTML = text;
    return span;
}

function createParagraph(...classList){
    let paragraph = document.createElement('p');
    paragraph.classList.add(...classList);
    return paragraph;
}

function createMarkBar(mark,percent){
    let bar_cont = createDiv('flex-container','justify-center','progress-margin-bottom');
    let mark_text = createDiv('size-large');
    mark_text.innerHTML = "<b>" + mark + ":</b>";
    let progress = createDiv('progress');
    let progress_bar = createDiv('determinate');
    progress_bar.style = "width:" + percent + "%";
    progress.appendChild(progress_bar);
    let percent_text = createDiv('margin-left-1em','width-1em');
    percent_text.innerHTML = "<b>" + percent + "%</b>";
    bar_cont.appendChild(mark_text);
    bar_cont.appendChild(progress);
    bar_cont.appendChild(percent_text);
    return bar_cont;
}

/*Funkcija racuna zbir svih ocena ture */
function sumMarks(markList){
    return markList.reduce((a,b) => a+b);
}

/*Funkcija pretvara broj glasove jedne ocene u procente */
function percentate(allMarks,currentMark){
    return Math.round((currentMark * 100) / allMarks);
}

/*Funkcija kreira accordionItem */
function createAccordionItem(tour){
    let accordion_item = document.createElement('li');
    accordion_item.classList.add('tura');
    accordion_item.id = tour.kod;

    let coll_header = createDiv('collapsible-header');

    let header_text = createDiv('width-100','text-size-tour','break-words');
    header_text.innerHTML = "<b>" + tour.naziv + "</b> - " + tour.tip.toLowerCase();

    let arrow_down = createIcon('keyboard_arrow_down');

    coll_header.appendChild(header_text);
    coll_header.appendChild(arrow_down);

    let coll_body = createDiv('collapsible-body');

    let tour_img = document.createElement('img');
    tour_img.src = tour.slika;
    tour_img.classList.add('width-60');
    tour_img.alt = tour.naziv;

    let br = document.createElement('br');

    coll_body.appendChild(tour_img);
    coll_body.appendChild(br);

    let first_row = createRow();

    let col_duration = createDiv('col','s6');

    let h4_dur = createH4('Trajanje:');

    let dur_content = createDiv('flex-container','justify-center');

    dur_icon = createIcon('access_time');

    let dur_text = createSpan(parseTime(tour.trajanje));

    dur_content.appendChild(dur_icon);
    dur_content.appendChild(dur_text);

    col_duration.appendChild(h4_dur);
    col_duration.appendChild(dur_content);


    let col_address = createDiv('col','s6','margin-on-resize');

    let h4_add = createH4('Adresa polaska:')

    let add_content = createDiv('flex-container','justify-center');

    add_icon = createIcon('home');

    let add_text = createSpan(tour.adresaPolaska);

    add_content.appendChild(add_icon);
    add_content.appendChild(add_text);

    col_address.appendChild(h4_add);
    col_address.appendChild(add_content);

    first_row.appendChild(col_duration);
    first_row.appendChild(col_address);

    coll_body.appendChild(first_row);

    let second_row = createRow();
    let people_count = createDiv('col','s12');
    let pc_content = createDiv('flex-container','justify-center');
    let pc_icon = createIcon('people');
    let pc_h4 = createH4('Maksimalan broj osoba:');
    let pc_text = createSpan(tour.maxOsobe);
    pc_content.appendChild(pc_icon);
    pc_content.appendChild(pc_text);

    people_count.appendChild(pc_h4);
    people_count.appendChild(pc_content);
    second_row.appendChild(people_count);

    coll_body.appendChild(second_row);


    let third_row = createRow();
    let desc = createDiv('col','s12');
    let desc_content = createDiv('flex-container','justify-center');
    let desc_icon = createIcon('edit');
    let desc_h4 = createH4('Detaljan opis:');
    desc_content.appendChild(desc_icon);
    desc_content.appendChild(desc_h4);
    desc.appendChild(desc_content);
    let desc_paragraph = createParagraph('no-bottom-margin','do-font');
    desc_paragraph.innerHTML = tour.opis;
    desc.appendChild(desc_paragraph);
    third_row.appendChild(desc);

    coll_body.appendChild(third_row);

    let fourth_row = createRow();
    let price = createDiv('col','s12');
    let price_h4 = createH4('Cena po osobi:');
    let price_content = createDiv('flex-container','justify-center');
    let price_icon = createIcon('attach_money');
    let price_span = createSpan(tour.cena + "din");
    price_content.appendChild(price_icon);
    price_content.appendChild(price_span);
    price.appendChild(price_h4);
    price.appendChild(price_content);
    fourth_row.appendChild(price);

    coll_body.appendChild(fourth_row);

    let all_marks = sumMarks(tour.ocene);
    let fifth_row = createRow();
    let mark = createDiv('col','s12');
    let mark_h4 = createH4('Prosečna ocena:');
    let mark_content = createDiv('flex-container','justify-center');
    let mark_icon = createIcon('star_border');
    let average_mark = createH4(tour.ocena);
    average_mark.classList.add('rating');
    let according_to = createParagraph('smaller-font','margin-left');
    according_to.innerHTML = "na osnovu <b>" + all_marks + "</b> ocena korisnika";
    mark_content.appendChild(mark_icon);
    mark_content.appendChild(average_mark);
    mark_content.appendChild(according_to);

    let five = createMarkBar(5, percentate(all_marks,tour.ocene[4]));
    let four = createMarkBar(4, percentate(all_marks,tour.ocene[3]));
    let three = createMarkBar(3, percentate(all_marks,tour.ocene[2]));
    let two = createMarkBar(2, percentate(all_marks,tour.ocene[1]));
    let one = createMarkBar(1, percentate(all_marks,tour.ocene[0]));

     mark.appendChild(mark_h4);
     mark.appendChild(mark_content);
    
    mark.appendChild(five);
    mark.appendChild(four);
    mark.appendChild(three);
    mark.appendChild(two);
    mark.appendChild(one); 

    fifth_row.appendChild(mark);
    coll_body.appendChild(fifth_row);

    accordion_item.appendChild(coll_header);
    accordion_item.appendChild(coll_body);
    document.getElementById('tour-list').appendChild(accordion_item);
}

/*Linkovi navigacije scrollspy-a sa desne strane (na pocetnu je stavljen href atribut u HTML kodu) */
document.getElementById('preporucene').innerHTML = "Preporučene ture (" + city_name + ")";
document.getElementById('preporucene').addEventListener('click', function(){history.back()});
document.getElementById('current').innerHTML = "Sve ture (" + city_name + ")";
