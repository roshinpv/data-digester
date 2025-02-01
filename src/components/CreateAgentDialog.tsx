import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Upload, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CreateAgentDialogProps {
  onAgentCreate: (agent: {
    name: string;
    description: string;
    files: File[];
    urls: string[];
    isRecursive: boolean;
  }) => void;
}

export const CreateAgentDialog = ({ onAgentCreate }: CreateAgentDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isRecursive, setIsRecursive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAddUrl = () => {
    if (currentUrl) {
      try {
        new URL(currentUrl);
        setUrls([...urls, currentUrl]);
        setCurrentUrl("");
      } catch {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid URL",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = () => {
    if (!name) {
      toast({
        title: "Name required",
        description: "Please enter a name for your agent",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0 && urls.length === 0) {
      toast({
        title: "Content required",
        description: "Please add at least one file or URL",
        variant: "destructive",
      });
      return;
    }

    onAgentCreate({
      name,
      description,
      files,
      urls,
      isRecursive,
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setFiles([]);
    setUrls([]);
    setCurrentUrl("");
    setIsRecursive(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-agent-primary hover:bg-agent-secondary">
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Agent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What this agent knows about..."
            />
          </div>
          <div className="space-y-2">
            <Label>Files</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agent-primary cursor-pointer"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Label>
            </div>
            {files.length > 0 && (
              <div className="text-sm text-gray-500">
                {files.length} file(s) selected
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>URLs</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="https://example.com"
              />
              <Button
                type="button"
                onClick={handleAddUrl}
                className="shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {urls.length > 0 && (
              <div className="space-y-2">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Link className="w-4 h-4" />
                    <span className="text-gray-600 truncate">{url}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="recursive"
              checked={isRecursive}
              onCheckedChange={setIsRecursive}
            />
            <Label htmlFor="recursive">Enable recursive crawling</Label>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-agent-primary hover:bg-agent-secondary"
          >
            Create Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};