const bankBalanceElement = document.getElementById("currentBankBalance");
const workBalanceElement = document.getElementById("currentWorkBalance");
const loanBalanceElement = document.getElementById("currentLoanBalance");
const laptopTitleElement = document.getElementById("laptopTitle");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopImageElement = document.getElementById("laptopImage");
const laptopPriceElement = document.getElementById("laptopPrice");
const laptopFeaturesElement = document.getElementById("laptopFeatures");

const loanButtonElement = document.getElementById("loanButton");
const workButtonElement = document.getElementById("workButton");
const bankButtonElement = document.getElementById("bankButton");
const loanPayButtonElement = document.getElementById("loanPayButton");
const laptopBuyButtonElement = document.getElementById("laptopBuyButton");


const laptopsSelectElement = document.getElementById("laptops");

let bankBalance = 100;

let workBalance = 0;
let wage = 100;

let loanStatus = false;
let loanAmount;
updateBankBalance(bankBalance);
updateWorkBalance(workBalance);
loadLaptops();
/**
 * Displays a popup that gets user input to try to get a loan, if requirements are met (loan shouldn't be more than double the amount in bank and you can only have one ongoing loan)
 */
loanButtonElement.onclick = function(){

    loan = window.prompt("Enter Loan Amount");

    if(loan <= (bankBalance * 2) && loanStatus == false ){
        loanAmount = parseInt(loan);
        loanStatus = true;
        bankBalance = Math.round(bankBalance + loanAmount);

        updateBankBalance(bankBalance);
        updateLoanBalance(loanAmount);

        alert("Loan granted!");
    }
    else{

        alert("You exceeded your loan amount or you already have an unpaid loan");

    }
};
/**
 * adds wage to workbalance on workButton click
 */
workButtonElement.onclick = function(){
    workBalance = workBalance + wage;
    updateWorkBalance(workBalance);
}
/** 
 * Sends money back to the bank and uses 10% of the workBalance to pay of ongoing loan
*/
bankButtonElement.onclick = function(){

    if(loanStatus == true){
        let oldLoan = loanAmount;
        loanAmount = loanAmount - (workBalance / 10);

        if(loanAmount <= 0){
            bankBalance = ((bankBalance + workBalance) - oldLoan) + loanAmount;
            loanAmount = 0;
            workBalance = 0;
            loanStatus = false;
            loanPayButtonElement.style.display = "none";
            updateBankBalance(bankBalance);
        }
        else{
            bankBalance = ((bankBalance + workBalance) - oldLoan) + loanAmount;
            workBalance = 0;
            updateBankBalance(bankBalance);
        }
    }
    else{

        bankBalance = bankBalance + workBalance;
        workBalance = 0;
        updateBankBalance(bankBalance);
    }

    updateLoanBalance(loanAmount);

    updateWorkBalance(workBalance);
}
/**
 * Reduces LoanAmount with the workbalance to pay off the ongoing loan
 */
loanPayButtonElement.onclick = function(){

    let oldLoan = loanAmount;

    loanAmount = loanAmount - workBalance;


    if(loanAmount <= 0 ){
        bankBalance = bankBalance - oldLoan;
        bankBalance = bankBalance - loanAmount;
        loanStatus = false;
        loanPayButtonElement.style.display = "none";
    }
    else{
        bankBalance = bankBalance - oldLoan;
        bankBalance = bankBalance + loanAmount;
    }

    workBalance = 0;

    updateBankBalance(bankBalance);
    updateWorkBalance(workBalance);
    updateLoanBalance(loanAmount);

}

/** Converts the given totalBalance to euro and places it in bankBalance element */

function updateBankBalance(totalBalance){

    let balanceInEuro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(totalBalance);

    bankBalanceElement.innerHTML = balanceInEuro;

}

/** Converts the given loanBalance to euro and places it in loanBalance element 
 * also displays loanpaybutton in html when there is an ongoing loan
*/


function updateLoanBalance(loanBalance){

    if(loanAmount > 0 ){
        
        let balanceInEuro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(loanBalance);

        loanBalanceElement.innerHTML = `Loan: ${balanceInEuro}`;

        loanPayButtonElement.style.display = "inline";
    }
    else{
        loanBalanceElement.innerHTML= "";
    }

}
/** Converts the given workBalance to euro and places it in currentWorkBalance element */

function updateWorkBalance(workBalance){

        let balanceInEuro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(workBalance);

        currentWorkBalance.innerHTML = balanceInEuro;

}
/**
 * gets laptops from api and runs addLaptopsToSelect
 */
async function loadLaptops(){
    let response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
  .then(response => response.json())
  .then(data => laptops = data)
  .then(laptops => addLaptopsToSelect(laptops))
}
/**
 * uses given laptops to loop through them and runs addLaptopSelect
 */
const addLaptopsToSelect = (laptops) => {
    laptops.forEach(x => addLaptopToSelect(x));
}

/**
 * gets a single laptop from addLaptopToSelect and adds a single laptop to the select element
 */
const addLaptopToSelect = (laptop) =>{
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title))
    laptopsSelectElement.appendChild(laptopElement);
}

/**
 *  Everytime a user select a differend item from the select element, it will get the id of the selected item and run setSelectedLaptopInfo with the item id in the parameter.
 */

 laptopsSelectElement.addEventListener('change', (event) => {
    laptopBuyButtonElement.style.display= "block";
    let selectedLaptop = laptopsSelectElement.value;
    setSelectedLaptopInfo(selectedLaptop);
});

/**
 * Gets laptop id, loops through all laptops and gets data from a single laptop if the id matches the given id of selectedLaptop.
 * Displays the data in the right elements
 * @param {int} selectedLaptop 
 */
async function setSelectedLaptopInfo(selectedLaptop){
    let description;
    let title;
    let price;
    let imgBaseUrl= "https://noroff-komputer-store-api.herokuapp.com/";
    let imgUrl;
    let specs;
    let response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => laptops.forEach(x => {if(x.id == selectedLaptop){description = x.description; title = x.title; price= x.price; specs = x.specs; imgUrl = imgBaseUrl + x.image}}));
    laptopFeaturesElement.innerHTML = "";
    addSpecs(specs);
    laptopTitleElement.innerHTML = title;
    laptopDescriptionElement.innerHTML = description;

    laptopPriceElement.innerHTML = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(price);
    laptopImageElement.src = imgUrl;
}
/**
 * Gets id of selected laptop and runs buyLaptop with the selectedLaptop as a parameter
 */
laptopBuyButtonElement.onclick = function(){
    let selectedLaptop = laptopsSelectElement.value;
    buyLaptop(selectedLaptop);
}
/**
 * Adds 3 specs to the right featuresElement 
 * @param {array} specs 
 */
//I understood from the wireframe that you only need to display 3 features
function addSpecs(specs){
    specs = specs.slice(0, 3)
    specs.forEach(spec => laptopFeaturesElement.innerHTML += spec + "<br>");
}
/**
 * Gets prise of selectedLaptop and uses the price to check if the user has the right amount of balance in bankBalance.
 * gives succes alert when the user has enough and reduces the amount of bankBalance.
 * gives alert when user doesn't have enough funds for the laptop. 
 * @param {int} selectedLaptop 
 */
async function buyLaptop(selectedLaptop){
    let price;
    let response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => laptops.forEach(x => {if(x.id == selectedLaptop){price = x.price}}));
    if(bankBalance < price){
        alert("You don't have the funds to afford this item!");
    }
    else{
        bankBalance = bankBalance - price;

        updateBankBalance(bankBalance);
        alert("Item bought!");
    }
}



