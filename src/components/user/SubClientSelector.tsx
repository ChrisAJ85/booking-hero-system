
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

export interface SubClientWithClient {
  id: string;
  name: string;
  clientName: string;
}

interface SubClientSelectorProps {
  subClients: SubClientWithClient[];
  selectedSubClients: string[];
  onChange: (subClientId: string, isChecked: boolean) => void;
  onAddNewSubClient?: (name: string, clientId: string) => void;
  clients?: Array<{ id: string; name: string }>;
}

const SubClientSelector = ({ 
  subClients, 
  selectedSubClients, 
  onChange,
  onAddNewSubClient,
  clients = []
}: SubClientSelectorProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubClientName, setNewSubClientName] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(clients.length > 0 ? clients[0]?.id : '');

  const handleAddSubClient = () => {
    if (newSubClientName.trim() && selectedClientId && onAddNewSubClient) {
      onAddNewSubClient(newSubClientName.trim(), selectedClientId);
      setNewSubClientName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Can book jobs for sub-clients</Label>
      <div className="border rounded-md p-3 max-h-60 overflow-y-auto">
        {subClients.length > 0 ? (
          <div className="space-y-2">
            {subClients.map(subclient => (
              <div key={subclient.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`subclient-${subclient.id}`}
                  checked={selectedSubClients.includes(subclient.id)}
                  onCheckedChange={(checked) => 
                    onChange(subclient.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`subclient-${subclient.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {subclient.name} <span className="text-xs text-gray-500">({subclient.clientName})</span>
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No sub-clients available</p>
        )}

        {onAddNewSubClient && clients.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            {!showAddForm ? (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add New Sub-Client
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">New Sub-Client</Label>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAddForm(false)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Input
                    placeholder="Sub-client name"
                    value={newSubClientName}
                    onChange={(e) => setNewSubClientName(e.target.value)}
                    className="mb-2"
                  />
                  
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                  >
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={handleAddSubClient}
                    disabled={!newSubClientName.trim() || !selectedClientId}
                    className="w-full"
                  >
                    Add Sub-Client
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubClientSelector;
