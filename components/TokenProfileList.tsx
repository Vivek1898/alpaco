import React from 'react';
import { TokenProfile } from '../types/dex';
import { ExternalLink } from 'lucide-react';

interface TokenProfileListProps {
    profiles: TokenProfile[];
    isLoading: boolean;
}

const TokenProfileList: React.FC<TokenProfileListProps> = ({ profiles, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {profiles.map((profile) => (
                <div key={profile.tokenAddress} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                        <img src={profile.icon} alt="" className="w-12 h-12 rounded-full" />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{profile.chainId}</h3>
                                <a
                                    href={profile.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{profile.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TokenProfileList;