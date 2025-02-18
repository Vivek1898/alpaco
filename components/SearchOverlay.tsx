// SearchOverlay.tsx
import React from 'react';
import { X } from 'lucide-react';
import TokenCard from './TokenCard';
import { TokenPair } from '@/types/dex';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    searchResults: any;
    isLoading: boolean;
    error: any;
    searchQuery: string;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         searchResults,
                                                         isLoading,
                                                         error,
                                                         searchQuery,
                                                     }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 flex items-start justify-center pt-16">
                <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Search Results</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                    <div className="p-4">
                        {isLoading && (
                            <div className="text-center py-8">
                                <div
                                    className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-8 text-red-500">
                                An error occurred while fetching data. Please try again.
                            </div>
                        )}

                        {searchResults?.pairs && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {searchResults.pairs.map((pair: TokenPair) => (
                                    <TokenCard key={pair.pairAddress} pair={pair} />
                                ))}
                            </div>
                        )}

                        {searchResults?.pairs?.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No results found for  {`${searchQuery}`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
