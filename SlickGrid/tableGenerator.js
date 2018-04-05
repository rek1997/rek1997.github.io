<script>
 
var types = us-states.js;

var data = d3.entries(types).map(function(d) {
  var val = d.value;
  val.key = d.key;
  return val;
});
 
var format = d3.format(".4n"),
    scale = d3.scale.linear().domain([-10, 20, 1000]).range([0, 800, 1000]);
 
var svg = d3.select("#superformula").append("svg")
    .attr("width", 960)
    .attr("height", 500)
    .append("g")
    .attr("transform", "translate(70,70)");

var parcoords = d3.parcoords()("#example")
  .data(data)
  .render()
  .brushMode("1D-axes")
  .on("brush", function(items) {
    var selected = items.map(function(d) { return d.key; });
    svg.selectAll("path")
       .style("opacity", 0.2)
       .filter(function(d) { return selected.indexOf(d.key) > -1; })
       .style("opacity", 1);
  });

var shape = d3.superformula()
    .size(5000)
    .segments(3600);
 
var path = svg
    .selectAll("path")
    .data(d3.entries(types))
    .enter().append("path")
    .attr("transform", function(d,i) { return "translate(" + (140*(i%7)) + "," + (140*Math.floor(i/7)) + ")" })
    .attr("d", function(d) { return shape.type(d.key)(); })
    .on("mouseover", function(d,i) {
      parcoords.highlight([data[i]]);
    })
    .on("mouseout", parcoords.unhighlight);
</script>