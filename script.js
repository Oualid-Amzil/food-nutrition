// calculate Tip
function calculateTip() {
    var billAmt = document.getElementById("billamt").value;
    var serviceQual = document.getElementById("serviceQual").value;
    var numOfPeople = document.getElementById("peopleamt").value;

    // validate input
    if (billamt === "" || serviceQual == 0) {
        alert("Please enter values");
        return;
    }

    // Check to see if this input is empty or less than or equal to 1
    if (numOfPeople === "" || numOfPeople <= 1) {
        numOfPeople = 1;
        document.getElementById("each").style.display = "none";
    } else {
        document.getElementById("each").style.display = "block";
    }

    // Calculate tip
    var total = (billAmt * serviceQual) / numOfPeople;
    // round to two decimal places
    total = Math.round(total * 100) / 100;
    // next line allows us to always have two figits after decimal point
    total = total.toFixed(2);
    // Display the tip
    document.getElementById("totaleTip").style.display = "block";
    document.getElementById("tip").innerHTML = total;
}


// Hide the tip amount on load
document.getElementById("totaleTip").style.display = "none";
document.getElementById("each").style.display = "none";

// click to call function
document.getElementById("calculate").onclick = function() {
    calculateTip();
};














































