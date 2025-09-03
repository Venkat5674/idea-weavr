import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  FileText, 
  Diamond, 
  Square, 
  Circle, 
  Download, 
  Upload, 
  Trash2,
  Zap
} from 'lucide-react';

const nodeTypes = [
  { type: 'text', icon: FileText, label: 'Text Node', color: 'text-foreground' },
  { type: 'decision', icon: Diamond, label: 'Decision', color: 'text-warning' },
  { type: 'process', icon: Square, label: 'Process', color: 'text-primary' },
  { type: 'start', icon: Circle, label: 'Start/End', color: 'text-success' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="w-80 h-full bg-sidebar-background border-sidebar-border shadow-medium flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">FlowCraft</h1>
            <p className="text-xs text-sidebar-foreground/60">Mind Map Generator</p>
          </div>
        </div>
      </div>

      {/* Node Types */}
      <div className="p-6 flex-1">
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-4">
          Drag to Add Nodes
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            return (
              <Card
                key={node.type}
                className="p-4 cursor-grab active:cursor-grabbing hover:shadow-soft transition-all duration-200 bg-sidebar-accent/50 hover:bg-sidebar-accent border-sidebar-border/50"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <Icon className={`w-5 h-5 ${node.color}`} />
                  <span className="text-xs font-medium text-sidebar-foreground">
                    {node.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        <Separator className="mb-6" />

        {/* Actions */}
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-4">
          Actions
        </h3>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-3 bg-sidebar-accent/30 hover:bg-sidebar-accent border-sidebar-border"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-3 bg-sidebar-accent/30 hover:bg-sidebar-accent border-sidebar-border"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start gap-3 bg-sidebar-accent/30 hover:bg-sidebar-accent border-sidebar-border text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="text-xs font-semibold text-primary mb-2">💡 Tips</h4>
          <ul className="text-xs text-sidebar-foreground/70 space-y-1">
            <li>• Drag nodes from above to the canvas</li>
            <li>• Click and drag to connect nodes</li>
            <li>• Double-click nodes to edit text</li>
            <li>• Use mouse wheel to zoom</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};