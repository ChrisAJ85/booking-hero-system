
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Download, FileText, Paperclip, User, Users } from 'lucide-react';
import { Job, JobStore, getJobById } from '@/utils/data';
import { useAuth } from '@/utils/auth';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [statusChanged, setStatusChanged] = useState(false);
  const [customFields, setCustomFields] = useState<any>(null);
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (jobId) {
      const foundJob = getJobById(jobId);
      if (foundJob) {
        setJob(foundJob);
        
        try {
          const descParts = foundJob.description.split('\n\n');
          if (descParts.length > 1) {
            const jsonStr = descParts[descParts.length - 1];
            const parsedCustomFields = JSON.parse(jsonStr);
            setCustomFields(parsedCustomFields);
          }
        } catch (e) {
          console.error('Error parsing custom fields:', e);
        }
      } else {
        toast({
          title: "Error",
          description: "Job not found",
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    }
  }, [jobId, navigate]);
  
  if (!job) {
    return <div>Loading...</div>;
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };
  
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const handleStatusChange = (newStatus: string) => {
    const updatedJob = {
      ...job,
      status: newStatus as Job['status']
    };
    
    JobStore.updateJob(updatedJob);
    setJob(updatedJob);
    setStatusChanged(true);
    
    toast({
      title: "Status Updated",
      description: `Job status changed to ${newStatus.replace('_', ' ')}`
    });
  };

  const getCleanDescription = () => {
    if (!job.description) return '';
    const parts = job.description.split('\n\n');
    return parts.length > 1 ? parts[0] : job.description;
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">Reference: {job.reference}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                {hasPermission('manager') && (
                  <Select defaultValue={job.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                        <p className="mt-1">{getCleanDescription()}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Collection Date</h3>
                          <p className="mt-1 flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-jobBlue" />
                            {formatDate(job.collectionDate)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Handover Date</h3>
                          <p className="mt-1 flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-jobBlue" />
                            {formatDate(job.handoverDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Item Count</h3>
                          <p className="mt-1">{job.itemCount}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Bag Count</h3>
                          <p className="mt-1">{job.bagCount}</p>
                        </div>
                      </div>

                      {customFields && (
                        <>
                          {(customFields.customerName || customFields.subClientName || customFields.mailingHouse || customFields.jobName || customFields.poNumber) && (
                            <div className="pt-2">
                              <h3 className="text-md font-medium border-b pb-1 mb-2">Customer Information</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {customFields.customerName && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                                    <p className="mt-1">{customFields.customerName}</p>
                                  </div>
                                )}
                                {customFields.subClientName && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Subclient</h3>
                                    <p className="mt-1">{customFields.subClientName}</p>
                                  </div>
                                )}
                                {customFields.mailingHouse && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Mailing House</h3>
                                    <p className="mt-1">{customFields.mailingHouse}</p>
                                  </div>
                                )}
                                {customFields.jobName && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Job Name</h3>
                                    <p className="mt-1">{customFields.jobName}</p>
                                  </div>
                                )}
                                {customFields.poNumber && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">PO Number</h3>
                                    <p className="mt-1">{customFields.poNumber}</p>
                                  </div>
                                )}
                                {customFields.fdm && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">FDM</h3>
                                    <p className="mt-1">Yes</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {(customFields.jobType || customFields.format || customFields.service || customFields.sortation || 
                            customFields.mailType || customFields.presentation || customFields.itemWeight) && (
                            <div className="pt-2">
                              <h3 className="text-md font-medium border-b pb-1 mb-2">Job Specifications</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {customFields.itemWeight > 0 && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Item Weight</h3>
                                    <p className="mt-1">{customFields.itemWeight}g</p>
                                  </div>
                                )}
                                {customFields.jobType && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Job Type</h3>
                                    <p className="mt-1">{customFields.jobType}</p>
                                  </div>
                                )}
                                {customFields.format && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Format</h3>
                                    <p className="mt-1">{customFields.format}</p>
                                  </div>
                                )}
                                {customFields.service && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Service</h3>
                                    <p className="mt-1">{customFields.service}</p>
                                  </div>
                                )}
                                {customFields.sortation && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Sortation</h3>
                                    <p className="mt-1">{customFields.sortation}</p>
                                  </div>
                                )}
                                {customFields.mailType && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Mail Type</h3>
                                    <p className="mt-1">{customFields.mailType}</p>
                                  </div>
                                )}
                                {customFields.presentation && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Presentation</h3>
                                    <p className="mt-1">{customFields.presentation}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {(customFields.bureauService || customFields.dataType) && (
                            <div className="pt-2">
                              <h3 className="text-md font-medium border-b pb-1 mb-2">Bureau Services</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {customFields.bureauService && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Label</h3>
                                    <p className="mt-1">{customFields.bureauService}</p>
                                  </div>
                                )}
                                {customFields.dataType && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Data</h3>
                                    <p className="mt-1">{customFields.dataType}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {customFields.consumablesRequired && (
                            <div className="pt-2">
                              <h3 className="text-md font-medium border-b pb-1 mb-2">Consumables</h3>
                              <div className="grid grid-cols-2 gap-4">
                                {customFields.productionStartDate && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Production Start</h3>
                                    <p className="mt-1 flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-jobBlue" />
                                      {formatDate(customFields.productionStartDate)}
                                    </p>
                                  </div>
                                )}
                                {customFields.productionEndDate && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Production End</h3>
                                    <p className="mt-1 flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-jobBlue" />
                                      {formatDate(customFields.productionEndDate)}
                                    </p>
                                  </div>
                                )}
                                {customFields.consumablesRequiredDate && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Required By</h3>
                                    <p className="mt-1 flex items-center">
                                      <Calendar className="h-4 w-4 mr-1 text-jobBlue" />
                                      {formatDate(customFields.consumablesRequiredDate)}
                                    </p>
                                  </div>
                                )}
                                {customFields.bagLabels && (
                                  <div>
                                    <h3 className="text-sm font-medium text-gray-500">Bag Labels</h3>
                                    <p className="mt-1">{customFields.bagLabels}</p>
                                  </div>
                                )}
                              </div>
                              
                              {(customFields.trays > 0 || customFields.magnums > 0 || 
                                customFields.pallets > 0 || customFields.yorks > 0) && (
                                <div className="mt-2">
                                  <h3 className="text-sm font-medium text-gray-500">Quantities</h3>
                                  <div className="grid grid-cols-4 gap-2 mt-1">
                                    {customFields.trays > 0 && (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <p className="text-xs text-gray-500">Trays</p>
                                        <p className="font-medium">{customFields.trays}</p>
                                      </div>
                                    )}
                                    {customFields.magnums > 0 && (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <p className="text-xs text-gray-500">Magnums</p>
                                        <p className="font-medium">{customFields.magnums}</p>
                                      </div>
                                    )}
                                    {customFields.pallets > 0 && (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <p className="text-xs text-gray-500">Pallets</p>
                                        <p className="font-medium">{customFields.pallets}</p>
                                      </div>
                                    )}
                                    {customFields.yorks > 0 && (
                                      <div className="bg-gray-50 p-2 rounded text-center">
                                        <p className="text-xs text-gray-500">Yorks</p>
                                        <p className="font-medium">{customFields.yorks}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {customFields.additionalInfo && (
                            <div className="pt-2">
                              <h3 className="text-md font-medium border-b pb-1 mb-2">Additional Information</h3>
                              <p className="mt-1 whitespace-pre-line">{customFields.additionalInfo}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {job.files.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No attachments available</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {job.files.map((file) => (
                          <div 
                            key={file.id} 
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-6 w-6 text-jobBlue" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded by {file.uploadedBy} on {formatDate(file.uploadedAt)}
                                </p>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <a href={file.url} download>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {hasPermission('manager') && (
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">
                          <Paperclip className="h-4 w-4 mr-2" />
                          Upload Attachment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                      <p className="mt-1 flex items-center">
                        <User className="h-4 w-4 mr-1 text-jobBlue" />
                        {job.createdBy}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                      <p className="mt-1 flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-jobBlue" />
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                      <p className="mt-1 flex items-center">
                        <Users className="h-4 w-4 mr-1 text-jobBlue" />
                        {job.assignedTo || 'Not assigned'}
                      </p>
                    </div>
                    
                    {statusChanged && (
                      <div className="bg-green-50 p-3 rounded-md text-sm text-green-800">
                        Status has been updated successfully
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {hasPermission('manager') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Assign Job
                      </Button>
                      <Button variant="outline" className="w-full">
                        Generate Report
                      </Button>
                      {hasPermission('admin') && (
                        <Button variant="destructive" className="w-full">
                          Delete Job
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
