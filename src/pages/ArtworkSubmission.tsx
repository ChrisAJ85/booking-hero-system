
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/utils/auth';
import { ArtworkStore } from '@/utils/data';
import { Upload, Image } from 'lucide-react';

const ArtworkSubmission = () => {
  const [title, setTitle] = useState('');
  const [comments, setComments] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !comments || !image) {
      toast({
        title: "Missing Information",
        description: "Please provide a title, comments, and upload an image.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, we would upload the image to a server
    // For this demo, we'll just use a placeholder URL
    const imageUrl = imagePreview || '/placeholder.svg';
    
    try {
      ArtworkStore.addSubmission({
        title,
        imageUrl,
        comments,
        submittedBy: user?.name || 'Unknown User',
      });
      
      toast({
        title: "Artwork Submitted",
        description: "Your artwork has been submitted for approval.",
      });
      
      // Reset form
      setTitle('');
      setComments('');
      setImage(null);
      setImagePreview(null);
      
      // Navigate to dashboard after successful submission
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your artwork. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Submit Artwork for Approval</h1>
              <p className="text-gray-600">Upload your artwork and provide details for review.</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Artwork Submission Form</CardTitle>
                <CardDescription>
                  Please provide details about your artwork and upload the image file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter a title for your artwork"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="comments">Comments</Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Provide any additional details or comments about the artwork"
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="image">Upload Image</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-64 mx-auto object-contain"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setImage(null);
                              setImagePreview(null);
                            }}
                          >
                            Remove Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer">
                              <span className="text-jobGray font-medium">Click to upload</span>
                              <span className="text-gray-500"> or drag and drop</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !title || !comments || !image}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isSubmitting ? 'Submitting...' : 'Submit Artwork'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkSubmission;
