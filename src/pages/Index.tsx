import { useState } from "react";
import { CreateAgentDialog } from "@/components/CreateAgentDialog";
import { AgentCard } from "@/components/AgentCard";
import { AgentChat } from "@/components/AgentChat";
import { useToast } from "@/components/ui/use-toast";

interface Agent {
  id: string;
  name: string;
  description: string;
}

const Index = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAgentCreate = async (agentData: {
    name: string;
    description: string;
    files: File[];
    urls: string[];
    isRecursive: boolean;
  }) => {
    // In a real implementation, this would make an API call to create the agent
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: agentData.name,
      description: agentData.description,
    };

    setAgents([...agents, newAgent]);
    toast({
      title: "Agent Created",
      description: "Your new agent has been created successfully.",
    });
  };

  const handleAgentDelete = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id));
    toast({
      title: "Agent Deleted",
      description: "The agent has been deleted successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Agent Creator</h1>
            <p className="text-gray-500 mt-2">
              Create and manage your AI agents with ease
            </p>
          </div>
          <CreateAgentDialog onAgentCreate={handleAgentCreate} />
        </div>

        {selectedAgent ? (
          <AgentChat
            agentName={agents.find((a) => a.id === selectedAgent)?.name || ""}
            onClose={() => setSelectedAgent(null)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                name={agent.name}
                description={agent.description}
                onDelete={() => handleAgentDelete(agent.id)}
                onChat={() => setSelectedAgent(agent.id)}
              />
            ))}
            {agents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">
                  No agents yet. Create your first agent to get started!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;