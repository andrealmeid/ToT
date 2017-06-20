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
    httpRequest("PUT", serverUrl + "/temp/home/" + temp);
});

$("#home-down").click(function(){
    let temp = parseInt($("#home-temp").text());
    if(temp > 15)
        temp--;
    $("#home-temp").text(temp);
    httpRequest("PUT", serverUrl + "/temp/home/" + temp);
});

/*function update(){
    localStorage["homeTemp"] = parseInt($("#home-temp").text());
    localStorage["waterTemp"] = parseInt($("#water-temp").text());

    console.log("Saved!")

    setTimeout(update, 1000);
}*/

$(setInterval(function(){
    let homeTemp = httpRequest("GET", serverUrl + "/temp/home/");
    let waterTemp = httpRequest("GET", serverUrl + "/temp/water/");

    $("#home-temp").text(homeTemp);
    $("#water-temp").text(waterTemp);
}, 1000));
