
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArtworkSubmission, ArtworkStore } from '@/utils/data';
import { format } from 'date-fns';
import { Check, X, MessageSquare, User, Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';

interface ArtworkCardProps {
  artwork: ArtworkSubmission;
  onUpdateStatus: (id: string) => void;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onUpdateStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const getStatusBadge = (status: ArtworkSubmission['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">PENDING</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-300">APPROVED</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">REJECTED</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">UNKNOWN</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy • h:mm a');
    } catch (e) {
      return dateString;
    }
  };

  const handleApprove = () => {
    if (!feedback.trim() && !isExpanded) {
      setIsExpanded(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      ArtworkStore.updateSubmission(artwork.id, {
        status: 'approved',
        reviewedBy: user?.name || 'Admin User',
        reviewedAt: new Date().toISOString(),
        feedbackComments: feedback.trim() || 'Approved'
      });
      
      toast({
        title: "Artwork Approved",
        description: "The artwork has been approved successfully.",
      });
      
      onUpdateStatus(artwork.id);
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error updating the artwork status.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsExpanded(false);
    }
  };

  const handleReject = () => {
    if (!feedback.trim() && !isExpanded) {
      setIsExpanded(true);
      return;
    }
    
    if (!feedback.trim()) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback explaining why the artwork was rejected.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      ArtworkStore.updateSubmission(artwork.id, {
        status: 'rejected',
        reviewedBy: user?.name || 'Admin User',
        reviewedAt: new Date().toISOString(),
        feedbackComments: feedback
      });
      
      toast({
        title: "Artwork Rejected",
        description: "The artwork has been rejected with feedback.",
      });
      
      onUpdateStatus(artwork.id);
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "There was an error updating the artwork status.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsExpanded(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{artwork.title}</CardTitle>
          {getStatusBadge(artwork.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-md overflow-hidden bg-gray-100 border">
          <img 
            src={artwork.imageUrl} 
            alt={artwork.title} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <MessageSquare className="h-4 w-4 mr-1 text-jobGray" />
            <span className="font-medium">Comments:</span>
          </div>
          <p className="text-sm text-gray-600 pl-5">{artwork.comments}</p>
        </div>
        
        {artwork.feedbackComments && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MessageSquare className="h-4 w-4 mr-1 text-jobGray" />
              <span className="font-medium">Feedback:</span>
            </div>
            <p className="text-sm text-gray-600 pl-5">{artwork.feedbackComments}</p>
          </div>
        )}
        
        {isExpanded && artwork.status === 'pending' && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <MessageSquare className="h-4 w-4 mr-1 text-jobGray" />
              <span className="font-medium">Your Feedback:</span>
            </div>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide feedback about this artwork..."
              className="min-h-[80px]"
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center">
            <User className="h-3 w-3 mr-1 text-jobGray" />
            <span>Submitted by: {artwork.submittedBy}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1 text-jobGray" />
            <span>Date: {formatDate(artwork.submittedAt)}</span>
          </div>
          
          {artwork.reviewedBy && (
            <>
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1 text-jobGray" />
                <span>Reviewed by: {artwork.reviewedBy}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-jobGray" />
                <span>Reviewed: {formatDate(artwork.reviewedAt || '')}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      
      {artwork.status === 'pending' && (
        <CardFooter className="flex justify-end space-x-2 pt-0">
          {isExpanded ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
              <Button
                size="sm"
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ArtworkCard;
