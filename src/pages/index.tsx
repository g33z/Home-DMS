import { FC } from "react";
import { getDocumentPreviews } from "../lib/document/actions";
import HomePage from "../components/home-page/HomePage";

const IndexPage: FC = async () => {
	const documents = await getDocumentPreviews();

	return <HomePage documents={ documents }/>;
}

export default IndexPage

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};
