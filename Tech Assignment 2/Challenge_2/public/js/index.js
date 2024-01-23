let stock1 = document.getElementById("stock1");
let stock2 = document.getElementById("stock2");
let stock3 = document.getElementById("stock3");

let error1 = document.getElementById("error1");
let error2 = document.getElementById("error2");
let error3 = document.getElementById("error3");

// load once all the elements are loaded into DOM
document.addEventListener('DOMContentLoaded', function() {
    stock1.addEventListener("input", function(e){
        error1.innerText = "";
    });
    stock2.addEventListener("input", function(e){
        error2.innerText = "";
    });
    stock3.addEventListener("input", function(e){
        error3.innerText = "";
    });
});

// check if it is a valid ticker (REGEX)
function valid_ticker(txt){
    const pattern = /^\$?[a-zA-Z0-9.]+$/;
    return pattern.test(txt);
}

// validate the request if the tickers are correct
function verify_submit(){
    const v1 = valid_ticker(stock1.value);
    const v2 = valid_ticker(stock2.value);
    const v3 = valid_ticker(stock3.value);

    if (v1 && v2 && v3){
        return true;
    }

    // notify which one is giving an error
    if (!v1){
        console.log("error1");
        error1.innerText = "Invalid Ticker";
    }
    if (!v2){
        console.log("error2");
        error2.innerText = "Invalid Ticker";
    }
    if (!v3){
        console.log("error3");
        error3.innerText = "Invalid Ticker";
    }

    return false;
}