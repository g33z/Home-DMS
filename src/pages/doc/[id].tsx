import type { FC } from 'react';
import { Link } from 'waku';
import { getDocumentDetails, removeDocument } from '../../lib/document/actions';
import ErrorScreen from '../../components/ErrorScreen';
import Tag from '../../components/Tag';
import Menu, { MenuOptions } from '../../components/detail-view/Menu';
import DetailView from '../../components/detail-view/DetailView';

interface DocumentDetailsProps {
    id: string
}

const DocumentDetails: FC<DocumentDetailsProps> = async (props) => {
    const documentId = parseInt(props.id, 10);

    if(Number.isNaN(documentId)) return (
        <ErrorScreen message='Document ID not valid!'/>
    );

    const document = await getDocumentDetails(documentId)

    if(document === undefined) return (
        <ErrorScreen message='Document not found!'/>
    );

    return <DetailView document={ document }/>;
};

export default DocumentDetails;

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};