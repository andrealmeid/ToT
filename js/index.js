const serverUrl = "http://192.168.0.43:3000"

var canvas_chart = document.getElementById("temp_chart");
var ctx = canvas_chart.getContext('2d');
var home_cur_temp;
var home_cur_state;
var counter = 0;
var temp_history = [];
var cons_history = [];

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

$("#chart_page").hide();

$("#chart_button").click(function(e){
    let height = $("#chart_page").height();
    $("#chart_page").show();
    $("#chart_buttons").css("left", ($("#chart_page").width() - $("#chart_buttons").width())/2);
    $("#chart_page").animate({
        top: "-="+height
    }, 200, function(){
        $("#out").click(function(){
            $("#chart_page").animate({
                top: "+="+height
            }, 200, function(){
                $("#chart_page").hide();
                $("#out").off("click");
            });
        });
    });
});

$("#cons_button").click(function(){
    $("#cons_button").attr("disabled", "");
    $("#cons_button").removeClass("mdl-color--brown-400");
    $("#cons_button").addClass("mdl-color--orange-800");
    $("#temp_button").attr("disabled", null);
    $("#temp_button").addClass("mdl-color--brown-400");
    $("#temp_button").removeClass("mdl-color--orange-800");

    temp_chart.destroy();

    cons_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Estado',
                data: cons_history,
                backgroundColor: [
                    'rgba(50, 59, 225, 0.2)',
                ],
                borderColor: [
                    'rgba(45, 49, 242, 1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'hh:mm:ss'
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        autoSkipPadding: 20,
                        minRotation: 40
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 2
                    }
                }]
            }
        }
    });

});

$("#temp_button").click(function(){
    $("#temp_button").attr("disabled", "");
    $("#temp_button").removeClass("mdl-color--brown-400");
    $("#temp_button").addClass("mdl-color--orange-800");
    $("#cons_button").attr("disabled", null);
    $("#cons_button").addClass("mdl-color--brown-400");
    $("#cons_button").removeClass("mdl-color--orange-800");

    cons_chart.destroy();

    temp_chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Temperature',
                data: temp_history,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'second',
                        displayFormats: {
                            second: 'hh:mm:ss'
                        }
                    },
                    ticks: {
                        autoSkip: true,
                        autoSkipPadding: 20,
                        minRotation: 40
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 15,
                        max: 50
                    }
                }]
            }
        }
    });
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

    let coolerFlag = httpRequest("GET", serverUrl + "/flag/cooler");
    let boilerFlag = httpRequest("GET", serverUrl + "/flag/boiler");
    let windowFlag = httpRequest("GET", serverUrl + "/flag/window");

    if(coolerFlag === 'false'){
        $("#air").attr("fill","#000000");
    }
    else{
        $("#air").attr("fill","#FFFFFF");
    }

    if(windowFlag === 'false'){
        $("#win").attr("fill","#000000");
    }
    else{
        $("#win").attr("fill","#FFFFFF");
    }

    if(boilerFlag === 'false'){
        $("#wat").attr("fill","#000000");
    }
    else{
        $("#wat").attr("fill","#FFFFFF");
    }

    let homeCurTemp = httpRequest("GET", serverUrl + "/temp/curhome");
    let waterCurTemp = httpRequest("GET", serverUrl + "/temp/curwater");

    // DIRTY HACK, DON'T CARE
    home_cur_temp = homeCurTemp;
    home_cur_state = coolerFlag;

    $('#home-cur-temp').text(homeCurTemp);
    $('#water-cur-temp').text(waterCurTemp);
}, 500));

