import { UserRole } from './auth';

export interface Job {
  id: string;
  reference: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  collectionDate: string;
  handoverDate: string;
  itemCount: number;
  bagCount: number;
  createdBy: string;
  createdAt: string;
  files: File[];
  assignedTo?: string;
  subClientId?: string;
  subClientName?: string;
  clientName?: string;
  emanifestId?: string;
}

export interface File {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  accessRoles: UserRole[];
}

export interface UCIDRequest {
  id: string;
  type: 'UCID' | 'SCID';
  clientName: string;
  requestorEmail: string;
  collectionPointName?: string;
  agencyAccount?: boolean;
  dateRequested?: string;
  supplyChainId?: string;
  supplyChainType?: '2D' | '4 state';
  supplyChainName?: string;
  mailOriginator?: string;
  mailOriginatorParticipantId?: string;
  mailingAgent?: string;
  comments: string;
  status: 'pending' | 'completed';
  createdAt: string;
  completedAt?: string;
  completedBy?: string;
}

export interface ArtworkSubmission {
  id: string;
  title: string;
  imageUrl: string;
  comments: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  feedbackComments?: string;
}

export interface Client {
  id: string;
  name: string;
  businessName?: string;
  subClients: SubClient[];
}

export interface SubClient {
  id: string;
  name: string;
  clientId?: string;
}

