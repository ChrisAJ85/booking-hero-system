
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, Clock, ExternalLink, FileUp, MapPin } from 'lucide-react';
import { Job } from '@/utils/data';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'in_progress':
        return 'bg-jobGray-light text-jobGray-dark border-jobGray';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  // Check if job was created via file upload
  const isFileUpload = () => {
    try {
      if (job.description && job.description.includes('fileUpload')) {
        const parts = job.description.split('\n\n');
        if (parts.length > 1) {
          const jsonStr = parts[parts.length - 1];
          const parsedFields = JSON.parse(jsonStr);
          return parsedFields.fileUpload === true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Extract custom fields if available
  const getCustomFields = () => {
    try {
      if (job.description && job.description.includes('{')) {
        const parts = job.description.split('\n\n');
        if (parts.length > 1) {
          const jsonStr = parts[parts.length - 1];
          return JSON.parse(jsonStr);
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  };
  
  const customFields = getCustomFields();
  
  // Get clean description without the JSON part
  const getCleanDescription = () => {
    if (!job.description) return '';
    const parts = job.description.split('\n\n');
    return parts.length > 1 ? parts[0] : job.description;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-medium">{job.title}</CardTitle>
            {isFileUpload() && (
              <span className="inline-flex items-center text-xs text-blue-600">
                <FileUp className="h-3 w-3 mr-1" />
                File Upload
              </span>
            )}
          </div>
          <Badge className={getStatusColor(job.status)}>
            {job.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <p className="text-xs text-gray-500">Reference: {job.reference}</p>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-2 text-gray-600 mb-4">
          {getCleanDescription()}
        </p>
        
        <div className="mb-3 flex items-center text-sm text-jobGray">
          <Building className="h-3.5 w-3.5 mr-1" />
          <span>
            {job.subClientName || 'No client specified'} 
            {job.clientName && <span className="text-xs text-gray-500 ml-1">({job.clientName})</span>}
          </span>
        </div>
        
        {customFields && customFields.collectionAddress && (
          <div className="mb-2 flex items-start text-xs text-gray-600">
            <MapPin className="h-3 w-3 mr-1 mt-0.5 text-jobGray" />
            <span className="line-clamp-1">Collection: {customFields.collectionAddress.split('\n')[0]}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-jobGray" />
            <span>Collection: {formatDate(job.collectionDate)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-jobGray" />
            <span>Handover: {formatDate(job.handoverDate)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3 text-xs text-gray-500">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Created: {formatDate(job.createdAt)}</span>
        </div>
        <Link to={`/jobs/${job.id}`} className="text-jobGray hover:underline flex items-center gap-1">
          <span>View details</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
