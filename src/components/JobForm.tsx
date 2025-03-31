import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Plus, Upload } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { JobStore } from '@/utils/data';
import { useAuth } from '@/utils/auth';

const mailingHouses = ["Mailing House A", "Mailing House B"];
const jobTypes = ["Unsorted", "Sorted"];
const formatOptions = ["Letter", "Large Letter", "Packets"];
const serviceOptions = ["Priority", "Standard", "Economy"];
const sortationOptions = ["Mailmark", "Manual", "Poll Sort"];
const mailTypeOptions = ["Advertising Mail", "Business Mail", "Partially Addressed Mail", "Catalogue Mail"];
const presentationOptions = ["Trays", "Bags", "Bundles"];
const bureauServiceOptions = ["Print and Post", "Label File Only"];
const dataOptions = ["Raw Data", "Sorted Data"];
const bagLabelOptions = ["White", "Yellow"];

const JobForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    subClientId: '',
    mailingHouse: '',
    poNumber: '',
    fdm: false,
    itemWeight: 0,
    jobType: '',
    format: '',
    service: '',
    sortation: '',
    mailType: '',
    presentation: '',
    bureauService: '',
    dataType: '',
    consumablesRequired: false,
    bagLabels: 'White',
    trays: 0,
    magnums: 0,
    pallets: 0,
    yorks: 0,
    additionalInfo: '',
  });
  
  const [collectionDate, setCollectionDate] = useState<Date | undefined>(undefined);
  const [handoverDate, setHandoverDate] = useState<Date | undefined>(undefined);
  const [productionStartDate, setProductionStartDate] = useState<Date | undefined>(undefined);
  const [productionEndDate, setProductionEndDate] = useState<Date | undefined>(undefined);
  const [consumablesRequiredDate, setConsumablesRequiredDate] = useState<Date | undefined>(undefined);
  
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [subClients, setSubClients] = useState<Array<{ id: string; name: string; clientId: string; clientName: string }>>([]);
  const [filteredSubClients, setFilteredSubClients] = useState<Array<{ id: string; name: string; clientName: string }>>([]);

  useEffect(() => {
    if (open) {
      console.log("Dialog opened, user data:", user);
      
      if (!user?.subClients || user.subClients.length === 0) {
        console.log("No subClients found for user, adding default options");
        
        const defaultClients = [
          { id: 'default-client-1', name: 'Sample Client' },
          { id: 'default-client-2', name: 'Test Client' }
        ];
        
        const defaultSubClients = [
          { 
            id: 'default-subclient-1', 
            name: 'Sample Subclient 1', 
            clientId: 'default-client-1',
            clientName: 'Sample Client'
          },
          { 
            id: 'default-subclient-2', 
            name: 'Sample Subclient 2', 
            clientId: 'default-client-1',
            clientName: 'Sample Client'
          },
          { 
            id: 'default-subclient-3', 
            name: 'Test Subclient', 
            clientId: 'default-client-2',
            clientName: 'Test Client'
          }
        ];
        
        setClients(defaultClients);
        setSubClients(defaultSubClients);
      } else {
        const clientMap = new Map();
        
        user.subClients.forEach(sc => {
          if (sc.clientName) {
            clientMap.set(sc.clientName, { 
              id: sc.clientName, 
              name: sc.clientName 
            });
          }
        });
        
        const clientList = Array.from(clientMap.values());
        console.log("Extracted clients:", clientList);
        setClients(clientList);
        
        const subClientList = user.subClients.map(sc => ({
          id: sc.id,
          name: sc.name,
          clientId: sc.clientName,
          clientName: sc.clientName
        }));
        console.log("Formatted subclients:", subClientList);
        setSubClients(subClientList);
      }
    }
  }, [open, user]);

  useEffect(() => {
    if (formData.clientId) {
      setFilteredSubClients(
        subClients.filter(sc => sc.clientId === formData.clientId)
      );
    } else {
      setFilteredSubClients([]);
    }
  }, [formData.clientId, subClients]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;
    
    if (name === 'itemWeight' && numValue > 999) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: numValue,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setDataFiles([...dataFiles, ...fileArray]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setDataFiles(dataFiles.filter((_, index) => index !== indexToRemove));
  };

  const validateDates = () => {
    let valid = true;
    
    if (collectionDate && handoverDate && collectionDate > handoverDate) {
      toast({
        title: "Date Error",
        description: "Collection date must be before handover date.",
        variant: "destructive"
      });
      valid = false;
    }
    
    if (formData.consumablesRequired) {
      if (productionStartDate && productionEndDate && productionStartDate > productionEndDate) {
        toast({
          title: "Date Error",
          description: "Production start date must be before production end date.",
          variant: "destructive"
        });
        valid = false;
      }
      
      if (productionEndDate && consumablesRequiredDate && productionEndDate > consumablesRequiredDate) {
        toast({
          title: "Date Error",
          description: "Production end date must be before consumables required date.",
          variant: "destructive"
        });
        valid = false;
      }
    }
    
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !collectionDate || !handoverDate || !formData.clientId || !formData.subClientId) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!validateDates()) {
      return;
    }

    const selectedSubClient = subClients.find(sc => sc.id === formData.subClientId);
    console.log("Selected subclient:", selectedSubClient);

    const fileObjects = dataFiles.map((file, index) => ({
      id: `temp-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      uploadedBy: user?.name || 'Unknown',
      uploadedAt: new Date().toISOString(),
    }));

    const customFieldsJson = JSON.stringify({
      mailingHouse: formData.mailingHouse,
      poNumber: formData.poNumber,
      fdm: formData.fdm,
      itemWeight: formData.itemWeight,
      jobType: formData.jobType,
      format: formData.format,
      service: formData.service,
      sortation: formData.sortation,
      mailType: formData.mailType,
      presentation: formData.presentation,
      bureauService: formData.bureauService,
      dataType: formData.dataType,
      consumablesRequired: formData.consumablesRequired,
      productionStartDate: productionStartDate?.toISOString(),
      productionEndDate: productionEndDate?.toISOString(),
      consumablesRequiredDate: consumablesRequiredDate?.toISOString(),
      bagLabels: formData.bagLabels,
      trays: formData.trays,
      magnums: formData.magnums,
      pallets: formData.pallets,
      yorks: formData.yorks,
      additionalInfo: formData.additionalInfo,
    });

    const newJob = JobStore.addJob({
      title: formData.title,
      description: `${formData.description}\n\n${customFieldsJson}`,
      status: 'pending',
      collectionDate: collectionDate.toISOString(),
      handoverDate: handoverDate.toISOString(),
      itemCount: 0,
      bagCount: 0,
      createdBy: user?.name || 'Unknown',
      files: fileObjects,
      subClientId: formData.subClientId,
      subClientName: selectedSubClient?.name || '',
      clientName: selectedSubClient?.clientName || '',
    });

    toast({
      title: "Job Created",
      description: `Job ${newJob.reference} has been created successfully.`,
    });

    setOpen(false);
    navigate(`/jobs/${newJob.id}`);
  };

  useEffect(() => {
    if (!open) {
      setFormData({
        title: '',
        description: '',
        clientId: '',
        subClientId: '',
        mailingHouse: '',
        poNumber: '',
        fdm: false,
        itemWeight: 0,
        jobType: '',
        format: '',
        service: '',
        sortation: '',
        mailType: '',
        presentation: '',
        bureauService: '',
        dataType: '',
        consumablesRequired: false,
        bagLabels: 'White',
        trays: 0,
        magnums: 0,
        pallets: 0,
        yorks: 0,
        additionalInfo: '',
      });
      setCollectionDate(undefined);
      setHandoverDate(undefined);
      setProductionStartDate(undefined);
      setProductionEndDate(undefined);
      setConsumablesRequiredDate(undefined);
      setDataFiles([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-jobBlue hover:bg-jobBlue-light">
          <Plus className="mr-2 h-4 w-4" /> New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Fill in the job details to create a new job.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Customer and Job Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Customer Name*</Label>
                <Select 
                  value={formData.clientId} 
                  onValueChange={(value) => handleSelectChange('clientId', value)}
                >
                  <SelectTrigger id="clientId">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.length === 0 ? (
                      <SelectItem value="no-clients">No customers available</SelectItem>
                    ) : (
                      clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subClientId">Subclient Name*</Label>
                <Select 
                  value={formData.subClientId} 
                  onValueChange={(value) => handleSelectChange('subClientId', value)}
                  disabled={!formData.clientId || formData.clientId === 'no-clients'}
                >
                  <SelectTrigger id="subClientId">
                    <SelectValue placeholder="Select a subclient" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubClients.length === 0 ? (
                      <SelectItem value="no-subclients">No subclients available</SelectItem>
                    ) : (
                      filteredSubClients.map(subclient => (
                        <SelectItem key={subclient.id} value={subclient.id}>
                          {subclient.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mailingHouse">Mailing House</Label>
                <Select 
                  value={formData.mailingHouse} 
                  onValueChange={(value) => handleSelectChange('mailingHouse', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a mailing house" />
                  </SelectTrigger>
                  <SelectContent>
                    {mailingHouses.map(house => (
                      <SelectItem key={house} value={house}>
                        {house}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Name*</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number</Label>
                <Input
                  id="poNumber"
                  name="poNumber"
                  value={formData.poNumber}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2 flex items-center">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="fdm" 
                    checked={formData.fdm} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('fdm', checked as boolean)
                    }
                  />
                  <Label htmlFor="fdm">FDM</Label>
                </div>
              </div>
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
                      onSelect={(date) => setCollectionDate(date)}
                      initialFocus
                      className="pointer-events-auto"
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
                      onSelect={(date) => setHandoverDate(date)}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Job Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="itemWeight">Item Weight (g)</Label>
                <Input
                  id="itemWeight"
                  name="itemWeight"
                  type="number"
                  min="0"
                  max="999"
                  value={formData.itemWeight}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select 
                  value={formData.jobType} 
                  onValueChange={(value) => handleSelectChange('jobType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Select 
                  value={formData.format} 
                  onValueChange={(value) => handleSelectChange('format', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select 
                  value={formData.service} 
                  onValueChange={(value) => handleSelectChange('service', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sortation">Sortation</Label>
                <Select 
                  value={formData.sortation} 
                  onValueChange={(value) => handleSelectChange('sortation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sortation" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortationOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mailType">Mail Type</Label>
                <Select 
                  value={formData.mailType} 
                  onValueChange={(value) => handleSelectChange('mailType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mail type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mailTypeOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="presentation">Presentation</Label>
                <Select 
                  value={formData.presentation} 
                  onValueChange={(value) => handleSelectChange('presentation', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select presentation" />
                  </SelectTrigger>
                  <SelectContent>
                    {presentationOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bureau Services</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bureauService">Label</Label>
                <Select 
                  value={formData.bureauService} 
                  onValueChange={(value) => handleSelectChange('bureauService', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {bureauServiceOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dataType">Data</Label>
                <Select 
                  value={formData.dataType} 
                  onValueChange={(value) => handleSelectChange('dataType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dataOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Data Files</Label>
              <div className="border rounded-md p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">CSV, XLS, XLSX, PDF, DOC</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {dataFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Selected Files:</p>
                      <ul className="space-y-1">
                        {dataFiles.map((file, index) => (
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
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Consumables</h3>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consumablesRequired" 
                  checked={formData.consumablesRequired} 
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('consumablesRequired', checked as boolean)
                  }
                />
                <Label htmlFor="consumablesRequired">Consumables Required</Label>
              </div>
            </div>
            
            {formData.consumablesRequired && (
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Production Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !productionStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {productionStartDate ? format(productionStartDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={productionStartDate}
                          onSelect={(date) => setProductionStartDate(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Production End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !productionEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {productionEndDate ? format(productionEndDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={productionEndDate}
                          onSelect={(date) => setProductionEndDate(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Consumables Required By</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !consumablesRequiredDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {consumablesRequiredDate ? format(consumablesRequiredDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={consumablesRequiredDate}
                          onSelect={(date) => setConsumablesRequiredDate(date)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bagLabels">Bag Labels</Label>
                    <Select 
                      value={formData.bagLabels} 
                      onValueChange={(value) => handleSelectChange('bagLabels', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {bagLabelOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trays">Trays</Label>
                    <Input
                      id="trays"
                      name="trays"
                      type="number"
                      min="0"
                      value={formData.trays}
                      onChange={handleNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="magnums">Magnums</Label>
                    <Input
                      id="magnums"
                      name="magnums"
                      type="number"
                      min="0"
                      value={formData.magnums}
                      onChange={handleNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pallets">Pallets</Label>
                    <Input
                      id="pallets"
                      name="pallets"
                      type="number"
                      min="0"
                      value={formData.pallets}
                      onChange={handleNumberChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="yorks">Yorks</Label>
                    <Input
                      id="yorks"
                      name="yorks"
                      type="number"
                      min="0"
                      value={formData.yorks}
                      onChange={handleNumberChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Details</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={5}
                className="resize-none"
              />
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