export const generateJobReference = (): string => {
  const prefix = 'JOB';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

export const mockJobs: Job[] = [
  {
    id: '1',
    reference: 'JOB-123456-0001',
    title: 'Office Equipment Delivery',
    description: 'Delivery of new office equipment to headquarters',
    status: 'completed',
    collectionDate: '2023-06-15T10:00:00',
    handoverDate: '2023-06-15T14:00:00',
    itemCount: 12,
    bagCount: 3,
    createdBy: 'Admin User',
    createdAt: '2023-06-12T09:30:00',
    files: [
      {
        id: 'f1',
        name: 'delivery_note.pdf',
        url: '#',
        type: 'application/pdf',
        uploadedBy: 'Admin User',
        uploadedAt: '2023-06-12T10:15:00'
      }
    ],
    assignedTo: 'Manager User',
    subClientId: 'sc1',
    subClientName: 'Marketing Department',
    clientName: 'ABC Corporation'
  },
  {
    id: '2',
    reference: 'JOB-234567-0002',
    title: 'Conference Materials Collection',
    description: 'Collection of materials for annual conference',
    status: 'in_progress',
    collectionDate: '2023-07-20T09:00:00',
    handoverDate: '2023-07-20T17:00:00',
    itemCount: 45,
    bagCount: 8,
    createdBy: 'Manager User',
    createdAt: '2023-07-15T11:20:00',
    files: [],
    assignedTo: 'Regular User'
  },
  {
    id: '3',
    reference: 'JOB-345678-0003',
    title: 'Warehouse Stock Transfer',
    description: 'Transfer of stock between warehouse locations',
    status: 'pending',
    collectionDate: '2023-08-05T08:00:00',
    handoverDate: '2023-08-05T16:00:00',
    itemCount: 120,
    bagCount: 22,
    createdBy: 'Admin User',
    createdAt: '2023-08-01T14:45:00',
    files: [
      {
        id: 'f2',
        name: 'stock_inventory.xlsx',
        url: '#',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedBy: 'Admin User',
        uploadedAt: '2023-08-01T15:30:00'
      },
      {
        id: 'f3',
        name: 'transfer_approval.pdf',
        url: '#',
        type: 'application/pdf',
        uploadedBy: 'Manager User',
        uploadedAt: '2023-08-02T09:10:00'
      }
    ]
  },
  {
    id: '4',
    reference: 'JOB-456789-0004',
    title: 'IT Equipment Return',
    description: 'Collection of old IT equipment for recycling',
    status: 'cancelled',
    collectionDate: '2023-09-10T13:00:00',
    handoverDate: '2023-09-10T17:00:00',
    itemCount: 35,
    bagCount: 7,
    createdBy: 'Regular User',
    createdAt: '2023-09-05T10:00:00',
    files: [
      {
        id: 'f4',
        name: 'equipment_list.pdf',
        url: '#',
        type: 'application/pdf',
        uploadedBy: 'Regular User',
        uploadedAt: '2023-09-05T10:30:00'
      }
    ],
    assignedTo: 'Manager User'
  },
  {
    id: '5',
    reference: 'JOB-567890-0005',
    title: 'Marketing Materials Delivery',
    description: 'Delivery of new marketing materials to event location',
    status: 'in_progress',
    collectionDate: '2023-10-18T09:30:00',
    handoverDate: '2023-10-18T12:30:00',
    itemCount: 50,
    bagCount: 5,
    createdBy: 'Manager User',
    createdAt: '2023-10-15T16:20:00',
    files: [],
    assignedTo: 'Regular User'
  }
];

export const mockDocuments: Document[] = [
  {
    id: 'd1',
    name: 'Job Booking Procedures',
    description: 'Official procedures for booking new jobs',
    url: '#',
    type: 'application/pdf',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-05-10T09:00:00',
    accessRoles: ['admin', 'manager', 'user']
  },
  {
    id: 'd2',
    name: 'Health and Safety Guidelines',
    description: 'Health and safety guidelines for all staff',
    url: '#',
    type: 'application/pdf',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-05-15T14:30:00',
    accessRoles: ['admin', 'manager', 'user']
  },
  {
    id: 'd3',
    name: 'Manager Handbook',
    description: 'Handbook for managers with procedures and policies',
    url: '#',
    type: 'application/pdf',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-06-01T11:20:00',
    accessRoles: ['admin', 'manager']
  },
  {
    id: 'd4',
    name: 'Financial Guidelines',
    description: 'Financial procedures and approval process',
    url: '#',
    type: 'application/pdf',
    uploadedBy: 'Admin User',
    uploadedAt: '2023-06-15T13:45:00',
    accessRoles: ['admin']
  },
  {
    id: 'd5',
    name: 'Employee Handbook',
    description: 'General employee handbook',
    url: '#',
    type: 'application/pdf',
    uploadedBy: 'Manager User',
    uploadedAt: '2023-07-01T10:00:00',
    accessRoles: ['admin', 'manager', 'user']
  }
];

export const mockUCIDRequests: UCIDRequest[] = [
  {
    id: '1',
    type: 'UCID',
    clientName: 'ABC Corporation',
    requestorEmail: 'john.doe@example.com',
    collectionPointName: 'Head Office',
    agencyAccount: true,
    comments: 'Need this for the new branch opening next month.',
    status: 'pending',
    createdAt: '2023-07-15T10:30:00'
  },
  {
    id: '2',
    type: 'UCID',
    clientName: 'XYZ Industries',
    requestorEmail: 'sarah.smith@example.com',
    collectionPointName: 'Warehouse B',
    agencyAccount: false,
    comments: 'Urgent request for new project.',
    status: 'completed',
    createdAt: '2023-08-05T14:45:00',
    completedAt: '2023-08-07T09:20:00',
    completedBy: 'Admin User'
  }
];

export const mockArtworkSubmissions: ArtworkSubmission[] = [
  {
    id: '1',
    title: 'Marketing Flyer Design',
    imageUrl: '/placeholder.svg',
    comments: 'Please review this flyer design for the upcoming campaign.',
    submittedBy: 'Regular User',
    submittedAt: '2023-08-10T09:30:00',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Product Catalog Cover',
    imageUrl: '/placeholder.svg',
    comments: 'Cover image for Q3 product catalog.',
    submittedBy: 'Regular User',
    submittedAt: '2023-08-12T11:45:00',
    status: 'approved',
    reviewedBy: 'Admin User',
    reviewedAt: '2023-08-13T14:20:00',
    feedbackComments: 'Approved. Looks great!'
  },
  {
    id: '3',
    title: 'Social Media Banner',
    imageUrl: '/placeholder.svg',
    comments: 'Banner for social media posts about the new service.',
    submittedBy: 'Manager User',
    submittedAt: '2023-08-14T10:15:00',
    status: 'rejected',
    reviewedBy: 'Admin User',
    reviewedAt: '2023-08-15T16:30:00',
    feedbackComments: 'Please adjust the colors to match our brand guidelines.'
  }
];

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'ABC Corporation',
    businessName: 'ABC Inc.',
    subClients: [
      {
        id: 'subclient-1',
        name: 'Marketing Department'
      },
      {
        id: 'subclient-2',
        name: 'Sales Department'
      }
    ]
  },
  {
    id: 'client-2',
    name: 'XYZ Industries',
    businessName: 'XYZ Ltd',
    subClients: [
      {
        id: 'subclient-3',
        name: 'European Division'
      }
    ]
  }
];

export const getJobById = (jobId: string): Job | undefined => {
  return mockJobs.find(job => job.id === jobId);
};

