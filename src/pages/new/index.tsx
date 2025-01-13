import { FC } from "react";
import Upload from "../../components/upload/Upload";
import SubRoute from "../../components/sub-route";

const NewUpload: FC = () => {
    return (
		<SubRoute.Wrapper title='Add Document'>
			<Upload/>
		</SubRoute.Wrapper>
	);
}
 
export default NewUpload;

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};
