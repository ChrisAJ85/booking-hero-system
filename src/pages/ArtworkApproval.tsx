
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ArtworkCard from '@/components/ArtworkCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArtworkSubmission, ArtworkStore } from '@/utils/data';

const ArtworkApproval = () => {
  const [artworks, setArtworks] = useState<ArtworkSubmission[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    // Load artworks from the store
    const loadedArtworks = ArtworkStore.getSubmissions();
    setArtworks(loadedArtworks);
  }, []);
  
  const filteredArtworks = () => {
    if (activeTab === 'all') return artworks;
    return artworks.filter(artwork => artwork.status === activeTab);
  };
  
  const handleUpdateStatus = (id: string) => {
    // Refresh the artworks after status update
    const updatedArtworks = ArtworkStore.getSubmissions();
    setArtworks(updatedArtworks);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Artwork Approval</h1>
              <Button
                onClick={() => window.location.href = '/artwork-submission'}
              >
                Submit New Artwork
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Artwork Submissions</h2>
              </div>
              
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <div className="p-4 border-b">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="all" className="p-4">
                  {filteredArtworks().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No artwork submissions found</p>
                      <Button
                        onClick={() => window.location.href = '/artwork-submission'}
                      >
                        Submit New Artwork
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArtworks().map(artwork => (
                        <ArtworkCard 
                          key={artwork.id} 
                          artwork={artwork} 
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="pending" className="p-4">
                  {filteredArtworks().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No pending submissions</p>
                      <Button
                        onClick={() => window.location.href = '/artwork-submission'}
                      >
                        Submit New Artwork
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArtworks().map(artwork => (
                        <ArtworkCard 
                          key={artwork.id} 
                          artwork={artwork} 
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="approved" className="p-4">
                  {filteredArtworks().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No approved submissions</p>
                      <Button
                        onClick={() => window.location.href = '/artwork-submission'}
                      >
                        Submit New Artwork
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArtworks().map(artwork => (
                        <ArtworkCard 
                          key={artwork.id} 
                          artwork={artwork} 
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="rejected" className="p-4">
                  {filteredArtworks().length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500 mb-4">No rejected submissions</p>
                      <Button
                        onClick={() => window.location.href = '/artwork-submission'}
                      >
                        Submit New Artwork
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredArtworks().map(artwork => (
                        <ArtworkCard 
                          key={artwork.id} 
                          artwork={artwork} 
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkApproval;
