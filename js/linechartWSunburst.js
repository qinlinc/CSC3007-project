var margin = { top: 20, right: 100, bottom: 70, left: 100 },
  originalWidth = 600;
(width = originalWidth - margin.left - margin.right),
  (height = 400 - margin.top - margin.bottom);
// append the svg object to the body of the page
var svg = d3
  .select("#linegraph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(
  "https://raw.githubusercontent.com/qinlinc/CSC3007-project/main/PT2_US.csv"
).then(function (data) {
  var arr = [];
  for (let j = 0; j < data.length; j++) {
    arr.push({ year: data[j].Year, value: data[j].Total });
  }

  var sunArray = data.filter(function (d) {
    return d.Year == "2020";
  });
  var total = sunArray[0].Total;
  var newArray = {
    name: "Energy Production",
    children: [
      {
        name: "Fossil Fuels",
        children: [
          { name: "Coal", size: sunArray[0]["Coal a"] },
          { name: "Natural Gas", size: sunArray[0]["Natural Gas b"] },
          { name: "Crude Oil", size: sunArray[0]["Crude Oil c"] },
        ],
      },
      {
        name: "Nuclear Electric Power",
        size: sunArray[0]["Nuclear Electric Power"],
      },
      {
        name: "Renewable Energy",
        children: [
          { name: "Biofuels", size: sunArray[0]["Biofuels d"] },
          {
            name: "Wood and Waste",
            size: sunArray[0]["Wood and Waste e"],
          },
          { name: "Others", size: sunArray[0]["Other f"] },
        ],
      },
    ],
  };

  var tooltip = d3
    .select("body")
    .append("rect")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "black")
    .style("font-size", "20px")
    .style("background", "white")
    .style("padding-top", "5px")
    .style("padding-left", "15px")
    .style("padding-right", "15px")
    .style("opacity", "0.9")
    .style("border", "1px solid black");
  var bisectDate = d3.bisector(function (d) {
    return d.year;
  }).left;

  var div = d3
    .select("#sunburst")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var x = d3
    .scaleTime()
    .domain(
      d3.extent(arr, function (d) {
        return d.year;
      })
    )
    .range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  var focus = svg.append("g").style("display", "none");

  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(arr, function (d) {
        return +d.value;
      }),
    ])
    .range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg
    .append("path")
    .datum(arr)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)

    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(d.year);
        })
        .y(function (d) {
          return y(d.value);
        })
    );

  // append the circle at the intersection
  focus
    .append("circle")
    .attr("class", "y")
    .style("fill", "none")
    .style("stroke", "blue")
    .attr("r", 4);

  // append the rectangle to capture mouse
  svg
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .on("mouseover", function () {
      focus.style("display", null);
      focus.style("visibility", "visible");

    })
    .on("mouseout", function () {
      focus.style("display", "none");
      focus.style("visibility", "hidden");
      div.transition().duration(500).style("opacity", 0);
    })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.pointer(event, this)[0]),
      i = bisectDate(arr, x0, 1),
      d0 = arr[i - 1],
      d1 = arr[i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;

    div.transition().duration(100).style("opacity", 0.9);
    div
      .html(
        "Year: " + d.year + "<br/>" + "Total Energy Produced: " + d.value
      )
      .style("left", x(d.year) + "px")
      .style("top", y(d.value) + 200 + "px")
      .style("visibility", "visible");

    focus
      .select("circle.y")
      .attr(
        "transform",
        "translate(" + x(d.year) + "," + y(d.value) + ")"
      );
  }

  //X-scale
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + "," + (height + 40) + ")"
    )
    .text("Year")
    .style("margin", "40px")
    .attr("text-align", "middle");
  //Y scale
  svg
    .append("text")
    .attr("transform", "translate(-80, " + height / 1.5 + ") rotate(-90)")
    .text("Amount of energy produced")
    .attr("text-align", "middle");

  // Variables

  var radius = Math.min(width, height);
  var color = d3.scaleOrdinal(d3.schemePastel1);

  var sunburstWidth = 400,sunburstHeight = 600;
  // // Create primary <g> element
  var sunburst = d3
    .select("#sunburst")
    .append("svg")
    .attr("width", sunburstWidth + margin.left + margin.right)
    .attr("height", sunburstHeight + margin.top + margin.bottom)
  format = d3.format(",d");

  var g = sunburst
    .append("g")
    .attr(
      "transform",
      `translate(${sunburstWidth / 2 + 100},${sunburstHeight / 2})`
    );

  // // Data strucure
  var partition = d3.partition().size([2 * Math.PI, radius]);

  // // Find data root
  var root = d3.hierarchy(newArray).sum(function (d) {
    return d.size;
  });

  var tooltip = d3
    .select("#sunburst") // select element in the DOM with id 'chart'
    .append("div")
    .classed("tooltip", true); // append a div element to the element we've selected
  tooltip
    .append("div") // add divs to the tooltip defined above
    .attr("class", "label"); // add class 'label' on the selection
  tooltip
    .append("div") // add divs to the tooltip defined above
    .attr("class", "count"); // add class 'count' on the selection
  tooltip
    .append("div") // add divs to the tooltip defined above
    .attr("class", "percent");

  // // Size arcs
  partition(root);
  var arc = d3
    .arc()
    .startAngle(function (d) {
      return d.x0;
    })
    .endAngle(function (d) {
      return d.x1;
    })
    .innerRadius(function (d) {
      return d.y0 / 1.1;
    })
    .outerRadius(function (d) {
      return d.y1 / 1.1;
    });

  // // Put it all together
  var path = g
    .selectAll("path")
    .data(root.descendants())
    .enter()
    .append("g");

  path
    .append("path")
    .attr("display", function (d) {
      return d.depth ? null : "none";
    })
    .attr("d", arc)
    .style("stroke", "#fff")
    .style("fill", function (d) {
      return color((d.children ? d : d.parent).data.name);
    })
    .on("mouseover", function (event, d) {
      d3.select(event.currentTarget)
        .attr("stroke", "red")
        .attr("stroke-width", 8);

      var percent = Math.round((d.value / total) * 100);
      tooltip.select(".label").html(`Energy Type: ${d.data.name}`);
      tooltip
        .select(".count")
        .html(`Energy Value: <Br/> ${d.value} Trillion BTU`); // set current count
      tooltip.select(".percent").html(`Percentage: ${percent}'%'`);
      tooltip.style("display", "block"); // set display
      tooltip.style("visibility", "visible"); 
    })
    .on("mouseout", function () {
      // when mouse leaves div
      tooltip.style("display", "none"); // hide tooltip for that element
      tooltip.style("visibility", "hidden"); 
      d3.select(event.currentTarget)
        .attr("stroke", "none")
        .attr("stroke-width", 2);
    })
    .on("mousemove", function (d) {
      // when mouse moves
      tooltip.style("top", event.layerY + 10 + "px"); // always 10px below the cursor
      tooltip.style("left", event.layerX + 10 + "px"); // always 10px to the right of the mouse
      // d3.select(event.currentTarget).attr("stroke", "none");
    });

  var sunbursttxt = path
    .append("text")
    .html(function (d) {
      return d.data.name;
    })
    .classed("sunburstlabel", true)
    .attr("textLength", function (d) {
      return Math.min("85", d.data.name.length * 8);
    })
    .attr("lengthAdjust", "spacingAndGlyphs")

    .attr("x", function (d) {
      return d.x;
    })
    .attr("text-anchor", "middle")
    // translate to the desired point and set the rotation
    .attr("transform", function (d) {
      if (d.depth > 0) {
        return (
          "translate(" +
          arc.centroid(d) +
          ")" +
          "rotate(" +
          getAngle(d) +
          ")"
        );
      } else {
        return null;
      }
    })
    .attr("dx", "6") // margin
    .attr("dy", ".35em") // vertical-align
    .attr("height", "20px")
    .attr("pointer-events", "none");

  var sbl = d3.select(".sunburstlabel")
  sbl.attr("fill","white")
  .attr("textLength","120")
  function getAngle(d) {
    // Offset the angle by 90 deg since the '0' degree axis for arc is Y axis, while
    // for text it is the X axis.
    var thetaDeg =
      ((180 / Math.PI) * (arc.startAngle()(d) + arc.endAngle()(d))) / 2 -
      90;
    // If we are rotating the text by more than 90 deg, then "flip" it.
    // This is why "text-anchor", "middle" is important, otherwise, this "flip" would
    // a little harder.
    return thetaDeg > 90 ? thetaDeg - 180 : thetaDeg;
  }
});