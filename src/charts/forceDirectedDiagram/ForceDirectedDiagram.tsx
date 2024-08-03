import * as d3 from 'd3';
import { MutableRefObject, useEffect, useRef } from 'react';
import data from '../../assets/miserables.json';

type Dimensions = {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

type Node = {
  id: string;
  group: number;
};

type Link = {
  source: string;
  target: string;
  value: number;
};

type DragEvent = d3.D3DragEvent<SVGCircleElement, IFDGraphNode, d3.SubjectPosition>;

interface IFDGraphNode extends d3.SimulationNodeDatum, Node {}

interface IFDGraphLink extends d3.SimulationLinkDatum<IFDGraphNode> {
  source: IFDGraphNode;
  target: IFDGraphNode;
  value: number;
}

export default function ForceDirectedDiagram() {
  const { nodes, links } = data;
  const svgRef = useRef();
  const dimensions = {
    width: 1200,
    height: 800,
    margin: {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15,
    },
  };

  useEffect(() => {
    render(dimensions, svgRef, nodes, links);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <svg ref={svgRef}></svg>;
}

function render(
  dimensions: Dimensions,
  svgRef: MutableRefObject<SVGSVGElement>,
  nodeData: Node[],
  linkData: Link[]
) {
  // 깊은 복사, d3.forceSimulation은 node, link data의 속성들을 변경시킴
  const nodes: IFDGraphNode[] = nodeData.map((node) => ({ ...node }));
  const links: IFDGraphLink[] = linkData.map((link) => ({ ...link })) as any;
  const height = dimensions.height;
  const width = dimensions.width;
  const defaultRadius = 8;
  const defaultLineColor = '#999';
  const color = d3.scaleOrdinal(d3.schemeCategory10).domain(nodes.map((node) => node.group.toString()));

  const svg = d3
    .select(svgRef.current)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('width', width)
    .attr('height', height)
    .attr('font-size', 10)
    .attr('font-family', 'sans-serif');
  svg.select('g.container').remove();

  const container = svg.append('g').attr('class', 'container');

  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 10])
    .on('zoom', (event) => {
      container.attr('transform', event.transform);
    });
  svg.call(zoom);

  const linkedByIndex = links.reduce(
    (acc, val) => {
      acc[val.source + ',' + val.target] = true;
      return acc;
    },
    {} as {
      [src_tgt in string]: boolean;
    }
  );

  const simulation = d3
    .forceSimulation<IFDGraphNode, IFDGraphLink>(nodes)
    .force(
      'link',
      d3.forceLink(links).id((d: IFDGraphNode) => d.id)
    )
    .force('charge', d3.forceManyBody().distanceMax(400).strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2));

  const link = container
    .append('g')
    .attr('class', 'link-group')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', defaultLineColor)
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', (d) => Math.sqrt(d.value) * 1.25);

  const node = container
    .append('g')
    .attr('class', 'node-group')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('id', (d) => 'node' + d.id)
    .attr('r', defaultRadius)
    .attr('fill', (d) => color(d.group.toString()))
    .attr('stroke', '#fff')
    .attr('cursor', 'pointer')
    .on('mouseover', mouseOver(0.2))
    .on('mouseout', mouseOut);

  const drag = d3
    .drag<SVGCircleElement, IFDGraphNode>()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
  node.call(drag);

  const keys = Object.keys(nodes[0]);
  node.append('title').text((d: IFDGraphNode) => keys.map((key) => `${key}: ${d[key]}`).join('\n'));

  simulation.on('tick', ticked);

  function isConnected(a: IFDGraphNode, b: IFDGraphNode) {
    return linkedByIndex[a.id + ',' + b.id] || linkedByIndex[b.id + ',' + a.id] || a.id === b.id;
  }

  function ticked() {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y);

    node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
  }

  function dragstarted(event: DragEvent, d: IFDGraphNode) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: DragEvent, d: IFDGraphNode) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragended(event: DragEvent, d: IFDGraphNode) {
    if (!event.active) {
      simulation.alphaTarget(0);
    }
    d.fx = null;
    d.fy = null;
  }

  function mouseOver(opacity: number) {
    return (e: MouseEvent, d: IFDGraphNode) => {
      node.style('stroke-opacity', (o) => (isConnected(d, o) ? 1 : opacity));
      node.style('fill-opacity', (o) => (isConnected(d, o) ? 1 : opacity));
      link.style('stroke-opacity', (o) => (o.source === d || o.target === d ? 1 : opacity));
      link.style('stroke', (o: IFDGraphLink) => {
        return o.source === d || o.target === d
          ? color((o.source as IFDGraphNode).group.toString())
          : defaultLineColor;
      });
    };
  }

  function mouseOut() {
    node.style('stroke-opacity', 1);
    node.style('fill-opacity', 1);
    link.style('stroke-opacity', 1);
    link.style('stroke', defaultLineColor);
  }
}
