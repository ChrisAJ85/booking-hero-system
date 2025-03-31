import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobStore, ClientStore } from '@/utils/data';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

type JobFormProps = {
  onSuccess?: () => void;
};

const JobForm = ({ onSuccess }: JobFormProps) => {
  const [title, setTitle] = useState('');
  const [reference, setReference] = useState('');
  const [clientName, setClientName] = useState('');
  const [subClientName, setSubClientName] = useState('');
  const [collectionDate, setCollectionDate] = useState<Date | undefined>();
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [isSubClient, setIsSubClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<string[]>([]);
  const [subClients, setSubClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedSubClient, setSelectedSubClient] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const storedClients = ClientStore.getClients();
    setClients(storedClients);
  }, []);

  useEffect(() => {
    if (clientName) {
      const storedSubClients = ClientStore.getSubClients(clientName);
      setSubClients(storedSubClients);
    } else {
      setSubClients([]);
      setSubClientName('');
    }
  }, [clientName]);

  const generateJobId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !reference || !clientName || !collectionDate || !status) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const jobId = generateJobId();
    const newJob = {
      id: jobId,
      title,
      reference,
      clientName,
      subClientName: isSubClient ? subClientName : '',
      collectionDate: collectionDate.toISOString(),
      status,
      notes,
      createdBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
    };

    JobStore.addJob(newJob);
    
    toast({
      title: "Job Created",
      description: `Job "${title}" has been successfully created with ID: ${jobId}`,
    });
    
    if (onSuccess) {
      onSuccess();
    } else {
      navigate('/dashboard');
    }
  };

  const handleClientChange = (value: string) => {
    setClientName(value);
    setSubClientName('');
    setSelectedClient(value);
    setSelectedSubClient("");
  };

  const handleSubClientChange = (value: string) => {
    setSubClientName(value);
    setSelectedSubClient(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter job title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="reference">Reference</Label>
        <Input
          type="text"
          id="reference"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Enter reference"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="clientName">Client Name</Label>
        <Select onValueChange={handleClientChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="isSubClient" className="flex items-center space-x-2">
          <span>Is Sub Client?</span>
          <Switch
            id="isSubClient"
            checked={isSubClient}
            onCheckedChange={(checked) => {
              setIsSubClient(checked);
              if (!checked) {
                setSubClientName('');
              }
            }}
          />
        </Label>
      </div>

      {isSubClient && (
        <div>
          <Label htmlFor="subClientName">Sub Client Name</Label>
          <Select onValueChange={handleSubClientChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a sub client" />
            </SelectTrigger>
            <SelectContent>
              {subClients.map((subClient) => (
                <SelectItem key={subClient} value={subClient}>
                  {subClient}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <Label>Collection Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !collectionDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {collectionDate ? (
                format(collectionDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={collectionDate}
              onSelect={setCollectionDate}
              disabled={(date) =>
                date > new Date()
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter notes"
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => {
            if (onSuccess) {
              onSuccess();
            } else {
              navigate('/dashboard');
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-jobBlue hover:bg-jobBlue-light"
        >
          Create Job
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
