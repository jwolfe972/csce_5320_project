d3.csv("https://raw.githubusercontent.com/jwolfe972/csce_5320_project/main/raw_datasets/world_data.csv").then(function(data) {

    // Convert enrollment data from strings to numbers
    // console.log(data.slice(0,5));
    data.forEach(function(d) {
        d['Minimum wage'] = parseInt(d['Minimum wage'].replace('$', ''));
        d['Gross tertiary education enrollment (%)'] = parseFloat(d['Gross tertiary education enrollment (%)'].replace("%", ""));
        d['Population: Labor force participation (%)'] = parseFloat(d['Population: Labor force participation (%)'].replace("%", ""));
        d['Minimum wage'] = +d['Minimum wage'];
        d['Population: Labor force participation (%)'] = +d['Population: Labor force participation (%)'];
    });

    // Sort data in descending order based on 'Population: Labor force participation (%)'
    data.sort((a, b) => d3.descending(a['Gross tertiary education enrollment (%)'], b['Gross tertiary education enrollment (%)']));

    // Select top 10 countries
    const top10 = data.slice(0,10);

    console.log(top10)


    const svgWidth = 900;
    const svgHeight = 500;
    const margin = { top: 100, right: 150, bottom: 70, left: 60 };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Create chart group
    const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    // const data = [
    //     { x: 155, y: 386, r: 20, fill: '#0000FF' },
    //     { x: 340, y: 238, r: 52, fill: '#FF0AAE' },
    //     { x: 531, y: 151, r: 20, fill: '#00FF88' },
    //     { x: 482, y: 307, r: 147, fill: '#7300FF' },
    //     { x: 781, y: 91, r: 61, fill: '#0FFB33' },
    //     { x: 668, y: 229, r: 64, fill: '#D400FF' },
    //     { x: 316, y: 390, r: 85, fill: '#0FF0FF' },
    //     ];

    // Define colors for bars
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // Define scales
    const xScale = d3.scaleBand()
        .domain(top10.map(d => d.Country))
        .range([0, chartWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d['Minimum wage'])])
        .nice()
        .range([chartHeight, 0]);

    const zScale = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d['Population: Labor force participation (%)'])])
        .nice()
        .range([chartHeight, 0])


    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Draw x-axis
chartGroup.append("g")
  .attr("class", "axis-x")
  .attr("transform", `translate(0,${chartHeight})`)
  .call(xAxis)
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

// Draw y-axis
chartGroup.append("g")
  .attr("class", "axis-y")
  .call(yAxis);

// Draw x-axis label
chartGroup.append("text")
    .attr("class", "axis-label")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + 60) // Adjust position as needed
    .style("text-anchor", "middle")
    .text("Country");


// Draw y-axis label
chartGroup.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -margin.left + 30) // Adjust position as needed
    .style("text-anchor", "middle")
    .text("Minimum Wage $");

    chartGroup.selectAll('circle')
        .data(top10)
        .join('circle')
        .attr('cx', (d,i) => xScale(d.Country))
        .attr('cy', (d) => yScale(d['Minimum wage']))
        .attr('r', (d) => zScale(d['Population: Labor force participation (%)']))
        .attr('fill', (d, i) => colorScale(i))
        .attr('opacity', 708 / 1000)
        .on("mouseenter", function(d) {
            d3.select(this).attr("fill", "orange"); // Change fill color on hover
        })
          .on("mouseleave", function(d, i) {
            d3.select(this).attr("fill", colorScale(i)); // Restore original fill color on mouse leave
        });

        svg.append("rect")
        .attr("class", "svg-border")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 1);
    
    svg.append("text")
        .attr("x", (svgWidth / 2))
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Minimum wage Vs Population Labor force participation (Size) for Countries with highest education enrollment ");
    

// Add legend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${svgWidth - margin.right},${margin.top})`);

const legendRectSize = 10;
const legendSpacing = 4;

legend.selectAll("rect")
  .data(top10)
  .enter().append("rect")
  .attr("x", 0)
  .attr("y", (d, i) => i * (legendRectSize + legendSpacing))
  .attr("width", legendRectSize)
  .attr("height", legendRectSize)
  .style("fill", (d, i) => colorScale(i));

legend.selectAll("text")
  .data(top10)
  .enter().append("text")
  .attr("x", legendRectSize + legendSpacing)
  .attr("y", (d, i) => i * (legendRectSize + legendSpacing) + legendRectSize / 2)
  .attr("dy", "0.5em")
  .text(d => d.Country);
});