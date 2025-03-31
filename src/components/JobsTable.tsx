
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Job } from '@/utils/data';
import { AlertTriangle, ExternalLink, Eye, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface JobsTableProps {
  jobs: Job[];
}

type SortField = 'title' | 'reference' | 'clientName' | 'collectionDate' | 'status' | 'emanifestId';
type SortDirection = 'asc' | 'desc';

const JobsTable = ({ jobs }: JobsTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to ascending for new field
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'reference':
        comparison = a.reference.localeCompare(b.reference);
        break;
      case 'clientName':
        const clientA = a.subClientName || a.clientName || '';
        const clientB = b.subClientName || b.clientName || '';
        comparison = clientA.localeCompare(clientB);
        break;
      case 'collectionDate':
        comparison = new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'emanifestId':
        const emanifestA = a.emanifestId || '';
        const emanifestB = b.emanifestId || '';
        comparison = emanifestA.localeCompare(emanifestB);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-3 w-3 inline opacity-50" />;
    return (
      <ArrowUpDown 
        className={`ml-1 h-3 w-3 inline ${sortDirection === 'asc' ? 'text-jobBlue' : 'text-jobBlue rotate-180'}`} 
      />
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
            Job Title {getSortIcon('title')}
          </TableHead>
          <TableHead onClick={() => handleSort('reference')} className="cursor-pointer">
            Reference {getSortIcon('reference')}
          </TableHead>
          <TableHead onClick={() => handleSort('clientName')} className="cursor-pointer">
            Client {getSortIcon('clientName')}
          </TableHead>
          <TableHead onClick={() => handleSort('collectionDate')} className="cursor-pointer">
            Collection Date {getSortIcon('collectionDate')}
          </TableHead>
          <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
            Status {getSortIcon('status')}
          </TableHead>
          <TableHead onClick={() => handleSort('emanifestId')} className="cursor-pointer">
            eManifest ID {getSortIcon('emanifestId')}
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedJobs.map(job => (
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
  );
};

export default JobsTable;
