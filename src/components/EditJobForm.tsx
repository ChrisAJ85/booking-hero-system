import { useState } from 'react';
import { Job, JobStore } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Package, PackageCheck, FileText, Truck, User, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditJobFormProps {
  job: Job;
  onUpdate: (updatedJob: Job) => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onUpdate }) => {
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(
    job.collectionDate ? new Date(job.collectionDate) : undefined
  );
  const [handoverDate, setHandoverDate] = useState<Date | undefined>(
    job.handoverDate ? new Date(job.handoverDate) : undefined
  );

  const getCustomFields = () => {
    try {
      if (job.description && job.description.includes('{')) {
        const parts = job.description.split('\n\n');
        if (parts.length > 1) {
          const jsonStr = parts[parts.length - 1];
          return JSON.parse(jsonStr);
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };
  
  const customFields = getCustomFields();

  const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title is required",
    }),
    reference: z.string().min(1, {
      message: "Reference is required",
    }),
    description: z.string().optional(),
    itemCount: z.coerce.number().int().min(0).optional(),
    bagCount: z.coerce.number().int().min(0).optional(),
    subClientName: z.string().optional(),
    clientName: z.string().optional(),
    emanifestId: z.string().optional(),
    assignedTo: z.string().optional(),
    status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job.title,
      reference: job.reference || '',
      description: job.description || '',
      itemCount: job.itemCount || 0,
      bagCount: job.bagCount || 0,
      subClientName: job.subClientName || '',
      clientName: job.clientName || '',
      emanifestId: job.emanifestId || '',
      assignedTo: job.assignedTo || '',
      status: job.status || 'pending',
      notes: job.notes || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    let finalDescription = values.description || '';
    
    const updatedJob: Job = {
      ...job,
      title: values.title,
      reference: values.reference,
      description: finalDescription,
      itemCount: values.itemCount || 0,
      bagCount: values.bagCount || 0,
      status: values.status,
      notes: values.notes,
      collectionDate: collectionDate?.toISOString() || job.collectionDate,
      handoverDate: handoverDate?.toISOString() || job.handoverDate,
      subClientName: values.subClientName || undefined,
      clientName: values.clientName || undefined,
      emanifestId: values.emanifestId || undefined,
      assignedTo: values.assignedTo || undefined,
    };

    JobStore.updateJob(updatedJob);
    onUpdate(updatedJob);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter job description" 
                  className="h-20 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subClientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub-Client Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel>Collection Date</FormLabel>
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
                  {collectionDate ? format(collectionDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={collectionDate}
                  onSelect={setCollectionDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <FormLabel>Handover Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !handoverDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {handoverDate ? format(handoverDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={handoverDate}
                  onSelect={setHandoverDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <User className="h-4 w-4 mr-1" /> Assigned To
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter assignee name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="itemCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Package className="h-4 w-4 mr-1" /> Item Count
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bagCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <PackageCheck className="h-4 w-4 mr-1" /> Bag Count
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emanifestId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" /> E-Manifest ID
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter E-Manifest ID" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                <FileText className="h-4 w-4 mr-1" /> Notes
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter notes" 
                  className="h-20 resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditJobForm;
