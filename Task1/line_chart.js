async function buildPlot() {
    console.log("Checking...");
    // Loading the data
    const data = await d3.json("my_weather_data.json");
    // console.table(data);
    const parseDate = d3.timeParse("%Y-%m-%d");
    const yAccessor_1 = d => d.temperatureMin;

    // Adding requested second parameter
    const yAccessor_2 = d => d.temperatureHigh;
    const xAccessor = d => parseDate(d.date);

    // Create dimensions for our chart
    let dimension = {
        width: window.innerWidth * 0.9,
        height: 400,
        margin: {
            top: 15,
            right: 15,
            bottom: 40,
            left: 60,
        },
    }
    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    // Creating the workplace
    const wrapper = d3.select("#wrapper")
                .append("svg")
                .attr("height", dimension.height)
                .attr("width", dimension.width)

    // We can draw our chart inside of a "g" element and shift it all at once using the CSS transform property
    const bounds = wrapper.append("g")  // Think of "g" as the "div" equivalent within an SVG element
        .style("transform", `translate(${
            dimension.margin.left
        }px, ${
            dimension.margin.top
        }px)`)

    // Create scales

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor_1))  // min-max values
        .range([dimension.boundedHeight, 0])

    const yhScaler = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor_2))  // min-max values
        .range([dimension.boundedHeight, 0])
    bounds.append("g")
        .call(d3.axisLeft(yhScaler));

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimension.boundedWidth])

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor_1(d)));

    var secondLineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yhScaler(yAccessor_2(d)));

    // Add the line
    bounds.append("path")
        // .datum(data)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2) // the line width
        .attr("d", lineGenerator(data));

    bounds.append("path")
        // SVG elements default to a black fill and no stroke; which gives us a filled in shape unless we add styling
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2) // sTemperatureHigh
        .attr("d", secondLineGenerator(data));

    // Draw x axis tick marks and labels
    const xAxisGenerator = d3.axisBottom()  // We want our labels of the x-axis to appear under the axis line
        .scale(xScaler)
    const xAxis = bounds.append("g")
        .call(xAxisGenerator)
        // If you stop here, the xAxisGenerator knows how to display tick marks and labels relative to the axis line, but we need to move it to the bottom with a CSS transform
        .style("transform", `translateY(${
            dimension.boundedHeight
        }px)`)

}

buildPlot()

