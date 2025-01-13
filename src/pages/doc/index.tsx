import type { FC } from 'react';
import CheckSearchParams from '../../components/document-details/CheckSearchParams';
import SubRoute from '../../components/sub-route';
 

const DocumentDetails: FC = async (props) => {
    return (
		<SubRoute.Wrapper title='Document Details'>
			<CheckSearchParams/>
		</SubRoute.Wrapper>
	);
};

export default DocumentDetails;

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};