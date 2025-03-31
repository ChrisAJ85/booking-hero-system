
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UCIDRequest, UCIDRequestStore } from '@/utils/data';
import { useAuth } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Badge,
  CheckCircle, 
  Clock, 
  Building, 
  Mail, 
  MapPin, 
  FileText,
  Calendar,
  Hash,
  Tag,
  User
} from 'lucide-react';

const UCIDRequests = () => {
  const [requests, setRequests] = useState<UCIDRequest[]>([]);
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    setRequests(UCIDRequestStore.getRequests());
  }, []);
  
  const handleMarkAsComplete = (requestId: string) => {
    if (!user) return;
    
    const updatedRequest = UCIDRequestStore.markAsComplete(requestId, user.name);
    if (updatedRequest) {
      setRequests(UCIDRequestStore.getRequests());
      toast({
        title: "Request Completed",
        description: `The ${updatedRequest.type} request has been marked as complete.`
      });
    }
  };
  
  if (!isAdmin()) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 bg-jobGray-light p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Access Denied</h1>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <p>You don't have permission to access this page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">UCID & SCID Requests</h1>
              {/* Remove the UCIDRequestForm button from here */}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {requests.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">No requests found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Client Name</TableHead>
                      <TableHead>Requestor</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.type === 'UCID' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {request.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4 text-jobGray" />
                            {request.clientName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-jobGray" />
                            {request.requestorEmail}
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.type === 'UCID' && request.collectionPointName && (
                            <div className="flex items-center text-sm">
                              <MapPin className="mr-1 h-3.5 w-3.5 text-jobGray" />
                              {request.collectionPointName}
                            </div>
                          )}
                          {request.type === 'SCID' && request.supplyChainId && (
                            <div className="flex items-center text-sm">
                              <Hash className="mr-1 h-3.5 w-3.5 text-jobGray" />
                              {request.supplyChainId}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {request.status === 'pending' ? (
                              <>
                                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                                <span className="text-orange-500">Pending</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span className="text-green-500">Completed</span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' ? (
                            <Button
                              size="sm"
                              className="bg-jobRed hover:bg-jobRed-light"
                              onClick={() => handleMarkAsComplete(request.id)}
                            >
                              Mark Complete
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Completed by {request.completedBy}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            
            <div className="mt-6">
              <details className="bg-white p-4 rounded-lg shadow-sm">
                <summary className="font-medium cursor-pointer">Request Details</summary>
                <ScrollArea className="h-[500px] mt-4">
                  {requests.map((request) => (
                    <div key={request.id} className="p-4 border-t">
                      <div className="flex items-center mb-2">
                        <Building className="mr-2 h-4 w-4 text-jobGray" />
                        <h3 className="font-medium">{request.clientName}</h3>
                        <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.type === 'UCID' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {request.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 mb-1">Requestor:</p>
                          <p>{request.requestorEmail}</p>
                        </div>
                        
                        {request.type === 'UCID' && (
                          <>
                            <div>
                              <p className="text-gray-500 mb-1">Collection Point:</p>
                              <p>{request.collectionPointName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Agency Account:</p>
                              <p>{request.agencyAccount ? 'Yes' : 'No'}</p>
                            </div>
                          </>
                        )}
                        
                        {request.type === 'SCID' && (
                          <>
                            <div>
                              <p className="text-gray-500 mb-1">Date Requested:</p>
                              <p>{request.dateRequested}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Supply Chain ID:</p>
                              <p>{request.supplyChainId}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Supply Chain Type:</p>
                              <p>{request.supplyChainType}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Supply Chain Name:</p>
                              <p>{request.supplyChainName}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Mail Originator:</p>
                              <p>{request.mailOriginator}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Mail Originator Participant ID:</p>
                              <p>{request.mailOriginatorParticipantId}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 mb-1">Mailing Agent:</p>
                              <p>{request.mailingAgent}</p>
                            </div>
                          </>
                        )}
                        
                        <div>
                          <p className="text-gray-500 mb-1">Status:</p>
                          <p className={request.status === 'pending' ? 'text-orange-500' : 'text-green-500'}>
                            {request.status === 'pending' ? 'Pending' : 'Completed'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <p className="text-gray-500 mb-1">Comments:</p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <FileText className="inline mr-2 h-4 w-4 text-jobGray" />
                          {request.comments || 'No comments provided.'}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UCIDRequests;
