import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code24Regular, Eye20Regular, Save24Regular, ArrowExport24Regular, Branch24Regular } from '@fluentui/react-icons';
import { toast } from 'sonner';
import { CanvasComponent } from '@/types/component';
import { generateComponentCode } from '@/lib/code-generator';

interface TopToolbarProps {
  components: CanvasComponent[];
  onExport: (config: any) => void;
}

export function TopToolbar({ components, onExport }: TopToolbarProps) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [componentName, setComponentName] = useState('MyComponent');
  const [exportType, setExportType] = useState<'local' | 'git'>('local');
  const [gitRepo, setGitRepo] = useState('');
  const [gitBranch, setGitBranch] = useState('main');

  const handleSave = () => {
    toast.success('Component saved locally!');
  };

  const handlePreview = () => {
    toast.info('Preview mode - coming soon!');
  };

  const handleExport = () => {
    if (!componentName.trim()) {
      toast.error('Please enter a component name');
      return;
    }

    const rootComponent: CanvasComponent = {
      id: 'root',
      type: 'div',
      props: {},
      children: components,
      events: [],
      styles: ''
    };

    const code = generateComponentCode(rootComponent, componentName);

    const config = {
      destination: exportType,
      componentName,
      code,
      ...(exportType === 'git' && {
        repository: gitRepo,
        branch: gitBranch
      })
    };

    onExport(config);
    setIsExportOpen(false);
    
    if (exportType === 'local') {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${componentName}.tsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${componentName}.tsx downloaded!`);
    } else {
      toast.success('Export configuration saved!');
    }
  };

  return (
    <>
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Code24Regular className="text-primary w-6 h-6" />
            <h1 className="text-lg font-bold">ComponentForge</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
          >
            <Eye20Regular className="mr-2 w-4 h-4 inline-block" />
            Preview
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
          >
            <Save24Regular className="mr-2 w-4 h-4 inline-block" />
            Save
          </Button>

          <Button
            size="sm"
            onClick={() => setIsExportOpen(true)}
            disabled={components.length === 0}
          >
            <ArrowExport24Regular className="mr-2 w-4 h-4 inline-block" />
            Export
          </Button>
        </div>
      </div>

      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Component</DialogTitle>
            <DialogDescription>
              Choose how you want to export your React component
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="component-name">Component Name</Label>
              <Input
                id="component-name"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                placeholder="MyComponent"
                className="mt-1"
              />
            </div>

            <Tabs value={exportType} onValueChange={(v) => setExportType(v as 'local' | 'git')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local">Local Download</TabsTrigger>
                <TabsTrigger value="git">Git Repository</TabsTrigger>
              </TabsList>

              <TabsContent value="local" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Download the TypeScript component file to your local machine.
                </p>
              </TabsContent>

              <TabsContent value="git" className="space-y-4">
                <div>
                  <Label htmlFor="git-repo">Repository URL</Label>
                  <Input
                    id="git-repo"
                    value={gitRepo}
                    onChange={(e) => setGitRepo(e.target.value)}
                    placeholder="https://github.com/username/repo"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="git-branch">Branch</Label>
                  <Input
                    id="git-branch"
                    value={gitBranch}
                    onChange={(e) => setGitBranch(e.target.value)}
                    placeholder="main"
                    className="mt-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  <Branch24Regular style={{width:14,height:14}} className="inline mr-1" />
                  Note: Git integration requires authentication
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export Component
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}