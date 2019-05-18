import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import colors from '../data/color-scheme-2.json'
import jsonWorld from 'world-atlas/world/50m.json'
import data from '../data/2.5_month.json'

const getMapHeight = projection => {
    const b = jsonWorld.bbox
    const y1 = projection([b[0], b[1]])[1]
    const y2 = projection([b[2], b[3]])[1]
    return Math.abs(y2 - y1)
} 

const magnitudeDomain = (() => {
    const magnitudes = data.features.map(d => d.properties.mag)
    return [d3.min(magnitudes), d3.max(magnitudes)]
})()

const world = topojson.feature(jsonWorld, jsonWorld.objects.land)

;(function main() {
    d3.select('body')
        .style('overflow', 'hidden')

    window.onresize = () => {
        // Make the chart responsive
        const svgtest = d3.select('svg')
        if (!svgtest.empty()) svgtest.remove()
        draw()
    }

    draw()
})()

function draw() {
    const width = document.body.clientWidth
    const height = window.innerHeight
    
    const svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', colors[2])
        .style('background-color', colors[1])

    const mapWidth = 0.87 * width
    const restWidth = width - mapWidth
    
    const projection = d3.geoNaturalEarth1()
        .fitSize([mapWidth, height], world)

    const barHeight = 0.8 * getMapHeight(projection)
    const barHeightMargin = (height - barHeight) / 2

    console.log(getMapHeight(projection))

    const path = d3.geoPath(projection)

    svg.selectAll('path')
        .data(world.features)
        .enter().append('path')
        .attr('d', path)
    
    const colorScale = d3.scaleLinear().domain(magnitudeDomain).range([colors[3], colors[4]])
    svg.selectAll('circle')
        .data(data.features)
        .enter().append('circle')
        .attr('cx', d => projection(d.geometry.coordinates)[0])
        .attr('cy', d => projection(d.geometry.coordinates)[1])
        .attr('r', 1)
        .attr('fill', d => colorScale(d.properties.mag))
    
    const grad = svg.append('defs')
        .append('linearGradient')
            .attr('id', 'grad')
            .attr('x1', '0')
            .attr('x2', '0')
            .attr('y1', '1')
            .attr('y2', '0')

    grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors[3])

    grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors[4])

    const g = svg.append('g')
        .attr('transform', `translate(${mapWidth}, 0)`)
    
    g.append('rect')
        .attr('x', (1/5) * restWidth)
        .attr('y', barHeightMargin)
        .attr('width', (2/5) * restWidth)
        .attr('height', barHeight)
        .style('fill', 'url(#grad)')
        .style('stroke', colors[2])
        .style('stroke-width', '1px')

    g.append('g')
        .call(
            d3.axisRight(
                d3.scaleLinear()
                .domain(magnitudeDomain)
                .range([height - barHeightMargin - 1, barHeightMargin + 1])
                
            )
            .ticks(5)
        )
        .attr('transform', `translate(${(3/5) * restWidth + 2},0)`)
        .classed('axis1', true)
        /*.attr('fill', 'url(#grad)')
        .style('stroke', 'red')*/
    const axisColor = colors[2]
    d3.selectAll('.axis1 line').style('stroke', axisColor)
    d3.selectAll('.axis1 text').style('fill', axisColor)
    d3.selectAll('.axis1 path').style('stroke', axisColor)

        //.style('stroke', colors[3])
}

