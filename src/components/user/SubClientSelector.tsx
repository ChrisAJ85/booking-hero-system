
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface SubClientWithClient {
  id: string;
  name: string;
  clientName: string;
}

interface SubClientSelectorProps {
  subClients: SubClientWithClient[];
  selectedSubClients: string[];
  onChange: (subClientId: string, isChecked: boolean) => void;
}

const SubClientSelector = ({ 
  subClients, 
  selectedSubClients, 
  onChange 
}: SubClientSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Can book jobs for sub-clients</Label>
      <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
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
      </div>
    </div>
  );
};

export default SubClientSelector;
