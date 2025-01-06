'use client'

import { useQuery } from '@tanstack/react-query';
import type { FC } from 'react';
import { useRouter_UNSTABLE as useRouter } from 'waku';
import pb from '../../lib/pocketbase';
import ErrorScreen from '../ErrorScreen';
import DetailView from './DetailView';
import LoadingScreen from '../LoadingScreen';
import { ExpandedDoc } from '../../lib/document/service';


const CheckSearchParams: FC = (props) => {

    const router = useRouter()
    const documentId = new URLSearchParams(router.query).get('id')
    
    const document = useQuery({
        queryFn: () => {
            if(documentId === null) throw new Error(`The document id does not exist in search params.`);
            
            return pb.collection('documents').getOne<ExpandedDoc>(documentId, { expand: 'pages,tags'})
        },
        queryKey: ['documents', 'record', documentId]
    })

    if(documentId === null) return (
        <ErrorScreen message='Document not found!'/>
    );

    if(document.isError) return (
        <ErrorScreen message='There was an error while retrieving the document.'/>
    );

    if(!document.data) return (
        <LoadingScreen message='Loading Document...'/>
    );

    return <DetailView document={ document.data }/>;
};

export default CheckSearchParams;