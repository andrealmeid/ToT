var temp_chart;
var cons_chart;

temp_chart = new Chart(ctx, {
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

function add_data_to_temp_chart(temp)
{
    addData(temp_chart, {x: new Date().getTime(), y: temp});
    temp_history.push({x: new Date().getTime(), y: temp});
    counter++;
    if (counter > 20)
    {
        removeData(temp_chart);
        temp_history.shift();
    }
}

function add_data_to_cons_chart(state)
{
    if (state === 'false') state = 0;
    if (state === 'true') state = 1;

    addData(cons_chart, {x: new Date().getTime(), y: state});
    cons_history.push({x: new Date().getTime(), y: state});
    counter++;
    if (counter > 20)
    {
        removeData(cons_chart);
        cons_history.shift();
    }
}

setInterval(function () {
    add_data_to_temp_chart(home_cur_temp);
    add_data_to_cons_chart(home_cur_state);
}, 1000);
