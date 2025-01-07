import type { FC } from 'react';
import CheckSearchParams from '../../components/detail-view/CheckSearchParams';
 

const DocumentDetails: FC = async (props) => {
    return <CheckSearchParams/>;
};

export default DocumentDetails;

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};