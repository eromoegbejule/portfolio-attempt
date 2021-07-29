(function () {

  const margin = { top: 40, right: 30, bottom: 20, left: 40 }

  const width = 400 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  // You'll probably need to edit this one
  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // i'll give you between 0-50k
  // you give back between 0-width (left hand side
  // to the right hand side)
  const xPositionScale = d3.scaleLinear()
    .domain([0, 70])
    .range([0, width])

  const yPositionScale = d3.scaleLinear()
    .domain([0, 70])
    .range([height, 0])

  const colorScale = d3.scaleOrdinal()
    .range(['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc','#cccccc'])

  // hey d3! read in mobiledataprice.csv
  // and when you're done, go run 'ready'
  d3.csv("mobiledataprice.csv")
    .then(ready)

  function ready (datapoints) {
    // add one circle to the 
    // svg for each datapoint

    // grab all circles inside of the svg
    // attach the datapoints to the circles
    // make sure we have the right num of circles
    svg.selectAll('circle')
      .data(datapoints, d => d.Country)
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.PlansMeasured))
      .attr('cy', d => yPositionScale(d.AveragePrice1GB))
      .attr('fill', d => colorScale(d.AveragePrice1GB_USD))
      .attr('stroke', 'black')

    d3.select("#step-1").on('stepin', function() {
      // We only want there to be circles for higher cost locations
      let severe = datapoints.filter(d => d.PriceGrading === "High")

      svg.selectAll('circle')
        .data(severe, d => d.Country)
        .join('circle')
        .attr('r', 5)
        .attr('cx', d => xPositionScale(d.PlansMeasured))
        .attr('cy', d => yPositionScale(d.AveragePrice1GB))
        .attr('fill', d => colorScale(d.AveragePrice1GB_USD))
        .attr('stroke', 'black')
      })

    d3.select("#step-2").on('stepin', function() {
      // We only want there to be circles for africa
      let moderate = datapoints.filter(d => d.PriceGrading === "Medium")

      svg.selectAll('circle')
        .data(moderate, d => d.Country)
        .join('circle')
        .attr('r', 5)
        .attr('cx', d => xPositionScale(d.PlansMeasured))
        .attr('cy', d => yPositionScale(d.AveragePrice1GB))
        .attr('fill', d => colorScale(d.AveragePrice1GB_USD))
        .attr('stroke', 'black')
      })

    d3.select("#step-3").on('stepin', function() {
      // We only want there to be circles with low mobile data costs
      let low = datapoints.filter(d => d.rep_level === "Low")
      svg.selectAll('circle')
        .data(low, d => d.Country)
        .join(
          enter => enter.append('circle')
                        .attr('cx', d => xPositionScale(d.PlansMeasured))
                        .attr('cy', d => yPositionScale(d.AveragePrice1GB))
                        .attr('fill', d => colorScale(d.AveragePrice1GB_USD))
                        .transition()
                        .attr('r', 5)
                        .attr('stroke','black'),
          exit => exit.transition().attr('r', 0).remove()
        )
    })

    d3.select("#step-4").on('stepin', function() {
      // We only want there to be circles with a low mobile data costs
      let equal = datapoints.filter(d => d.PriceGrading === "Very Low")
      svg.selectAll('circle')
        .data(equal, d => d.Country)
        .join(
          enter => enter.append('circle')
                        .attr('cx', d => xPositionScale(d.PlansMeasured))
                        .attr('cy', d => yPositionScale(d.AveragePrice1GB))
                        .attr('fill', d => colorScale(d.AveragePrice1GB_USD))
                        .transition()
                        .attr('r', 5)
                        .attr('stroke','black'),
          exit => exit.transition().attr('r', 0).remove()
        )
    })

    d3.select("#step-5").on('stepin', function() {
      // We only want there to be circles with a low mobile data cost
      let over = datapoints.filter(d => d.rep_level === "Least")
      svg.selectAll('circle')
        .data(over, d => d.Country)
        .join(
          enter => enter.append('circle')
                        .attr('cx', d => xPositionScale(d.PlansMeasured))
                        .attr('cy', d => yPositionScale(d.AveragePrice1GB))
                        .attr('fill', d => colorScale(d.AveragePrice1GB_USD))
                        .transition()
                        .attr('r', 5)
                        .attr('stroke','black'),
          exit => exit.transition().attr('r', 0).remove()
        )
    })

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    }

})();