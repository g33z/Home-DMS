import { FC } from "react";
import HomePage from "../components/home-page/HomePage";

const IndexPage: FC = async () => {
	return <HomePage/>;
}

export default IndexPage

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};