export const searchJobs = (query: string): Job[] => {
  const lowerQuery = query.toLowerCase();
  return mockJobs.filter(job => 
    job.reference.toLowerCase().includes(lowerQuery) ||
    job.title.toLowerCase().includes(lowerQuery) ||
    job.description.toLowerCase().includes(lowerQuery)
  );
};

export const getDocumentsByRole = (role: UserRole): Document[] => {
  return mockDocuments.filter(doc => doc.accessRoles.includes(role));
};

export const JobStore = {
  getJobs: (): Job[] => {
    const storedJobs = localStorage.getItem('jobSystemJobs');
    return storedJobs ? JSON.parse(storedJobs) : mockJobs;
  },
  
  saveJobs: (jobs: Job[]): void => {
    localStorage.setItem('jobSystemJobs', JSON.stringify(jobs));
  },
  
  addJob: (job: Omit<Job, 'id' | 'reference' | 'createdAt'>): Job => {
    const jobs = JobStore.getJobs();
    const newJob: Job = {
      ...job,
      id: (jobs.length + 1).toString(),
      reference: generateJobReference(),
      createdAt: new Date().toISOString(),
    };
    
    const updatedJobs = [...jobs, newJob];
    JobStore.saveJobs(updatedJobs);
    return newJob;
  },
  
  updateJob: (updatedJob: Job): Job => {
    const jobs = JobStore.getJobs();
    const updatedJobs = jobs.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    );
    JobStore.saveJobs(updatedJobs);
    return updatedJob;
  },
  
  deleteJob: (jobId: string): void => {
    const jobs = JobStore.getJobs();
    const filteredJobs = jobs.filter(job => job.id !== jobId);
    JobStore.saveJobs(filteredJobs);
  }
};

export const DocumentStore = {
  getDocuments: (): Document[] => {
    const storedDocs = localStorage.getItem('jobSystemDocuments');
    return storedDocs ? JSON.parse(storedDocs) : mockDocuments;
  },
  
  saveDocuments: (documents: Document[]): void => {
    localStorage.setItem('jobSystemDocuments', JSON.stringify(documents));
  },
  
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>): Document => {
    const documents = DocumentStore.getDocuments();
    const newDocument: Document = {
      ...document,
      id: `d${documents.length + 1}`,
      uploadedAt: new Date().toISOString(),
    };
    
    const updatedDocuments = [...documents, newDocument];
    DocumentStore.saveDocuments(updatedDocuments);
    return newDocument;
  },
  
  deleteDocument: (documentId: string): void => {
    const documents = DocumentStore.getDocuments();
    const filteredDocuments = documents.filter(doc => doc.id !== documentId);
    DocumentStore.saveDocuments(filteredDocuments);
  }
};

