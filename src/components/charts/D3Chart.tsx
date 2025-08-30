'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3ChartProps {
  className?: string;
}

// Interactive Network Graph for Student Connections
export function StudentNetworkChart({ 
  networkData, 
  className = '' 
}: { 
  networkData: { nodes: any[]; links: any[] }; 
  className?: string; 
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!svgRef.current || !networkData.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    
    // Create simulation
    const simulation = d3.forceSimulation(networkData.nodes)
      .force('link', d3.forceLink(networkData.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(networkData.links)
      .enter().append('line')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(networkData.nodes)
      .enter().append('circle')
      .attr('r', (d: any) => Math.sqrt(d.score || 50) * 2)
      .attr('fill', (d: any) => {
        if (d.type === 'student') return '#6366f1';
        if (d.type === 'subject') return '#10b981';
        return '#f59e0b';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(d3.drag<SVGCircleElement, any>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(networkData.nodes)
      .enter().append('text')
      .text((d: any) => d.name)
      .attr('font-size', 12)
      .attr('font-family', 'Inter, sans-serif')
      .attr('fill', '#374151')
      .attr('text-anchor', 'middle')
      .attr('dy', -15);

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    node
      .on('mouseover', (event, d: any) => {
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip.html(`
          <strong>${d.name}</strong><br/>
          Type: ${d.type}<br/>
          ${d.score ? `Score: ${d.score}` : ''}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(500).style('opacity', 0);
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      tooltip.remove();
    };
  }, [networkData, dimensions]);

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
}

// Hierarchical Tree Chart for Skill Development
export function SkillTreeChart({ 
  skillData, 
  className = '' 
}: { 
  skillData: any; 
  className?: string; 
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    if (!svgRef.current || !skillData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create tree layout
    const tree = d3.tree<any>().size([innerHeight, innerWidth]);
    const root = d3.hierarchy(skillData);
    tree(root);

    // Create links
    const link = g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x))
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2);

    // Create nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`);

    node.append('circle')
      .attr('r', d => d.data.level ? 8 : 12)
      .attr('fill', d => {
        if (d.data.mastery >= 80) return '#10b981';
        if (d.data.mastery >= 60) return '#f59e0b';
        return '#ef4444';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    node.append('text')
      .attr('dy', 3)
      .attr('x', d => d.children ? -15 : 15)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.data.name);

    // Add progress indicators
    node.filter(d => d.data.mastery !== undefined)
      .append('rect')
      .attr('x', -20)
      .attr('y', 15)
      .attr('width', 40)
      .attr('height', 4)
      .attr('fill', '#e5e7eb')
      .attr('rx', 2);

    node.filter(d => d.data.mastery !== undefined)
      .append('rect')
      .attr('x', -20)
      .attr('y', 15)
      .attr('width', d => (d.data.mastery / 100) * 40)
      .attr('height', 4)
      .attr('fill', d => {
        if (d.data.mastery >= 80) return '#10b981';
        if (d.data.mastery >= 60) return '#f59e0b';
        return '#ef4444';
      })
      .attr('rx', 2);

  }, [skillData, dimensions]);

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
}

// Interactive Heatmap for Performance Matrix
export function PerformanceHeatmap({ 
  heatmapData, 
  className = '' 
}: { 
  heatmapData: any[][]; 
  className?: string; 
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    if (!svgRef.current || !heatmapData.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Extract unique categories
    const subjects = [...new Set(heatmapData.map(d => d[0]))];
    const skills = [...new Set(heatmapData.map(d => d[1]))];

    // Create scales
    const xScale = d3.scaleBand()
      .domain(skills)
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleBand()
      .domain(subjects)
      .range([0, innerHeight])
      .padding(0.1);

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([0, 100]);

    // Create cells
    const cells = g.selectAll('.cell')
      .data(heatmapData)
      .enter().append('rect')
      .attr('class', 'cell')
      .attr('x', d => xScale(d[1])!)
      .attr('y', d => yScale(d[0])!)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d[2]))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Add text labels
    g.selectAll('.cell-text')
      .data(heatmapData)
      .enter().append('text')
      .attr('class', 'cell-text')
      .attr('x', d => xScale(d[1])! + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d[0])! + yScale.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '10px')
      .style('fill', d => d[2] > 50 ? '#fff' : '#000')
      .text(d => d[2]);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px');

    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '14px')
      .style('fill', '#374151')
      .text('Subjects');

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
      .style('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '14px')
      .style('fill', '#374151')
      .text('Skills');

  }, [heatmapData, dimensions]);

  return (
    <div className={`w-full h-full ${className}`}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      />
    </div>
  );
}

// Animated Progress Circle
export function ProgressCircle({ 
  value, 
  maxValue = 100, 
  size = 120, 
  strokeWidth = 8,
  color = '#6366f1',
  className = '' 
}: { 
  value: number; 
  maxValue?: number; 
  size?: number; 
  strokeWidth?: number;
  color?: string;
  className?: string; 
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = (value / maxValue) * circumference;

    const g = svg.append('g')
      .attr('transform', `translate(${size / 2}, ${size / 2})`);

    // Background circle
    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', strokeWidth);

    // Progress circle
    const progressCircle = g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', circumference)
      .attr('stroke-dashoffset', circumference)
      .attr('transform', 'rotate(-90)');

    // Animate progress
    progressCircle
      .transition()
      .duration(1000)
      .ease(d3.easeCircleOut)
      .attr('stroke-dashoffset', circumference - progress);

    // Add text
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', `${size / 6}px`)
      .style('font-weight', 'bold')
      .style('fill', '#374151')
      .text(`${Math.round((value / maxValue) * 100)}%`);

  }, [value, maxValue, size, strokeWidth, color]);

  return (
    <div className={`inline-block ${className}`}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
      />
    </div>
  );
}
