
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, User } from 'lucide-react';
import { Document } from '@/utils/data';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onDelete?: (id: string) => void;
  isAdmin: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, isAdmin }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getFileTypeIcon = (type: string) => {
    if (type.includes('pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileText className="h-10 w-10 text-green-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="h-10 w-10 text-blue-500" />;
    } else {
      return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-start space-x-4 pb-2">
        <div className="bg-gray-100 p-3 rounded-md">
          {getFileTypeIcon(document.type)}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-medium">{document.name}</CardTitle>
          <p className="text-xs text-gray-500 mt-1">
            {document.type.split('/').pop()?.toUpperCase()} • {formatDate(document.uploadedAt)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-600">{document.description}</p>
        <div className="mt-4 flex flex-wrap gap-1">
          {document.accessRoles.map((role) => (
            <Badge key={role} variant="outline" className="text-xs capitalize">
              {role}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-3 flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-500">
          <User className="h-3 w-3 mr-1" />
          <span>Uploaded by {document.uploadedBy}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center"
            asChild
          >
            <a href={document.url} download>
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
          
          {isAdmin && onDelete && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(document.id)}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
