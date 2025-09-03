import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 300, y: 100 },
    data: { 
      label: 'Welcome to FlowCraft!', 
      nodeType: 'start' 
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 250 },
    data: { 
      label: 'Drag nodes from sidebar', 
      nodeType: 'text' 
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 150, y: 400 },
    data: { 
      label: 'Create Process', 
      nodeType: 'process' 
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 450, y: 400 },
    data: { 
      label: 'Make Decision?', 
      nodeType: 'decision' 
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { strokeWidth: 2, stroke: 'hsl(var(--primary))' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    style: { strokeWidth: 2, stroke: 'hsl(var(--muted-foreground))' },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    style: { strokeWidth: 2, stroke: 'hsl(var(--muted-foreground))' },
  },
];