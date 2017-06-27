var ctx = document.getElementById("temp_chart").getContext('2d');

var temp_chart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [{
            label: 'Temperature',
            data: [],
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

function addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}

let counter = 0;
function add_data_to_temp_chart(temp)
{
    addData(temp_chart, {x: new Date().getTime(), y: temp});
    counter++;
    if (counter > 20)
    {
        removeData(temp_chart);
    }
}

setInterval(function () {
    add_data_to_temp_chart(home_cur_temp);
}, 1000);
