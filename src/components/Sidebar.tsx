import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  FileText, 
  Diamond, 
  Square, 
  Circle, 
  Download, 
  Upload, 
  Trash2,
  Zap,
  Sparkles,
  Key
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ui/use-toast';

const nodeTypes = [
  { type: 'text', icon: FileText, label: 'Text Node', color: 'text-foreground' },
  { type: 'decision', icon: Diamond, label: 'Decision', color: 'text-warning' },
  { type: 'process', icon: Square, label: 'Process', color: 'text-primary' },
  { type: 'start', icon: Circle, label: 'Start/End', color: 'text-success' },
];

export const Sidebar = ({ onGenerateFromPrompt }: { onGenerateFromPrompt: (prompt: string, apiKey: string) => Promise<void> }) => {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key",
        variant: "destructive"
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt Required", 
        description: "Please enter a prompt to generate the mindmap",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerateFromPrompt(prompt, apiKey);
      toast({
        title: "Success",
        description: "Mindmap generated successfully!"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate mindmap",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
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

        {/* AI Generation */}
        <h3 className="text-sm font-semibold text-sidebar-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Generation
        </h3>
        
        <div className="space-y-3 mb-6">
          <div>
            <Label htmlFor="apiKey" className="text-xs text-sidebar-foreground/80 mb-1 flex items-center gap-1">
              <Key className="w-3 h-3" />
              Gemini API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-sidebar-accent/30 border-sidebar-border text-xs"
            />
          </div>
          
          <div>
            <Label htmlFor="prompt" className="text-xs text-sidebar-foreground/80 mb-1">
              Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder="Describe the mindmap you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-sidebar-accent/30 border-sidebar-border text-xs min-h-[60px] resize-none"
            />
          </div>
          
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            size="sm"
            className="w-full gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Mindmap'}
          </Button>
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