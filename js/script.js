/*Set variable for individual coins*/
let coin;
/*Set variable to later make it await response*/
let json;
/*Set variable for Pre-chosen link*/
let valgt;
/*Set constant selector for PopUp window*/
const popup = document.querySelector("#popup");

// Website url parameters

let websiteURL = `${location.protocol}//${location.host}${location.pathname}`;

const queryString = window.location.search;

let parameters = new URLSearchParams(queryString);

/*Check to see if document is loaded*/
document.addEventListener("DOMContentLoaded", loadJSON);
/*Set variable for template in main window*/
let temp = document.querySelector("template");
/*Set variable that shows all coins by filter*/
let filter = "all_coins";
/*Set constant spreadsheet link*/
const link = "https://spreadsheets.google.com/feeds/list/18iieVrq6h4GAoX0n6T6fiDPvUiCsxPtFpQCkQrkeE5Y/1/public/full?alt=json";

/*Using the Async function to "promise" a return so the script doesn't stop*/
async function loadJSON() {
    /*The Constant that promises to fetch the link*/
    const respons = await fetch(link);
    /*json variable used to await response*/
    json = await respons.json();
    /*Call function*/
    addEventListenerToButtons();
    /*Call function*/
    vis();
}

function vis() {

    /*Set Constant Selector = templatePointer*/
    const templatePointer = document.querySelector("template");
    /*Set variable = Listpointer to = Main page list DataContainer*/
    let listPointer = document.querySelector(".data-container");
    /*Clear pointer inner HTML*/
    listPointer.innerHTML = " ";

    //Run through array of coins
    json.feed.entry.forEach(coin => {

        /*Set image URL for all coin Logos*/
        let imageUrl = "https://s2.coinmarketcap.com/static/img/coins/64x64/";

        /*Set condition to lowercase if "All Coins" filter is chosen*/
        if (filter == "all_coins" || filter == coin.gsx$all_coins.$t.toLowerCase()) {

            /*Set Constant Klon to use in Template*/
            const klon = temp.cloneNode(true).content;

            /*Klon used to input data from JSON into given Classes*/
            klon.querySelector(".rank").textContent = " No. " + coin.gsx$datacmcrank.$t;
            klon.querySelector("h3").textContent = coin.gsx$dataname.$t;
            klon.querySelector(".value").textContent = " $ " + coin.gsx$dataquoteusdprice.$t;
            klon.querySelector(".coin_logo").src = `${imageUrl}${coin.gsx$dataid.$t}.png`;

            /*Listen for Click and send to detailed info article function*/
            klon.querySelector("article").addEventListener("click", () => visDetaljer(coin));

            /*Append child to ListPointer forward Klon Constant along*/
            listPointer.appendChild(klon);
        }
    });

    if (parameters.get("id") === null) {
        console.log("Vis side uden popup!")
    } else {
        let idParam = parameters.get("id");

        let thisCoin = json.feed.entry.find(x => x.gsx$dataid.$t === idParam);
        console.log(thisCoin)
        visDetaljer(thisCoin);
    }
}

document.querySelector("#luk").addEventListener("click", () => {
    parameters.delete("id");
    history.pushState(null, null, websiteURL);
    popup.style.display = "none";
});

/*Select #luk button ID - listen for Click and give it style = display none*/
document.querySelector("#luk").addEventListener("click", () => popup.style.display = "none");

function visDetaljer(coin) {
    console.log(coin);

    let imageUrl = "https://s2.coinmarketcap.com/static/img/coins/128x128/";

    popup.style.display = "block";

    popup.querySelector(".rank").textContent = " " + coin.gsx$datacmcrank.$t;
    popup.querySelector("h3").textContent = coin.gsx$dataname.$t;
    popup.querySelector(".coin_logo").src = `${imageUrl}${coin.gsx$dataid.$t}.png`;
    popup.querySelector(".value").textContent = " $ " +
        coin.gsx$dataquoteusdprice.$t;
    popup.querySelector(".cs").textContent = " " + coin.gsx$datacirculatingsupply.$t;
    popup.querySelector(".mc").textContent = " $ " + coin.gsx$dataquoteusdmarketcap.$t;
    popup.querySelector(".volume").textContent = " $ " + coin.gsx$dataquoteusdvolume24h.$t;
    popup.querySelector(".change").textContent = " % " + coin.gsx$dataquoteusdpercentchange24h.$t;

    parameters.set("id", coin.gsx$dataid.$t);
    console.log(coin.gsx$dataid.$t)

    history.pushState(null, null, "?" + parameters.toString());

    popup.style.display = "block";
}

/*Function to listen for click on each filter button and send on to filter function*/
function addEventListenerToButtons() {
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.addEventListener("click", filterBTNs);
    });
}

/*Function to . . . . . Er der ik' noget off her???*/
function filterBTNs() {
    filter = this.dataset.coin;
//    document.querySelector("h1").textContent = this.textContent;
    document.querySelectorAll(".filter").forEach((btn) => {
        btn.classList.remove("valgt");
    });
    this.classList.add("valgt");
    vis();
}

/*Load async JSON function*/
loadJSON();