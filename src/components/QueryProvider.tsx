'use client'

import type { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

const QueryProvider: FC<PropsWithChildren> = (props) => {
    
    return (
        <QueryClientProvider client={ queryClient }>
            { props.children }
        </QueryClientProvider>
    );
};

export default QueryProvider;