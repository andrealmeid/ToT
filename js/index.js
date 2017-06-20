const serverUrl = "http://192.168.0.43:3000"

function httpRequest(method, theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( method, theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

$("#water-up").click(function(){
    let temp = parseInt($("#water-temp").text());
    if(temp < 50)
        temp++;
    $("#water-temp").text(temp);
    httpRequest("PUT", serverUrl + "/temp/water/" + temp);
});

$("#water-down").click(function(){
    let temp = parseInt($("#water-temp").text());
    if(temp > 15)
        temp--;
    $("#water-temp").text(temp);
    httpRequest("PUT", serverUrl + "/temp/water/" + temp);
});

$("#home-up").click(function(){
    let temp = parseInt($("#home-temp").text());
    if(temp < 50)
        temp++;
    $("#home-temp").text(temp);
});

$("#home-down").click(function(){
    let temp = parseInt($("#home-temp").text());
    if(temp > 15)
        temp--;
    $("#home-temp").text(temp);
});

/*function update(){
    localStorage["homeTemp"] = parseInt($("#home-temp").text());
    localStorage["waterTemp"] = parseInt($("#water-temp").text());

    console.log("Saved!")

    setTimeout(update, 1000);
}

$(function(){
    let homeTemp = localStorage["homeTemp"];
    let waterTemp = localStorage["waterTemp"];

    if(homeTemp)
        $("#home-temp").text(homeTemp);
    else
        $("#home-temp").text(25);

    if(waterTemp)
        $("#water-temp").text(waterTemp);
    else
        $("water-temp").text(25);

    update();
});*/
