// Load data from URL
d3.csv("https://raw.githubusercontent.com/jwolfe972/csce_5320_project/main/raw_datasets/world_data.csv").then(function(data) {

// Convert enrollment data from strings to numbers
data.forEach(function(d) {
    d['Gross primary education enrollment (%)'] = parseFloat(d['Gross primary education enrollment (%)'].replace("%", ""));
    // d['Minimum wage'] = d['GDP'].split(",").join("");
    d['Minimum wage'] = parseFloat(d['Minimum wage'].replace("$", ""));
    d['Gross primary education enrollment (%)'] = +d['Gross primary education enrollment (%)'];
    d['Minimum wage'] = +d['Minimum wage'];
});

// Sort data in descending order based on 'Gross primary education enrollment (%)'
data.sort((a, b) => d3.descending(a['Gross primary education enrollment (%)'], b['Gross primary education enrollment (%)']));

// Select top 10 countries
const top10 = data.slice(-10);

// Set up SVG dimensions
const svgWidth = 900;
const svgHeight = 500;
const margin = { top: 100, right: 100, bottom: 200, left: 100 };
const chartWidth = svgWidth - margin.left - margin.right;
const chartHeight = svgHeight - margin.top - margin.bottom;

// Define colors for bars
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create SVG
const svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create chart group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Define scales
const xScale = d3.scaleBand()
  .domain(top10.map(d => d.Country))
  .range([0, chartWidth])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(top10, d => d['Minimum wage'])])
  .nice()
  .range([chartHeight, 0]);

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
    .attr("y", chartHeight + 70) // Adjust position as needed
    .style("text-anchor", "middle")
    .text("Country");

// Draw y-axis label
chartGroup.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -chartHeight / 2)
    .attr("y", -margin.left + 55) // Adjust position as needed
    .style("text-anchor", "middle")
    .text("Minimum wage ($)");

// Draw bars for primary enrollment
chartGroup.selectAll(".bar-primary")
  .data(top10)
  .enter().append("rect")
  .attr("class", "bar-primary")
  .attr("x", d => xScale(d.Country))
  .attr("y", d => yScale(d['Minimum wage']))
  .attr("width", xScale.bandwidth())
  .attr("height", d => chartHeight - yScale(d['Minimum wage']))
  .attr("fill", (d, i) => colorScale(i))
  .on("mouseenter", function(d) {
    d3.select(this).attr("fill", "orange"); // Change fill color on hover
    
})
  .on("mouseleave", function(d, i) {
    d3.select(this).attr("fill", colorScale(i)); // Restore original fill color on mouse leave
  
});

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
    .text("Top 10 Countries with worst Gross Primary Enrollment Ratio and their Mininum Wage");



});