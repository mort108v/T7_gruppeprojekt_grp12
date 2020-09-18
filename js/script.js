/*Set variable for individual coins*/
let coin;

/*Set variable to later make it await response*/
let json;

/*Set variable for Pre-chosen link*/
let valgt;

/*Set constant selector for PopUp window*/
const popup = document.querySelector("#popup");

/* Set constant selector for active filter button */
let buttonActive = document.querySelector("button.filter.valgt");
console.log(buttonActive);

// Set let selector for facebook share button in popup
let fbShare = document.querySelector("#fb_share");

// Get Website URL + id and name parameters, if there.
let websiteURL = `${location.protocol}//${location.host}${location.pathname}`;

// Get website ID query as a string from the URL - if it does not exist, it will return null / undefined
const queryString = window.location.search;

// Send that query string to the URLSearchParams function, which strips the string from nothing but the name and value into an object stored in the parameters variable
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

    /*json variable used to receive and store the await response as json that Javascript understands */
    json = await respons.json();

    console.log(json);

    /* When the response is received call addEventListenerToButtons function so our filter buttons reacts on click */
    addEventListenerToButtons();

    /* Call function vis which shows our list of coins */
    vis();

    // Check if the URL has an ID which refers to one of the coins on page load
    // If no ID (coin) is defined, do not show the popup
    if (parameters.get("id") === null) {

        console.log("Vis side uden popup!")
        // If it does have an ID which refers to a coin that exist in our json, show that popup on page load.

    } else {

        // Get the id from the URL which we got earlier on load via searchUrlParams
        let idParam = parameters.get("id");

        // Find the coin in our json that matches the ID in the URL
        let thisCoin = json.feed.entry.find(coin => coin.gsx$dataid.$t === idParam);
        console.log(thisCoin);

        // Show that coin as a popup
        visDetaljer(thisCoin);

    }
}

