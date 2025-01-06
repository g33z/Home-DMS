import { FC } from "react";
import { Link } from "waku";
import Upload from "../../components/upload/Upload";

const NewUpload: FC = () => {
    return (
        <div className='flex flex-col h-screen bg-gray-900'>
            <h1 className='grid grid-cols-[1fr_auto] items-center text-xl bg-gray-700 text-gray-300'>
                <span className='ml-6'>Add Document</span>
                <Link to="/" className='flex'>
                    <span className='iconify lucide--x m-6'></span>
                </Link>
            </h1>
            <Upload/>
        </div>
    );
}
 
export default NewUpload;

export const getConfig = async () => {
	return {
		render: 'static',
	} as const;
};
