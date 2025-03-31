
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, FileUp } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import { JobStore } from '@/utils/data';

const FileUploadJobForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file type - only accept CSV, XML, XLS, XLSX
      const validTypes = ['text/csv', 'application/xml', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Please upload a CSV, XML, XLS, or XLSX file.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    
    // Simulate processing the file
    setTimeout(() => {
      // Create random sample data for the job fields
      const mailingHouses = ["Mailing House A", "Mailing House B"];
      const jobTypes = ["Unsorted", "Sorted"];
      const formats = ["Letter", "Large Letter", "Packets"];
      const services = ["Priority", "Standard", "Economy"];
      const sortations = ["Mailmark", "Manual", "Poll Sort"];
      const mailTypes = ["Advertising Mail", "Business Mail", "Partially Addressed Mail", "Catalogue Mail"];
      const presentations = ["Trays", "Bags", "Bundles"];
      const bureauServices = ["Print and Post", "Label File Only"];
      const dataTypes = ["Raw Data", "Sorted Data"];
      const bagLabels = ["White", "Yellow"];
      
      // Generate random values
      const getRandomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)];
      const getRandomNumber = (max: number) => Math.floor(Math.random() * max) + 1;
      const getRandomDate = () => new Date(Date.now() + getRandomNumber(30) * 24 * 60 * 60 * 1000).toISOString();
      
      // Store additional metadata as JSON
      const customFieldsJson = JSON.stringify({
        fileUpload: true,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString(),
        customerName: user?.name || "Sample Customer",
        subClientName: user?.subClients?.[0]?.name || "Sample Subclient",
        mailingHouse: getRandomItem(mailingHouses),
        jobName: `Job from ${file.name}`,
        poNumber: `PO-${getRandomNumber(9999)}`,
        fdm: Math.random() > 0.5,
        itemWeight: getRandomNumber(500),
        jobType: getRandomItem(jobTypes),
        format: getRandomItem(formats),
        service: getRandomItem(services),
        sortation: getRandomItem(sortations),
        mailType: getRandomItem(mailTypes),
        presentation: getRandomItem(presentations),
        bureauService: getRandomItem(bureauServices),
        dataType: getRandomItem(dataTypes),
        consumablesRequired: Math.random() > 0.5,
        productionStartDate: getRandomDate(),
        productionEndDate: getRandomDate(),
        consumablesRequiredDate: getRandomDate(),
        bagLabels: getRandomItem(bagLabels),
        trays: getRandomNumber(20),
        magnums: getRandomNumber(5),
        pallets: getRandomNumber(3),
        yorks: getRandomNumber(2),
        additionalInfo: `Automatically processed from file: ${file.name}\nGenerated job with random sample data`
      });
      
      const newJob = JobStore.addJob({
        title: `Job from ${file.name}`,
        description: `Automatically created from file upload: ${file.name}\n\n${customFieldsJson}`,
        status: 'pending',
        collectionDate: new Date().toISOString(),
        handoverDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        itemCount: getRandomNumber(100),
        bagCount: getRandomNumber(10),
        createdBy: user?.name || 'Unknown',
        files: [{
          id: `file-${Date.now()}`,
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type,
          uploadedBy: user?.name || 'Unknown',
          uploadedAt: new Date().toISOString(),
        }],
        subClientId: user?.subClients?.[0]?.id || '',
        subClientName: user?.subClients?.[0]?.name || '',
        clientName: user?.role === 'admin' ? '' : user?.name || '',
      });

      setIsUploading(false);
      setFile(null);
      setOpen(false);
      
      toast({
        title: "Job Created via File Upload",
        description: `Job ${newJob.reference} has been created successfully from ${file.name}.`,
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-jobBlue hover:bg-jobBlue-light">
          <FileUp className="mr-2 h-4 w-4" /> Book via File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Job via File Upload</DialogTitle>
          <DialogDescription>
            Upload a CSV, XML, XLS, or XLSX file to create a job automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <Alert variant="warning">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <div className="flex flex-col items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV, XML, XLS, XLSX</p>
                  {file && (
                    <p className="mt-2 text-sm font-medium text-jobBlue">{file.name}</p>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".csv,.xml,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,application/xml"
                />
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-jobBlue hover:bg-jobBlue-light"
              disabled={!file || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Book Job'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadJobForm;
