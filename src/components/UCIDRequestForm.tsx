
import { useState } from 'react';
import { UCIDRequestStore } from '@/utils/data';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Building, Mail, MapPin, FileText } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface UCIDRequestFormData {
  clientName: string;
  requestorEmail: string;
  collectionPointName: string;
  agencyAccount: string;
  comments: string;
}

const UCIDRequestForm = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<UCIDRequestFormData>({
    defaultValues: {
      clientName: '',
      requestorEmail: user?.email || '',
      collectionPointName: '',
      agencyAccount: 'no',
      comments: ''
    }
  });
  
  const onSubmit = (data: UCIDRequestFormData) => {
    try {
      UCIDRequestStore.addRequest({
        clientName: data.clientName,
        requestorEmail: data.requestorEmail,
        collectionPointName: data.collectionPointName,
        agencyAccount: data.agencyAccount === 'yes',
        comments: data.comments
      });
      
      toast({
        title: "UCID Request Submitted",
        description: "Your request has been successfully submitted."
      });
      
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit UCID request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-jobRed hover:bg-jobRed-light">
          Request New UCID
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-jobRed">Request New UCID</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Building className="mr-2 h-4 w-4 text-jobGray" />
                      <Input placeholder="Client name" {...field} required />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="requestorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requestor Email</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-jobGray" />
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        {...field} 
                        required 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="collectionPointName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Collection Point Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4 text-jobGray" />
                      <Input 
                        placeholder="Collection point name" 
                        {...field} 
                        required 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agencyAccount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Agency Account</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="agency-yes" />
                        <Label htmlFor="agency-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="agency-no" />
                        <Label htmlFor="agency-no">No</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments</FormLabel>
                  <FormControl>
                    <div className="flex items-start">
                      <FileText className="mr-2 h-4 w-4 mt-3 text-jobGray" />
                      <Textarea 
                        placeholder="Additional information" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-jobRed hover:bg-jobRed-light"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UCIDRequestForm;