export const UCIDRequestStore = {
  getRequests: (): UCIDRequest[] => {
    const storedRequests = localStorage.getItem('jobSystemUCIDRequests');
    return storedRequests ? JSON.parse(storedRequests) : mockUCIDRequests;
  },
  
  saveRequests: (requests: UCIDRequest[]): void => {
    localStorage.setItem('jobSystemUCIDRequests', JSON.stringify(requests));
  },
  
  addRequest: (request: Omit<UCIDRequest, 'id' | 'status' | 'createdAt'>): UCIDRequest => {
    const requests = UCIDRequestStore.getRequests();
    const newRequest: UCIDRequest = {
      ...request,
      id: (requests.length + 1).toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    const updatedRequests = [...requests, newRequest];
    UCIDRequestStore.saveRequests(updatedRequests);
    return newRequest;
  },
  
  markAsComplete: (requestId: string, completedBy: string): UCIDRequest | undefined => {
    const requests = UCIDRequestStore.getRequests();
    let updatedRequest: UCIDRequest | undefined;
    
    const updatedRequests = requests.map(req => {
      if (req.id === requestId && req.status === 'pending') {
        updatedRequest = {
          ...req,
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedBy
        };
        return updatedRequest;
      }
      return req;
    });
    
    UCIDRequestStore.saveRequests(updatedRequests);
    return updatedRequest;
  }
};

export const ArtworkStore = {
  getSubmissions: (): ArtworkSubmission[] => {
    const storedSubmissions = localStorage.getItem('jobSystemArtworkSubmissions');
    return storedSubmissions ? JSON.parse(storedSubmissions) : mockArtworkSubmissions;
  },
  
  saveSubmissions: (submissions: ArtworkSubmission[]): void => {
    localStorage.setItem('jobSystemArtworkSubmissions', JSON.stringify(submissions));
  },
  
  addSubmission: (submission: Omit<ArtworkSubmission, 'id' | 'status' | 'submittedAt'>): ArtworkSubmission => {
    const submissions = ArtworkStore.getSubmissions();
    const newSubmission: ArtworkSubmission = {
      ...submission,
      id: (submissions.length + 1).toString(),
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    
    const updatedSubmissions = [...submissions, newSubmission];
    ArtworkStore.saveSubmissions(updatedSubmissions);
    return newSubmission;
  },
  
  updateSubmission: (submissionId: string, updates: Partial<ArtworkSubmission>): ArtworkSubmission | undefined => {
    const submissions = ArtworkStore.getSubmissions();
    let updatedSubmission: ArtworkSubmission | undefined;
    
    const updatedSubmissions = submissions.map(submission => {
      if (submission.id === submissionId) {
        updatedSubmission = { ...submission, ...updates };
        return updatedSubmission;
      }
      return submission;
    });
    
    ArtworkStore.saveSubmissions(updatedSubmissions);
    return updatedSubmission;
  },
  
  deleteSubmission: (submissionId: string): void => {
    const submissions = ArtworkStore.getSubmissions();
    const filteredSubmissions = submissions.filter(submission => submission.id !== submissionId);
    ArtworkStore.saveSubmissions(filteredSubmissions);
  }
};

export const ClientStore = {
  getClients: (): Client[] => {
    const storedClients = localStorage.getItem('jobSystemClients');
    return storedClients ? JSON.parse(storedClients) : mockClients;
  },
  
  saveClients: (clients: Client[]): void => {
    localStorage.setItem('jobSystemClients', JSON.stringify(clients));
  },
  
  addClient: (client: Omit<Client, 'id'>): Client => {
    const clients = ClientStore.getClients();
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      subClients: client.subClients || []
    };
    
    const updatedClients = [...clients, newClient];
    ClientStore.saveClients(updatedClients);
    return newClient;
  },
  
  updateClient: (updatedClient: Client): Client => {
    const clients = ClientStore.getClients();
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    ClientStore.saveClients(updatedClients);
    return updatedClient;
  },
  
  deleteClient: (clientId: string): void => {
    const clients = ClientStore.getClients();
    const filteredClients = clients.filter(client => client.id !== clientId);
    ClientStore.saveClients(filteredClients);
  },
  
  addSubClient: (clientId: string, subClient: Omit<SubClient, 'id'>): SubClient | null => {
    const clients = ClientStore.getClients();
    const clientIndex = clients.findIndex(client => client.id === clientId);
    
    if (clientIndex === -1) {
      console.error(`Client with ID ${clientId} not found`);
      return null;
    }
    
    const newSubClient: SubClient = {
      ...subClient,
      id: `subclient-${Date.now()}`,
      clientId: clientId
    };
    
    if (!clients[clientIndex].subClients) {
      clients[clientIndex].subClients = [];
    }
    
    clients[clientIndex].subClients.push(newSubClient);
    
    ClientStore.saveClients(clients);
    
    return newSubClient;
  },
  
  updateSubClient: (clientId: string, updatedSubClient: SubClient): SubClient | null => {
    const clients = ClientStore.getClients();
    const clientIndex = clients.findIndex(client => client.id === clientId);
    
    if (clientIndex === -1) {
      console.error(`Client with ID ${clientId} not found`);
      return null;
    }
    
    const client = clients[clientIndex];
    
    if (!client.subClients) {
      console.error(`Client with ID ${clientId} has no subClients array`);
      return null;
    }
    
    const subClientIndex = client.subClients.findIndex(
      sc => sc.id === updatedSubClient.id
    );
    
    if (subClientIndex === -1) {
      console.error(`SubClient with ID ${updatedSubClient.id} not found in client ${clientId}`);
      return null;
    }
    
    clients[clientIndex].subClients[subClientIndex] = updatedSubClient;
    
    ClientStore.saveClients(clients);
    
    return updatedSubClient;
  },
  
  deleteSubClient: (clientId: string, subClientId: string): boolean => {
    const clients = ClientStore.getClients();
    const clientIndex = clients.findIndex(client => client.id === clientId);
    
    if (clientIndex === -1) {
      console.error(`Client with ID ${clientId} not found`);
      return false;
    }
    
    const client = clients[clientIndex];
    
    if (!client.subClients) {
      console.error(`Client with ID ${clientId} has no subClients array`);
      return false;
    }
    
    clients[clientIndex].subClients = client.subClients.filter(
      sc => sc.id !== subClientId
    );
    
    ClientStore.saveClients(clients);
    
    return true;
  }
};
