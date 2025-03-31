import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import JobCard from '@/components/JobCard';
import SearchForm from '@/components/SearchForm';
import { Job, searchJobs, JobStore } from '@/utils/data';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = (query: string, filter: string) => {
    // Get all jobs first
    const allJobs = JobStore.getJobs();
    
    // If query is empty, show all jobs (optionally filtered by status)
    if (!query.trim()) {
      if (filter === 'all') {
        setSearchResults(allJobs);
      } else {
        setSearchResults(allJobs.filter(job => job.status === filter));
      }
      setHasSearched(true);
      return;
    }
    
    // Otherwise perform search by query
    let results = searchJobs(query);
    
    // Apply status filter if needed
    if (filter !== 'all') {
      results = results.filter(job => job.status === filter);
    }
    
    setSearchResults(results);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 bg-jobGray-light p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Search Jobs</h1>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <SearchForm onSearch={handleSearch} />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Search Results</h2>
              </div>
              
              {!hasSearched ? (
                <div className="text-center py-12">
                  <SearchIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Search for jobs</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Enter a job reference number, title, or description to search
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <SearchIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Try a different search term or filter
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map(job => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                    Found {searchResults.length} job{searchResults.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
