import Upload from "../../components/Upload";


export default async function HomePage() {
	return (
		<Upload/>
	);
}

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};