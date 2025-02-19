import axios from 'axios';

export interface Network {
    id: number;
    name: string;
    network_slug: string;
    alternativeName?: string;
    cryptocurrencyId?: string;
    cryptocurrencySlug?: string;
    tokenExplorerUrl?: string;
    poolExplorerUrl?: string;
    transactionHashUrl?: string;
}

export interface DexListing {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    market_share: number;
    num_market_pairs: string;
    last_updated: string;
    status: string;
    type?: string;
    quote: {
        convert_id: number;
        market_type: string;
        last_updated: string;
        volume_24h: number;
        percent_change_volume_24h: number;
        num_transactions_24h: number;
    }[];
}

export interface DexInfo {
    id: number;
    name: string;
    description: string;
    logo: string;
    urls: {
        website: string[];
        technical_doc: string[];
        explorer: string[];
        source_code: string[];
    };
    date_launched: string;
    notice: string;
}

export interface OHLCVData {
    timestamp: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface ListingsParams {
    start?: number;
    limit?: number;
    sort?: 'volume_24h' | 'market_share' | 'num_markets' | 'name';
    sort_dir?: 'asc' | 'desc';
    network_id?: number;
}

const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for better error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error('Response error:', error.response.data);
            throw new Error(error.response.data.error || 'An error occurred while fetching data');
        } else if (error.request) {
            console.error('Request error:', error.request);
            throw new Error('No response received from server');
        } else {
            console.error('Error:', error.message);
            throw new Error('Error setting up the request');
        }
    }
);

export const dexApi = {
    getNetworks: async () => {
        try {
            const response = await axiosInstance.get('/dex/networks');
            return response.data.data as Network[];
        } catch (error) {
            console.error('Error fetching networks:', error);
            throw error;
        }
    },

    getListings: async (params: ListingsParams = {}) => {
        try {
            const response = await axiosInstance.get('/dex', { 
                params,
                timeout: 15000 // Increase timeout for this specific call
            });
            return response.data.data as DexListing[];
        } catch (error) {
            console.error('Error fetching listings:', error);
            throw error;
        }
    },

    getDexInfo: async (id: number) => {
        try {
            const response = await axiosInstance.get('/dex/info', {
                params: { id }
            });
            return response.data.data as DexInfo;
        } catch (error) {
            console.error('Error fetching DEX info:', error);
            throw error;
        }
    },

    getHistoricalData: async (pairId: string) => {
        try {
            const response = await axiosInstance.get('/dex/historical', {
                params: {
                    id: pairId,
                    interval: '1d',
                    count: 30,
                },
            });
            return response.data.data as OHLCVData[];
        } catch (error) {
            console.error('Error fetching historical data:', error);
            throw error;
        }
    },
};