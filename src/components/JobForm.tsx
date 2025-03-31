
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Plus, Upload } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { JobStore } from '@/utils/data';
import { useAuth } from '@/utils/auth';

const JobForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    itemCount: 0,
    bagCount: 0,
    files: [] as File[],
  });
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(undefined);
  const [handoverDate, setHandoverDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10) || 0,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFormData({
        ...formData,
        files: [...formData.files, ...fileArray],
      });
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !collectionDate || !handoverDate) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Convert files to the expected format
    const fileObjects = formData.files.map((file, index) => ({
      id: `temp-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedBy: user?.name || 'Unknown',
      uploadedAt: new Date().toISOString(),
    }));

    // Add new job
    const newJob = JobStore.addJob({
      title: formData.title,
      description: formData.description,
      status: 'pending',
      collectionDate: collectionDate.toISOString(),
      handoverDate: handoverDate.toISOString(),
      itemCount: formData.itemCount,
      bagCount: formData.bagCount,
      createdBy: user?.name || 'Unknown',
      files: fileObjects,
    });

    toast({
      title: "Job Created",
      description: `Job ${newJob.reference} has been created successfully.`,
    });

    setOpen(false);
    navigate(`/jobs/${newJob.id}`);
  };

  const validateDates = () => {
    if (collectionDate && handoverDate && collectionDate > handoverDate) {
      toast({
        title: "Date Error",
        description: "Collection date must be before handover date.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-jobBlue hover:bg-jobBlue-light">
          <Plus className="mr-2 h-4 w-4" /> New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Collection Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !collectionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {collectionDate ? format(collectionDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={collectionDate}
                      onSelect={(date) => {
                        setCollectionDate(date);
                        validateDates();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Handover Date*</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !handoverDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {handoverDate ? format(handoverDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={handoverDate}
                      onSelect={(date) => {
                        setHandoverDate(date);
                        validateDates();
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemCount">Item Count</Label>
                <Input
                  id="itemCount"
                  name="itemCount"
                  type="number"
                  min="0"
                  value={formData.itemCount}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bagCount">Bag Count</Label>
                <Input
                  id="bagCount"
                  name="bagCount"
                  type="number"
                  min="0"
                  value={formData.bagCount}
                  onChange={handleNumberChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="border rounded-md p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, DOC, XLS, PNG, JPG</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {formData.files.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected Files:</p>
                      <ul className="space-y-1">
                        {formData.files.map((file, index) => (
                          <li key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                            <span className="truncate flex-1">{file.name}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0" 
                              onClick={() => removeFile(index)}
                            >
                              &times;
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-jobBlue hover:bg-jobBlue-light">
              Create Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
