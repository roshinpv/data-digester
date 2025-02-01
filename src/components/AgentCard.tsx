import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Plus, Trash2 } from "lucide-react";

interface AgentCardProps {
  name: string;
  description: string;
  onDelete: () => void;
  onChat: () => void;
}

export const AgentCard = ({ name, description, onDelete, onChat }: AgentCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-white border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-agent-background rounded-lg">
            <Bot className="w-6 h-6 text-agent-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-500"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          onClick={onChat}
          className="bg-agent-primary hover:bg-agent-secondary text-white"
        >
          Chat with Agent
        </Button>
      </div>
    </Card>
  );
};