// Show list of coins
function vis() {
    console.log("vis funktion");

    /*Set Constant Selector = templatePointer*/
    const templatePointer = document.querySelector("template");

    /*Set variable = Listpointer to = Main page list DataContainer*/
    let listPointer = document.querySelector(".data-container");

    /*Clear pointer inner HTML*/
    listPointer.innerHTML = "";

    // Check if the button clicked is the name button via the filter variable
    if (filter == "name") {
        console.log(filter);

        // If the button has already been clicked once and the list has been sorted already in names from A to Z, reverse the list and show it Z to A (descending)
        if (buttonActive.classList.contains("is-clicked")) {
            console.log("Descending");

            //Reverse the json list
            json.feed.entry.reverse();

            // Remove the is-clicked class from the button, so next time if you click on it, it sorts from A to Z again
            buttonActive.classList.remove("is-clicked");
        } else {
            console.log("Ascending");

            // Add is-clicked class to the button, so next time it is clicked, it will reverse the list to Z to A
            buttonActive.classList.add("is-clicked");

            // Sort from A to Z
            json.feed.entry.sort(function (a, b) {

                // Here we use dataname from our sheet, because we want to sort by the coin name
                var nameA = a.gsx$dataname.$t.toUpperCase(); // ignore upper and lowercase
                var nameB = b.gsx$dataname.$t.toUpperCase(); // ignore upper and lowercase

                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                return 0;

            });
        }
        // Check if the button clicked is the price button via the filter variable
    } else if (filter == "price") {
        console.log(filter);

        // If the button has already been clicked once and the list has been sorted already in price from high to low, reverse the list and show it from low to high (descending)
        if (buttonActive.classList.contains("is-clicked")) {
            console.log("Descending");

            // Reverse the list low to high
            json.feed.entry.reverse();

            // Remove the is-clicked class from the button, so next time if you click on it, it sorts from High to low again
            buttonActive.classList.remove("is-clicked");
        } else {
            console.log("Ascending");

            // Add is-clicked class to the button, so next time it is clicked, it will reverse the list low to high
            buttonActive.classList.add("is-clicked");

            //Sort the list high to low
            json.feed.entry.sort(function (a, b) {

                // Our data numbers from sheets is in commas instead of dots, which is what javascript uses, to know what is a decimal, so we replace the commas with dots in our string
                var numberA = a.gsx$dataquoteusdprice.$t.replace(",", ".");
                var numberB = b.gsx$dataquoteusdprice.$t.replace(",", ".");

                // Our numbers needs to be real numbers in Javascript and not strings with numbers as text, so with parseFloat we convert it from a string to a real number with decimals, so we can compare them
                numberA = parseFloat(numberA);
                numberB = parseFloat(numberB);

                //Return the result
                return numberB - numberA;
            });
        }
        // Check if the button clicked is the change button via the filter variable
    } else if (filter == "change") {
        console.log(filter);

        // If the button has already been clicked once and the list has been sorted already in 24 hour price change in percent from high to low, reverse the list and show it from low to high (descending)
        if (buttonActive.classList.contains("is-clicked")) {
            console.log("Descending");

            //Reverse the list low to high
            json.feed.entry.reverse();

            // Remove the is-clicked class from the button, so next time if you click on it, it sorts from High to low again
            buttonActive.classList.remove("is-clicked");
        } else {
            console.log("Ascending");

            // Add is-clicked class to the button, so next time it is clicked, it will reverse the list Z to A
            buttonActive.classList.add("is-clicked");

            // Sort the list high to low
            json.feed.entry.sort(function (a, b) {

                // Our data numbers from sheets is in commas instead of dots, which is what javascript uses, to know what is a decimal, so we replace the commas with dots in our string
                var numberA = a.gsx$dataquoteusdpercentchange24h.$t.replace(",", ".");
                var numberB = b.gsx$dataquoteusdpercentchange24h.$t.replace(",", ".");

                // Our numbers needs to be real numbers in Javascript and not strings with numbers as text, so with parseFloat we convert it from a string to a real number with decimals, so we can compare them
                numberA = parseFloat(numberA);
                numberB = parseFloat(numberB);

                // Return the result
                return numberB - numberA;

            });
        }
        // else show all coins
    } else {
        console.log(filter);

        // If the button has already been clicked once and the list has been sorted already in rank (marketcap) from high to low, reverse the list and show it from low to high (descending)
        if (buttonActive.classList.contains("is-clicked")) {
            console.log("Descending");

            //Reverse the list Z to A
            json.feed.entry.reverse();

            // Remove the is-clicked class from the button, so next time if you click on it, it sorts from A to Z again
            buttonActive.classList.remove("is-clicked");

        } else {
            console.log("Ascending");

            // Add is-clicked class to the button, so next time it is clicked, it will reverse the list low to high
            buttonActive.classList.add("is-clicked");

            // Sort the list by rank from highest rank to lowest rank
            json.feed.entry.sort(function (a, b) {
                // Return the result, but before that convert the cmcrank data from the sheet from a string to an integer (number without decimals) so we can compare them
                return parseInt(a.gsx$datacmcrank.$t) - parseInt(b.gsx$datacmcrank.$t);
            });
        }
    }

    //Run through array of coins and sort by whatever was chosen above with the filter if statement
    json.feed.entry.forEach(coin => {

        /*Set image URL for all coin Logos*/
        let imageUrl = "https://s2.coinmarketcap.com/static/img/coins/64x64/";

        /*Set Constant Klon to use in Template*/
        const klon = temp.cloneNode(true).content;

        /*Klon used to input data from JSON into given Classes*/
        klon.querySelector(".rank").textContent = coin.gsx$datacmcrank.$t;
        klon.querySelector(".coin_logo").src = `${imageUrl}${coin.gsx$dataid.$t}.png`;
        klon.querySelector(".coin_logo").alt = coin.gsx$dataname.$t;
        klon.querySelector("#full-name").textContent = coin.gsx$dataname.$t;
        klon.querySelector("#datasymbol").textContent = coin.gsx$datasymbol.$t;

        // Our data numbers from sheets is in commas instead of dots, which is what javascript uses, to know what is a decimal, so we replace the commas with dots in our string
        let usdPrice = coin.gsx$dataquoteusdprice.$t.replace(",", ".");

        // The price got many decimals, so if the price is lower than 0.009, then we want to display six decimal and if it's a bigger number like 10.000, then we only want to display to decimals.
        if (usdPrice < 0.009) {
            // Converts the price to a number with decimals and rounds up so we only have 6 decimals
            usdPrice = parseFloat(usdPrice).toFixed(6);
        } else {
            // Converts the price to a number with decimals and rounds up so we only have 2 decimals
            usdPrice = parseFloat(usdPrice).toFixed(2);
        }

        //Display the price on the screen
        klon.querySelector(".value").textContent = "$" + usdPrice;

        // Get the 24h percent price change. Our data numbers from sheets is in commas instead of dots, which is what javascript uses, to know what is a decimal, so we replace the commas with dots in our string
        let percentChange24H = coin.gsx$dataquoteusdpercentchange24h.$t.replace(",", ".");

        // Then we convert the string to a number with decimals, and limits the number to 2 decimals.
        percentChange24H = parseFloat(percentChange24H).toFixed(2);

        // Then we check if the percent change is higher, lower or equal to 0
        if (percentChange24H > 0) {
            // Add is-positive class to the 24h hour price change in percent so it is green if the number is positive
            klon.querySelector(".change").classList.add("is-positive");
        } else if (percentChange24H < 0) {
            // Add is-negative class to the 24h hour price change in percent so it is red if the number is positive
            klon.querySelector(".change").classList.add("is-negative");
        } else {
            // Add is-null class to the 24h hour price change in percent if the number is zero
            klon.querySelector(".change").classList.add("is-null");
        }

        // Display the 24h percent change in price on the screen
        klon.querySelector(".change").textContent = `${percentChange24H}%`;

        /*Listen for Click and send to detailed info article function*/
        klon.querySelector("article").addEventListener("click", () => visDetaljer(coin));

        /*Append child to ListPointer forward Klon Constant along*/
        listPointer.appendChild(klon);
    });
}

