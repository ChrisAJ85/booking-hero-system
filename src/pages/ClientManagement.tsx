
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/utils/auth';
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
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Building, Plus, Edit, Trash2, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { ClientStore, Client, SubClient } from '@/utils/data';

const ClientManagement = () => {
  const { isAdmin } = useAuth();
  const [clientsList, setClientsList] = useState<Client[]>([]);
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

  useEffect(() => {
    const loadedClients = ClientStore.getClients();
    console.log("Loaded clients:", loadedClients);
    setClientsList(loadedClients);
  }, []);

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
      businessName: client.businessName || ''
    });
    setDialogOpen(true);
  };

  const handleAddSubClient = (clientId: string) => {
    console.log("Adding sub-client for client ID:", clientId);
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

    if (editingClient) {
      const updatedClient = {
        ...editingClient,
        name: clientFormData.name,
        businessName: clientFormData.businessName
      };
      
      ClientStore.updateClient(updatedClient);
      
      setClientsList(prevClients =>
        prevClients.map(c => c.id === updatedClient.id ? updatedClient : c)
      );
      
      toast({
        title: "Client Updated",
        description: "Client has been updated successfully."
      });
    } else {
      const newClient = ClientStore.addClient({
        name: clientFormData.name,
        businessName: clientFormData.businessName,
        subClients: []
      });
      
      setClientsList(prevClients => [...prevClients, newClient]);
      
      toast({
        title: "Client Added",
        description: "Client has been added successfully."
      });
    }
    
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

    const { clientId } = editingSubClient;
    console.log("Submitting sub-client for client ID:", clientId);
    
    if (!clientId) {
      toast({
        title: "Error",
        description: "Client ID is missing. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingSubClient.subClient) {
      // Updating existing sub-client
      const updatedSubClient = {
        ...editingSubClient.subClient,
        name: subClientFormData.name
      };
      
      console.log("Updating sub-client:", updatedSubClient);
      const result = ClientStore.updateSubClient(clientId, updatedSubClient);
      
      if (result) {
        setClientsList(prevClients =>
          prevClients.map(client => {
            if (client.id === clientId) {
              return {
                ...client,
                subClients: client.subClients.map(sc => 
                  sc.id === updatedSubClient.id ? updatedSubClient : sc
                )
              };
            }
            return client;
          })
        );
        
        toast({
          title: "Sub-Client Updated",
          description: "Sub-client has been updated successfully."
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update sub-client.",
          variant: "destructive"
        });
      }
    } else {
      // Adding new sub-client
      console.log("Creating new sub-client with name:", subClientFormData.name);
      const newSubClient = ClientStore.addSubClient(clientId, {
        name: subClientFormData.name
      });
      
      if (newSubClient) {
        console.log("New sub-client created:", newSubClient);
        
        setClientsList(prevClients =>
          prevClients.map(client => {
            if (client.id === clientId) {
              const updatedSubClients = [...(client.subClients || []), newSubClient];
              console.log("Updated sub-clients for client:", updatedSubClients);
              
              return {
                ...client,
                subClients: updatedSubClients
              };
            }
            return client;
          })
        );
        
        toast({
          title: "Sub-Client Added",
          description: "Sub-client has been added successfully."
        });
        
        if (!expandedClients.includes(clientId)) {
          setExpandedClients([...expandedClients, clientId]);
        }
      } else {
        console.error("Failed to create sub-client");
        toast({
          title: "Error",
          description: "Failed to add sub-client.",
          variant: "destructive"
        });
      }
    }
    
    setSubClientDialogOpen(false);
    resetSubClientForm();
  };

  const handleDeleteClient = (clientId: string) => {
    ClientStore.deleteClient(clientId);
    
    setClientsList(prevClients => 
      prevClients.filter(client => client.id !== clientId)
    );
    
    toast({
      title: "Client Deleted",
      description: "Client and all associated sub-clients have been deleted."
    });
  };

  const handleDeleteSubClient = (clientId: string, subClientId: string) => {
    const success = ClientStore.deleteSubClient(clientId, subClientId);
    
    if (success) {
      setClientsList(prevClients =>
        prevClients.map(client => {
          if (client.id === clientId) {
            return {
              ...client,
              subClients: client.subClients.filter(sc => sc.id !== subClientId)
            };
          }
          return client;
        })
      );
      
      toast({
        title: "Sub-Client Deleted",
        description: "Sub-client has been deleted successfully."
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete sub-client.",
        variant: "destructive"
      });
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
                    <DialogDescription>
                      {editingClient ? 'Update the client details below.' : 'Fill in the details to add a new client.'}
                    </DialogDescription>
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
              
              <Dialog open={subClientDialogOpen} onOpenChange={setSubClientDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSubClient.subClient ? 'Edit Sub-Client' : 'Add New Sub-Client'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSubClient.subClient 
                        ? 'Update the sub-client details below.' 
                        : 'Fill in the details to add a new sub-client.'}
                    </DialogDescription>
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
                          <TableCell>{client.subClients ? client.subClients.length : 0}</TableCell>
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
                        
                        {expandedClients.includes(client.id) && client.subClients && client.subClients.map(subClient => (
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
                        
                        {expandedClients.includes(client.id) && (!client.subClients || client.subClients.length === 0) && (
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
