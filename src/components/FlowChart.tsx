import { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CustomNode } from './CustomNode';
import { Sidebar } from './Sidebar';
import { initialNodes, initialEdges } from '../data/initialElements';

const nodeTypes = {
  custom: CustomNode,
};

export const FlowChart = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const newNode = {
          id: `${type}-${Date.now()}`,
          type: 'custom',
          position,
          data: { 
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
            nodeType: type,
          },
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, setNodes]
  );

  const onDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  }, [setNodes, setEdges]);

  const onUpdateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  const generateFromPrompt = useCallback(async (prompt: string, apiKey: string) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a detailed mindmap/flowchart structure for: "${prompt}". 

Please respond with ONLY a valid JSON object containing nodes and edges arrays. Use this exact format:

{
  "nodes": [
    {
      "id": "unique-id",
      "type": "custom",
      "position": {"x": number, "y": number},
      "data": {
        "label": "Node text",
        "nodeType": "text|decision|process|start"
      }
    }
  ],
  "edges": [
    {
      "id": "unique-edge-id",
      "source": "source-node-id",
      "target": "target-node-id",
      "type": "default"
    }
  ]
}

Create 5-10 nodes with meaningful connections. Position nodes in a logical flow layout. Use different nodeType values (text, decision, process, start) appropriately.`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error('No content received from API');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      if (!parsedData.nodes || !parsedData.edges) {
        throw new Error('Invalid response format - missing nodes or edges');
      }

      // Clear existing nodes and add generated ones
      setNodes(parsedData.nodes);
      setEdges(parsedData.edges);
      
    } catch (error) {
      console.error('Generation error:', error);
      throw error;
    }
  }, [setNodes, setEdges]);

  return (
    <div className="flex h-screen bg-canvas-background">
      <Sidebar onGenerateFromPrompt={generateFromPrompt} />
      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-canvas-background"
          connectionLineStyle={{ strokeWidth: 2, stroke: 'hsl(var(--primary))' }}
          defaultEdgeOptions={{
            style: { strokeWidth: 2, stroke: 'hsl(var(--muted-foreground))' },
          }}
        >
          <Controls className="bg-card border-border shadow-soft" />
          <MiniMap 
            className="bg-card border-border shadow-soft"
            nodeColor="hsl(var(--primary))"
            maskColor="hsl(var(--muted) / 0.8)"
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1} 
            color="hsl(var(--canvas-grid))"
          />
        </ReactFlow>
      </div>
    </div>
  );
};