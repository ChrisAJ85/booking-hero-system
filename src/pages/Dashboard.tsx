import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import FileUploadJobForm from '@/components/FileUploadJobForm';
import UCIDRequestForm from '@/components/UCIDRequestForm';
import JobForm from '@/components/JobForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job, JobStore } from '@/utils/data';
import { useAuth } from '@/utils/auth';
import { Calendar, Clock, Eye, File, Users, AlertTriangle, ExternalLink } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMissingEmanifestDialog, setShowMissingEmanifestDialog] = useState(false);
  
  useEffect(() => {
    if (location.state) {
      if (location.state.activeForm) {
        setActiveForm(location.state.activeForm);
      } else if (location.state.formType) {
        setActiveForm(location.state.formType);
      }
      window.history.replaceState({}, document.title);
    }
    
    const loadedJobs = JobStore.getJobs();
    const updatedJobs = loadedJobs.map(job => {
      if (job.id === '1' && !job.emanifestId) {
        return { ...job, emanifestId: 'EM-123456' };
      }
      if (job.id === '2' && !job.emanifestId) {
        return { ...job, emanifestId: 'EM-234567' };
      }
      if (job.id === '5' && !job.emanifestId) {
        return { ...job, emanifestId: 'EM-567890' };
      }
      return job;
    });
    JobStore.saveJobs(updatedJobs);
    setJobs(updatedJobs);
  }, [location]);
  
  const filteredJobs = () => {
    if (activeTab === 'all') return jobs;
    return jobs.filter(job => job.status === activeTab);
  };

  const missingEmanifestJobs = jobs.filter(job => !job.emanifestId);
  const hasMissingEmanifests = missingEmanifestJobs.length > 0;

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">PENDING</Badge>;
      case 'in_progress':
        return <Badge className="bg-jobGray-light text-jobGray-dark border-jobGray">IN PROGRESS</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">COMPLETED</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-300">CANCELLED</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">{String(status).toUpperCase()}</Badge>;
    }
  };

  const handleShowMissingEmanifests = () => {
    setShowMissingEmanifestDialog(true);
  };

  const handleShowEmanifest = (job: Job) => {
    if (job.emanifestId) {
      toast({
        title: "eManifest Details",
        description: `eManifest ID: ${job.emanifestId} for job: ${job.title}`,
      });
    } else {
      toast({
        title: "Missing eManifest",
        description: "This job does not have an eManifest ID assigned.",
        variant: "destructive"
      });
    }
  };

  const handleCloseForm = () => {
    setActiveForm(null);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>
            
            {hasMissingEmanifests && (
              <div className="mb-6 bg-[#FEF7CD] border border-amber-400 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-black mr-3 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-black font-semibold text-lg">Missing eManifest IDs</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-black">
                        There are {missingEmanifestJobs.length} jobs missing eManifest IDs. These jobs are highlighted in red below.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleShowMissingEmanifests}
                        className="flex items-center gap-1 mt-1 bg-white border-amber-400 text-black hover:bg-amber-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Show missing</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Jobs</p>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                </div>
                <File className="h-10 w-10 text-jobGray opacity-20" />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold">
                    {jobs.filter(job => job.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-orange-500 opacity-20" />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold">
                    {jobs.filter(job => job.status === 'in_progress').length}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-blue-500 opacity-20" />
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold">
                    {jobs.filter(job => job.status === 'completed').length}
                  </p>
                </div>
                <Users className="h-10 w-10 text-green-500 opacity-20" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Jobs Overview</h2>
              </div>
              
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <div className="p-4 border-b">
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="p-4">
                  {jobs.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No jobs found</p>
                      <Button
                        onClick={() => setActiveForm('job')}
                        className="bg-jobBlue hover:bg-jobBlue-light"
                      >
                        Create New Job
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Collection Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>eManifest ID</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs().map(job => (
                          <TableRow 
                            key={job.id} 
                            className={!job.emanifestId ? 'bg-red-50' : ''}
                          >
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.reference}</TableCell>
                            <TableCell>{job.subClientName || job.clientName}</TableCell>
                            <TableCell>{formatDate(job.collectionDate)}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell>
                              {job.emanifestId ? job.emanifestId : 
                                <span className="text-red-500 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Missing
                                </span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleShowEmanifest(job)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Show</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                
                <TabsContent value="pending" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No pending jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Collection Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>eManifest ID</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs().map(job => (
                          <TableRow 
                            key={job.id} 
                            className={!job.emanifestId ? 'bg-red-50' : ''}
                          >
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.reference}</TableCell>
                            <TableCell>{job.subClientName || job.clientName}</TableCell>
                            <TableCell>{formatDate(job.collectionDate)}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell>
                              {job.emanifestId ? job.emanifestId : 
                                <span className="text-red-500 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Missing
                                </span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleShowEmanifest(job)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Show</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                
                <TabsContent value="in_progress" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No in-progress jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Collection Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>eManifest ID</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs().map(job => (
                          <TableRow 
                            key={job.id} 
                            className={!job.emanifestId ? 'bg-red-50' : ''}
                          >
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.reference}</TableCell>
                            <TableCell>{job.subClientName || job.clientName}</TableCell>
                            <TableCell>{formatDate(job.collectionDate)}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell>
                              {job.emanifestId ? job.emanifestId : 
                                <span className="text-red-500 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Missing
                                </span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleShowEmanifest(job)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Show</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No completed jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Collection Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>eManifest ID</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs().map(job => (
                          <TableRow 
                            key={job.id} 
                            className={!job.emanifestId ? 'bg-red-50' : ''}
                          >
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.reference}</TableCell>
                            <TableCell>{job.subClientName || job.clientName}</TableCell>
                            <TableCell>{formatDate(job.collectionDate)}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell>
                              {job.emanifestId ? job.emanifestId : 
                                <span className="text-red-500 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Missing
                                </span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleShowEmanifest(job)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Show</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No cancelled jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead>Client</TableHead>
                          <TableHead>Collection Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>eManifest ID</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobs().map(job => (
                          <TableRow 
                            key={job.id} 
                            className={!job.emanifestId ? 'bg-red-50' : ''}
                          >
                            <TableCell className="font-medium">{job.title}</TableCell>
                            <TableCell>{job.reference}</TableCell>
                            <TableCell>{job.subClientName || job.clientName}</TableCell>
                            <TableCell>{formatDate(job.collectionDate)}</TableCell>
                            <TableCell>{getStatusBadge(job.status)}</TableCell>
                            <TableCell>
                              {job.emanifestId ? job.emanifestId : 
                                <span className="text-red-500 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Missing
                                </span>
                              }
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => navigate(`/jobs/${job.id}`)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>View</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleShowEmanifest(job)}
                                  className="flex items-center gap-1 p-1 h-auto"
                                >
                                  <Eye className="h-3 w-3" />
                                  <span>Show</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
              
              {filteredJobs().length > 0 && (
                <div className="p-4 border-t flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Showing {filteredJobs().length} jobs
                  </p>
                  <Button
                    onClick={() => navigate('/search')}
                    variant="outline"
                    size="sm"
                  >
                    View All Jobs
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={activeForm === 'file'} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book via File</DialogTitle>
            <DialogDescription>Upload a file to create a new job</DialogDescription>
          </DialogHeader>
          <FileUploadJobForm />
        </DialogContent>
      </Dialog>

      <Dialog open={activeForm === 'ucid'} onOpenChange={(open) => !open && handleCloseForm()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request New UCID</DialogTitle>
            <DialogDescription>Fill in the details to request a new UCID</DialogDescription>
          </DialogHeader>
          <UCIDRequestForm />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showMissingEmanifestDialog} onOpenChange={setShowMissingEmanifestDialog}>
        <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Jobs Missing eManifest IDs</AlertDialogTitle>
            <AlertDialogDescription>
              The following jobs are missing eManifest IDs and require attention.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="max-h-[60vh] overflow-auto my-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Collection Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>eManifest ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {missingEmanifestJobs.map(job => (
                  <TableRow key={job.id} className="bg-red-50">
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.reference}</TableCell>
                    <TableCell>{job.subClientName || job.clientName}</TableCell>
                    <TableCell>{formatDate(job.collectionDate)}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="flex items-center gap-1 p-1 h-auto"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
