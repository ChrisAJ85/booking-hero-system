
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth, Client, clients, SubClient } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building, Plus, Edit, Trash2, Users, ChevronDown, ChevronRight } from 'lucide-react';

const ClientManagement = () => {
  const { isAdmin } = useAuth();
  const [clientsList, setClientsList] = useState<Client[]>(clients);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subClientDialogOpen, setSubClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingSubClient, setEditingSubClient] = useState<{
    subClient: SubClient | null;
    clientId: string;
  }>({ subClient: null, clientId: '' });
  const [expandedClients, setExpandedClients] = useState<string[]>([]);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    businessName: ''
  });
  const [subClientFormData, setSubClientFormData] = useState({
    name: ''
  });

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

  const toggleClientExpanded = (clientId: string) => {
    setExpandedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientFormData({
      ...clientFormData,
      [name]: value
    });
  };

  const handleSubClientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubClientFormData({
      ...subClientFormData,
      [name]: value
    });
  };

  const resetClientForm = () => {
    setClientFormData({
      name: '',
      businessName: ''
    });
    setEditingClient(null);
  };

  const resetSubClientForm = () => {
    setSubClientFormData({
      name: ''
    });
    setEditingSubClient({ subClient: null, clientId: '' });
  };

  const handleAddClient = () => {
    setDialogOpen(true);
    resetClientForm();
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setClientFormData({
      name: client.name,
      businessName: client.businessName
    });
    setDialogOpen(true);
  };

  const handleAddSubClient = (clientId: string) => {
    setEditingSubClient({ subClient: null, clientId });
    resetSubClientForm();
    setSubClientDialogOpen(true);
  };

  const handleEditSubClient = (clientId: string, subClient: SubClient) => {
    setEditingSubClient({ subClient, clientId });
    setSubClientFormData({
      name: subClient.name
    });
    setSubClientDialogOpen(true);
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientFormData.name) {
      toast({
        title: "Form Error",
        description: "Please enter a client name.",
        variant: "destructive"
      });
      return;
    }

    let updatedClients: Client[];
    
    if (editingClient) {
      // Edit existing client
      updatedClients = clientsList.map(c => 
        c.id === editingClient.id ? { 
          ...c, 
          name: clientFormData.name,
          businessName: clientFormData.businessName
        } : c
      );
      
      toast({
        title: "Client Updated",
        description: "Client has been updated successfully."
      });
    } else {
      // Add new client
      const newClient: Client = {
        id: `client-${Date.now()}`,
        name: clientFormData.name,
        businessName: clientFormData.businessName,
        subClients: []
      };
      
      updatedClients = [...clientsList, newClient];
      
      toast({
        title: "Client Added",
        description: "Client has been added successfully."
      });
    }
    
    setClientsList(updatedClients);
    setDialogOpen(false);
    resetClientForm();
  };

  const handleSubClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subClientFormData.name) {
      toast({
        title: "Form Error",
        description: "Please enter a sub-client name.",
        variant: "destructive"
      });
      return;
    }

    const clientId = editingSubClient.clientId;
    let updatedClients = [...clientsList];
    const clientIndex = updatedClients.findIndex(c => c.id === clientId);
    
    if (clientIndex === -1) {
      toast({
        title: "Error",
        description: "Client not found.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingSubClient.subClient) {
      // Edit existing sub-client
      const subClientIndex = updatedClients[clientIndex].subClients.findIndex(
        sc => sc.id === editingSubClient.subClient?.id
      );
      
      if (subClientIndex !== -1) {
        updatedClients[clientIndex].subClients[subClientIndex].name = subClientFormData.name;
        
        toast({
          title: "Sub-Client Updated",
          description: "Sub-client has been updated successfully."
        });
      }
    } else {
      // Add new sub-client
      const newSubClient: SubClient = {
        id: `subclient-${Date.now()}`,
        name: subClientFormData.name
      };
      
      updatedClients[clientIndex].subClients.push(newSubClient);
      
      toast({
        title: "Sub-Client Added",
        description: "Sub-client has been added successfully."
      });
      
      // Ensure the client is expanded
      if (!expandedClients.includes(clientId)) {
        setExpandedClients([...expandedClients, clientId]);
      }
    }
    
    setClientsList(updatedClients);
    setSubClientDialogOpen(false);
    resetSubClientForm();
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedClients = clientsList.filter(c => c.id !== clientId);
    setClientsList(updatedClients);
    
    toast({
      title: "Client Deleted",
      description: "Client and all associated sub-clients have been deleted."
    });
  };

  const handleDeleteSubClient = (clientId: string, subClientId: string) => {
    const updatedClients = clientsList.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          subClients: client.subClients.filter(sc => sc.id !== subClientId)
        };
      }
      return client;
    });
    
    setClientsList(updatedClients);
    
    toast({
      title: "Sub-Client Deleted",
      description: "Sub-client has been deleted successfully."
    });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Client Management</h1>
              
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-jobBlue hover:bg-jobBlue-light" onClick={handleAddClient}>
                    <Building className="mr-2 h-4 w-4" /> Add Client
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleClientSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={clientFormData.name}
                        onChange={handleClientInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        value={clientFormData.businessName}
                        onChange={handleClientInputChange}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-jobBlue hover:bg-jobBlue-light">
                        {editingClient ? 'Update Client' : 'Add Client'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              
              {/* Sub-Client Dialog */}
              <Dialog open={subClientDialogOpen} onOpenChange={setSubClientDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSubClient.subClient ? 'Edit Sub-Client' : 'Add New Sub-Client'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubClientSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="subClientName">Sub-Client Name*</Label>
                      <Input
                        id="subClientName"
                        name="name"
                        value={subClientFormData.name}
                        onChange={handleSubClientInputChange}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => setSubClientDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-jobBlue hover:bg-jobBlue-light">
                        {editingSubClient.subClient ? 'Update Sub-Client' : 'Add Sub-Client'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {clientsList.length === 0 ? (
                <div className="text-center p-8">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No clients</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new client.</p>
                  <div className="mt-6">
                    <Button className="bg-jobBlue hover:bg-jobBlue-light" onClick={handleAddClient}>
                      <Building className="mr-2 h-4 w-4" /> Add Client
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Client Name</TableHead>
                      <TableHead className="w-[30%]">Business Name</TableHead>
                      <TableHead className="w-[15%]">Sub-Clients</TableHead>
                      <TableHead className="w-[15%] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsList.map(client => (
                      <>
                        <TableRow key={client.id} className="border-b-0">
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="p-0 h-6 w-6 mr-2"
                                onClick={() => toggleClientExpanded(client.id)}
                              >
                                {expandedClients.includes(client.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                              {client.name}
                            </div>
                          </TableCell>
                          <TableCell>{client.businessName}</TableCell>
                          <TableCell>{client.subClients.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddSubClient(client.id)}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add Sub-Client</span>
                              </Button>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditClient(client)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the client "{client.name}" and all associated sub-clients. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteClient(client.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                        
                        {/* Sub-clients rows (expandable) */}
                        {expandedClients.includes(client.id) && client.subClients.map(subClient => (
                          <TableRow key={`${client.id}-${subClient.id}`} className="bg-gray-50">
                            <TableCell className="pl-12">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-gray-500" />
                                {subClient.name}
                              </div>
                            </TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleEditSubClient(client.id, subClient)}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-500 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the sub-client "{subClient.name}". This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteSubClient(client.id, subClient.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        
                        {/* Empty state when expanded but no sub-clients */}
                        {expandedClients.includes(client.id) && client.subClients.length === 0 && (
                          <TableRow className="bg-gray-50">
                            <TableCell colSpan={4} className="text-center py-4">
                              <div className="flex flex-col items-center">
                                <p className="text-sm text-gray-500 mb-2">No sub-clients available</p>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleAddSubClient(client.id)}
                                >
                                  <Plus className="h-4 w-4 mr-2" /> Add Sub-Client
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
