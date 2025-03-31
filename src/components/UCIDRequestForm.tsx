
import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Mail, MapPin, FileText, Calendar, Hash, Tag, User, UserCog } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface UCIDRequestFormData {
  type: 'UCID' | 'SCID';
  clientName: string;
  requestorEmail: string;
  // UCID specific fields
  collectionPointName?: string;
  agencyAccount?: 'yes' | 'no';
  // SCID specific fields
  dateRequested?: string;
  supplyChainId?: string;
  supplyChainType?: '2D' | '4 state';
  supplyChainName?: string;
  mailOriginator?: string;
  mailOriginatorParticipantId?: string;
  mailingAgent?: string;
  comments: string;
}

const UCIDRequestForm = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [requestType, setRequestType] = useState<'UCID' | 'SCID'>('UCID');
  
  const form = useForm<UCIDRequestFormData>({
    defaultValues: {
      type: 'UCID',
      clientName: '',
      requestorEmail: user?.email || '',
      collectionPointName: '',
      agencyAccount: 'no',
      dateRequested: format(new Date(), 'yyyy-MM-dd'),
      supplyChainId: '',
      supplyChainType: '2D',
      supplyChainName: '',
      mailOriginator: '',
      mailOriginatorParticipantId: '',
      mailingAgent: '',
      comments: ''
    }
  });
  
  // Listen for changes to the request type
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'type') {
        setRequestType(value.type as 'UCID' | 'SCID');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  const onSubmit = (data: UCIDRequestFormData) => {
    try {
      // Add the request to the store
      UCIDRequestStore.addRequest({
        type: data.type,
        clientName: data.clientName,
        requestorEmail: data.requestorEmail,
        // Conditionally include fields based on request type
        ...(data.type === 'UCID' && {
          collectionPointName: data.collectionPointName,
          agencyAccount: data.agencyAccount === 'yes',
        }),
        ...(data.type === 'SCID' && {
          dateRequested: data.dateRequested,
          supplyChainId: data.supplyChainId,
          supplyChainType: data.supplyChainType,
          supplyChainName: data.supplyChainName,
          mailOriginator: data.mailOriginator,
          mailOriginatorParticipantId: data.mailOriginatorParticipantId,
          mailingAgent: data.mailingAgent,
        }),
        comments: data.comments
      });
      
      toast({
        title: `${data.type} Request Submitted`,
        description: "Your request has been successfully submitted."
      });
      
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to submit ${requestType} request. Please try again.`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-jobRed hover:bg-jobRed-light">
          Request New UCID/SCID
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-jobRed">Request New UCID/SCID</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="UCID" id="type-ucid" />
                        <Label htmlFor="type-ucid">UCID</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="SCID" id="type-scid" />
                        <Label htmlFor="type-scid">SCID</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            {requestType === 'UCID' && (
              <>
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
              </>
            )}
            
            {requestType === 'SCID' && (
              <>
                <FormField
                  control={form.control}
                  name="dateRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Requested</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-jobGray" />
                          <Input 
                            type="date" 
                            {...field} 
                            disabled 
                            className="bg-gray-100" 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplyChainId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Chain ID</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Hash className="mr-2 h-4 w-4 text-jobGray" />
                          <Input 
                            placeholder="Supply chain ID" 
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
                  name="supplyChainType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Chain Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <div className="flex items-center">
                            <Tag className="mr-2 h-4 w-4 text-jobGray absolute left-3 z-10" />
                            <SelectTrigger className="pl-10">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </div>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2D">2D</SelectItem>
                          <SelectItem value="4 state">4 state</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="supplyChainName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supply Chain Name</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4 text-jobGray" />
                          <Input 
                            placeholder="Supply chain name" 
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
                  name="mailOriginator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mail Originator</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-jobGray" />
                          <Input 
                            placeholder="Mail originator" 
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
                  name="mailOriginatorParticipantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mail Originator Participant ID</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <UserCog className="mr-2 h-4 w-4 text-jobGray" />
                          <Input 
                            placeholder="Mail originator participant ID" 
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
                  name="mailingAgent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mailing Agent</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-jobGray" />
                          <Input 
                            placeholder="Mailing agent" 
                            {...field} 
                            required 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            
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
