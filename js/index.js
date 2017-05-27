$("#water-up").click(function(){
    let temp = parseInt($("#water-temp").text());
    if(temp < 50)
        temp++;
    $("#water-temp").text(temp);
});

$("#water-down").click(function(){
    let temp = parseInt($("#water-temp").text());
    if(temp > 15)
        temp--;
    $("#water-temp").text(temp);
});
