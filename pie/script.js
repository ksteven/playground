var oilCanvas = document.getElementById("oilChart");

Chart.defaults.global.defaultFontFamily = "Lato";
Chart.defaults.global.defaultFontSize = 18;

var oilData = {
    labels: [
        "Saudi Arabia",
        "Russia",
        "Iraq",
        "United Arab Emirates",
        "Canada"
    ],
    datasets: [
        {
            data: [2, 3, 5, 3, 2],
            backgroundColor: [
                "#FF6384",
                "#63FF84",
                "#84FF63",
                "#8463FF",
                "#6384FF"
            ]
        }]
};

var pieOptions = {
  events: false,
  animation: {
    duration: 500,
    easing: "easeOutQuart",
    onComplete: function () {
      var ctx = this.chart.ctx;
      ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      this.data.datasets.forEach(function (dataset) {

        for (var i = 0; i < dataset.data.length; i++) {
          var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
              total = dataset._meta[Object.keys(dataset._meta)[0]].total,
              mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
              start_angle = model.startAngle,
              end_angle = model.endAngle,
              mid_angle = start_angle + (end_angle - start_angle)/2;

          var x = mid_radius * Math.cos(mid_angle);
          var y = mid_radius * Math.sin(mid_angle);

          ctx.fillStyle = '#fff';
          if (i == 3){ // Darker text color for lighter background
            ctx.fillStyle = '#444';
          }
          var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
          ctx.fillText(dataset.data[i], model.x + x, model.y + y);
          // Display percent in another line, line break doesn't work for fillText
          ctx.fillText(percent, model.x + x, model.y + y + 15);
        }
      });               
    }
  }
};

var pieChart = new Chart(oilCanvas, {
  type: 'pie',
  data: oilData,
  options: pieOptions
});


setInterval(function(){
  console.log("GET DATA"); 
  let url="http://trace.transontario.com/sktracing/wc.dll?sktracingprocess~operationswatch~&compno=10,90,20,35&startdate=2021,07,15,00,00,00&enddate=2021,07,15,23,59,59";
  fetch(url)
  .then(response => response.json())
  .then(data => console.log(data));
  pieChart.data.labels=[
        "Meme",
        "Russia",
        "Iraq",
        "United Arab Emirates",
        "Canada",
        "troll"
    ];
  pieChart.data.datasets[0].data=[5, 5, 5, 5, 5,2]
  pieChart.update();
}, 10000);