/*Select #luk button ID - listen for Click and give it style = display none*/
document.querySelector("#luk").addEventListener("click", () => {

    //Remove / Reset the open popup crypto currency ID from the URL
    parameters.delete("id");
    history.pushState(null, null, websiteURL);

    // Hide popup
    popup.style.display = "none";
});

// Show popup
function visDetaljer(coin) {
    console.log(coin);

    popup.querySelector(".change").classList.remove("is-positive");
    popup.querySelector(".change").classList.remove("is-negative");
    popup.querySelector(".change").classList.remove("is-null");

    // Define where the coin images are stored
    let imageUrl = "https://s2.coinmarketcap.com/static/img/coins/128x128/";

    /*Popup used to input data from JSON into given Classes*/
    popup.querySelector(".rank").textContent = "Rank: " + coin.gsx$datacmcrank.$t;
    popup.querySelector("h3").textContent = coin.gsx$dataname.$t;
    popup.querySelector(".coin_logo").src = `${imageUrl}${coin.gsx$dataid.$t}.png`;
    popup.querySelector(".coin_logo").alt = coin.gsx$dataname.$t;
    popup.querySelector(".value").textContent = "$" + coin.gsx$dataquoteusdprice.$t;
    popup.querySelector(".cs").textContent = " " + coin.gsx$datacirculatingsupply.$t;
    popup.querySelector(".mc").textContent = "$" + coin.gsx$dataquoteusdmarketcap.$t;
    popup.querySelector(".volume").textContent = "$" + coin.gsx$dataquoteusdvolume24h.$t;


    // Get the 24h percent price change. Our data numbers from sheets is in commas instead of dots, which is what javascript uses, to know what is a decimal, so we replace the commas with dots in our string
    let percentChange24H = coin.gsx$dataquoteusdpercentchange24h.$t.replace(",", ".");

    // Then we convert the string to a number with decimals, and limits the number to 2 decimals.
    percentChange24H = parseFloat(percentChange24H).toFixed(2);

    // Then we check if the percent change is higher, lower or equal to 0
    if (percentChange24H > 0) {
        // Add is-positive class to the 24h hour price change in percent so it is green if the number is positive
        popup.querySelector(".change").classList.add("is-positive");
    } else if (percentChange24H < 0) {
        // Add is-negative class to the 24h hour price change in percent so it is red if the number is positive
        popup.querySelector(".change").classList.add("is-negative");
    } else {
        // Add is-null class to the 24h hour price change in percent if the number is zero
        popup.querySelector(".change").classList.add("is-null");
    }

    // Display the 24h percent change in price on the screen
    popup.querySelector(".change").textContent = `${percentChange24H}%`;

    // Set the ID of the coin as a parameter in our parameter variable
    parameters.set("id", coin.gsx$dataid.$t);

    // Then use the pushstate function to update the URL in real time, so the new id is displayed, so you can share the link to a specific coin to your friends and family, where the popup of the specific coin you share, automatically pops up, when you open the page.
    history.pushState(null, null, "?" + parameters.toString());

    // Set the fbShare buttons URL + parameters to the share on facebook / share link
    fbShare.href = 'http://www.facebook.com/share.php?u=' + location.host + location.pathname + location.search + '&t=' + coin.gsx$dataname.$t;

    // Show popup
    popup.style.display = "block";
}

/*Function to listen for click on each filter button and send on to filter function*/
function addEventListenerToButtons() {
    // Loop through each filter button
    document.querySelectorAll(".filter").forEach((btn) => {
        // Add on click eventlistener to the button -> filterBTNs()
        btn.addEventListener("click", filterBTNs);
    });
}

// If one of the filter buttons are clicked
function filterBTNs() {
    console.log("filterBTNs!");

    // If the button clicked is not the button that just got clicked, then..
    if (filter != this.dataset.coin) {
        console.log("filter != to dataset");

        // Set the filter to what button is clicked
        filter = this.dataset.coin;

        // Loop through all filter buttons
        document.querySelectorAll(".filter").forEach((btn) => {
            // Remove valgt class from button
            btn.classList.remove("valgt");

            // Remove is-clicked class from button, so if it is clicked immediately again, then we can check for that with .contains in our vis() function
            btn.classList.remove("is-clicked");
        });
    }

    // Add valgt class to the button that is clicked
    this.classList.add("valgt");

    //Set the clicked button
    buttonActive = document.querySelector("button.filter.valgt");

    // Show list of coins sorted by whatever button is clicked on
    vis();
    console.log(buttonActive);
}
