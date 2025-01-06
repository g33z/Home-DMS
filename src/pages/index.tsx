import { FC } from "react";
import HomePage from "../components/home-page/HomePage";
import pb from "../lib/pocketbase";

const IndexPage: FC = async () => {
	return <HomePage/>;
}

export default IndexPage

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};
