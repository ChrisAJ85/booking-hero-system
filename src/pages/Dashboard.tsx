
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import JobCard from '@/components/JobCard';
import JobForm from '@/components/JobForm';
import UCIDRequestForm from '@/components/UCIDRequestForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job, JobStore } from '@/utils/data';
import { useAuth } from '@/utils/auth';
import { Calendar, Clock, File, Users } from 'lucide-react';

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load jobs from the store
    setJobs(JobStore.getJobs());
  }, []);
  
  const filteredJobs = () => {
    if (activeTab === 'all') return jobs;
    return jobs.filter(job => job.status === activeTab);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <div className="space-x-2">
                <JobForm />
                <UCIDRequestForm />
              </div>
            </div>
            
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
                      <JobForm />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs().map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No pending jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs().map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="in_progress" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No in-progress jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs().map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No completed jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs().map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="p-4">
                  {filteredJobs().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No cancelled jobs</p>
                      <JobForm />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs().map(job => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
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
    </div>
  );
};

export default Dashboard;
