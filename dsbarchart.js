d3.csv('https://raw.githubusercontent.com/qinlinc/CSC3007-project/main/prod_cons.csv', value, display);

            var prod = "total_production";
            var cons = "total_consumption";

            var label_width = 150;
            var svg,
                bar_width = 300,
                bar_height = 5,
                height = bar_height * 200;
            var rightOffset = bar_width + label_width;

            var xLHS = d3.scale.linear()
                .range([0, bar_width - 100]);
            var xRHS = d3.scale.linear()
                .range([0, bar_width - 100]);
            var y = d3.scale.ordinal()
                .rangeBands([20, height]);

            function display(data) {
                var svg = d3.select("body")
                    .append('svg')
                    .attr('class', 'svg')
                    .attr('width', label_width + bar_width + bar_width)
                    .attr('height', height);

                xLHS.domain(d3.extent(data, function (d) {
                    return d[prod];
                }));

                xRHS.domain(d3.extent(data, function (d) {
                    return d[cons];
                }));

                y.domain(data.map(function (d) {
                    return d.state;
                }));

                var yPosByIndex = function (d) {
                    return y(d.state);
                };
                svg.selectAll("bar.left")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", function (d) {
                        return bar_width - xLHS(d[prod]);
                    })
                    .attr("y", yPosByIndex)
                    .attr("class", "left")
                    .attr("width", function (d) {
                        return xLHS(d[prod]);
                    })
                    .attr("height", y.rangeBand());

                svg.selectAll("text.leftval")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", function (d) {
                        return bar_width - xLHS(d[prod]) - 30;
                    })
                    .attr("y", function (d) {
                        return y(d.state) + y.rangeBand() / 2;
                    })
                    .attr("dx", "20")
                    .attr("dy", ".36em")
                    .attr("text-anchor", "end")
                    .attr('class', 'leftval')
                    .text(function (d) { return d[prod]; });

                svg.selectAll("text.label")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", (label_width / 2) + bar_width)
                    .attr("y", function (d) {
                        return y(d.state) + y.rangeBand() / 2;
                    })
                    .attr("dy", ".20em")
                    .attr("text-anchor", "middle")
                    .attr('class', 'label')
                    .text(function (d) { return d.state; });

                svg.selectAll("bar.right")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("x", rightOffset)
                    .attr("y", yPosByIndex)
                    .attr("class", "right")
                    .attr("width", function (d) {
                        return xRHS(d[cons]);
                    })
                    .attr("height", y.rangeBand());

                svg.selectAll("text.rightval")
                    .data(data)
                    .enter()
                    .append("text")
                    .attr("x", function (d) {
                        return xRHS(d[cons]) + rightOffset + 50;
                    })
                    .attr("y", function (d) {
                        return y(d.state) + y.rangeBand() / 2;
                    })
                    .attr("dx", -5)
                    .attr("dy", ".36em")
                    .attr("text-anchor", "end")
                    .attr('class', 'rightval')
                    .text(function (d) { return d[cons]; });

                svg.append("text").attr("x", bar_width / 3).attr("y", 12).attr("class", "title").text("Total Production");
                svg.append("text").attr("x", bar_width + label_width / 3).attr("y", 12).attr("class", "title").text("State");
                svg.append("text").attr("x", bar_width / 3 + rightOffset).attr("y", 12).attr("class", "title").text("Total Consumption");

            }

            function value(d) {
                d["total_production"] = +d["total_production"];
                d["total_consumption"] = +d["total_consumption"];
                return d;
            }