
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import DocumentCard from '@/components/DocumentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus } from 'lucide-react';
import { Document, DocumentStore, getDocumentsByRole } from '@/utils/data';
import { useAuth, UserRole } from '@/utils/auth';
import { toast } from '@/hooks/use-toast';

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    file: null as File | null,
    accessRoles: ['user', 'manager', 'admin'] as UserRole[]
  });
  
  useEffect(() => {
    if (user) {
      const docs = getDocumentsByRole(user.role);
      setDocuments(docs);
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    }
  };
  
  const handleRoleChange = (value: string) => {
    let roles: UserRole[] = [];
    
    if (value === 'all') {
      roles = ['user', 'manager', 'admin'];
    } else if (value === 'managersAndAdmin') {
      roles = ['manager', 'admin'];
    } else if (value === 'adminOnly') {
      roles = ['admin'];
    }
    
    setFormData({
      ...formData,
      accessRoles: roles
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.file) {
      toast({
        title: "Form Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new document
    const newDocument = DocumentStore.addDocument({
      name: formData.name,
      description: formData.description,
      url: URL.createObjectURL(formData.file),
      type: formData.file.type,
      uploadedBy: user?.name || 'Unknown',
      accessRoles: formData.accessRoles
    });
    
    toast({
      title: "Document Uploaded",
      description: "Document has been uploaded successfully."
    });
    
    setOpen(false);
    
    // Refresh documents list
    if (user) {
      const docs = getDocumentsByRole(user.role);
      setDocuments(docs);
    }
  };
  
  const handleDeleteDocument = (id: string) => {
    DocumentStore.deleteDocument(id);
    
    toast({
      title: "Document Deleted",
      description: "Document has been deleted successfully."
    });
    
    // Refresh documents list
    if (user) {
      const docs = getDocumentsByRole(user.role);
      setDocuments(docs);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
              
              {isAdmin() && (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-jobBlue hover:bg-jobBlue-light">
                      <Plus className="mr-2 h-4 w-4" /> Upload Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Upload New Document</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Document Name*</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>File*</Label>
                        <div className="border rounded-md p-4">
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">PDF, DOC, XLS, PNG, JPG</p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={handleFileChange}
                                />
                              </label>
                            </div>
                            
                            {formData.file && (
                              <div className="p-2 bg-gray-50 rounded flex justify-between items-center">
                                <span className="text-sm truncate">{formData.file.name}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0" 
                                  onClick={() => setFormData({...formData, file: null})}
                                >
                                  &times;
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Access Permission</Label>
                        <Select defaultValue="all" onValueChange={handleRoleChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select permission" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="managersAndAdmin">Managers & Admin Only</SelectItem>
                            <SelectItem value="adminOnly">Admin Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-jobBlue hover:bg-jobBlue-light">
                          Upload Document
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents available</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {isAdmin() 
                      ? "Start uploading documents that your team can access." 
                      : "There are no documents available for your role."}
                  </p>
                  
                  {isAdmin() && (
                    <DialogTrigger asChild>
                      <Button className="bg-jobBlue hover:bg-jobBlue-light">
                        <Plus className="mr-2 h-4 w-4" /> Upload Document
                      </Button>
                    </DialogTrigger>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map(document => (
                    <DocumentCard 
                      key={document.id} 
                      document={document} 
                      onDelete={isAdmin() ? handleDeleteDocument : undefined}
                      isAdmin={isAdmin()}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
