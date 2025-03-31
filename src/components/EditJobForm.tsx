
import { useState } from 'react';
import { Job, JobStore } from '@/utils/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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

  // Clean the description to get only the text part
  const getCleanDescription = () => {
    if (!job.description) return '';
    const parts = job.description.split('\n\n');
    return parts.length > 1 ? parts[0] : job.description;
  };

  // Extract custom fields if available
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
    description: z.string().min(1, {
      message: "Description is required",
    }),
    itemCount: z.coerce.number().int().min(0).optional(),
    subClientName: z.string().optional(),
    clientName: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: job.title,
      description: getCleanDescription(),
      itemCount: job.itemCount,
      subClientName: job.subClientName || '',
      clientName: job.clientName || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Preserve custom fields if they exist
    let finalDescription = values.description;
    if (customFields) {
      finalDescription = `${values.description}\n\n${JSON.stringify(customFields)}`;
    }
    
    const updatedJob: Job = {
      ...job,
      title: values.title,
      description: finalDescription,
      itemCount: values.itemCount || 0,
      collectionDate: collectionDate?.toISOString() || job.collectionDate,
      handoverDate: handoverDate?.toISOString() || job.handoverDate,
      subClientName: values.subClientName || undefined,
      clientName: values.clientName || undefined,
    };

    JobStore.updateJob(updatedJob);
    onUpdate(updatedJob);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
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
        
        <FormField
          control={form.control}
          name="itemCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Count</FormLabel>
              <FormControl>
                <Input type="number" min="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <div className="flex justify-end space-x-2">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditJobForm;
