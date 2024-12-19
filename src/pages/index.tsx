import { Link } from "waku";
import Documents from "../components/Documents";
import { getDocuments } from "../lib/document/actions";


export default async function HomePage() {
	const documents = getDocuments();

	return (
		<main>
			<Link to="/new">add document</Link>
			<Documents documents={ documents }/>
		</main>
	);
}

export const getConfig = async () => {
	return {
		render: 'dynamic',
	} as const;
};
