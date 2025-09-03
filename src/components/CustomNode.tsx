import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Trash2, Edit3, Check, X } from 'lucide-react';

interface CustomNodeData {
  label: string;
  nodeType: 'text' | 'decision' | 'process' | 'start';
}

export const CustomNode = memo(({ data, id }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(nodeData.label);

  const handleSave = useCallback(() => {
    // Update node data would go here
    setIsEditing(false);
  }, [editValue]);

  const handleCancel = useCallback(() => {
    setEditValue(nodeData.label);
    setIsEditing(false);
  }, [nodeData.label]);

  const getNodeStyle = () => {
    switch (nodeData.nodeType) {
      case 'decision':
        return 'bg-gradient-to-br from-warning/20 to-warning/5 border-warning/30 transform rotate-45';
      case 'process':
        return 'bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30';
      case 'start':
        return 'bg-gradient-to-br from-success/20 to-success/5 border-success/30 rounded-full';
      default:
        return 'bg-gradient-node border-border';
    }
  };

  const getContentStyle = () => {
    return nodeData.nodeType === 'decision' ? 'transform -rotate-45' : '';
  };

  return (
    <Card className={`
      min-w-[150px] min-h-[80px] p-4 shadow-medium hover:shadow-strong 
      transition-all duration-300 group relative
      ${getNodeStyle()}
    `}>
      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-primary border-2 border-primary-foreground hover:scale-125 transition-transform" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-primary border-2 border-primary-foreground hover:scale-125 transition-transform" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 bg-primary border-2 border-primary-foreground hover:scale-125 transition-transform" 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 bg-primary border-2 border-primary-foreground hover:scale-125 transition-transform" 
      />

      {/* Content */}
      <div className={`flex items-center justify-center h-full ${getContentStyle()}`}>
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
            />
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={handleSave}>
                <Check className="w-3 h-3 text-success" />
              </Button>
              <Button size="sm" variant="ghost" onClick={handleCancel}>
                <X className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-foreground leading-tight">
              {nodeData.label}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            className="w-6 h-6 p-0 shadow-soft"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="w-6 h-6 p-0 shadow-soft"
            onClick={() => {
              // Delete node logic would go here
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
});