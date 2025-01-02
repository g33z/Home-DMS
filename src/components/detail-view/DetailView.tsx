'use client'

import type { FC } from 'react';
import { Link, useRouter_UNSTABLE as useRouter } from 'waku';
import Tag from '../Tag';
import Menu, { MenuOptions } from './Menu';
import { DocumentDetails, removeDocument } from '../../lib/document/actions';
import { useMutation } from '@tanstack/react-query';

interface DetailViewProps {
    document: DocumentDetails
}

const DetailView: FC<DetailViewProps> = (props) => {
    const router = useRouter()

    const deleteMutation = useMutation({
        mutationFn: () => removeDocument(props.document.id),
        onSuccess: () => router.push('/')
    })
    

    function onMenuSelect(selected: MenuOptions){
        switch (selected) {
            case 'delete':
                deleteMutation.mutate();
                return;
        
            default:
                break;
        }
    }
    
    return (
        <div className='bg-gray-900 text-white grid grid-rows-[auto_1fr] h-screen'>
            <h2 className='grid grid-cols-[auto_1fr_auto] items-center justify-items-center text-xl bg-gray-700 text-gray-300'>
                <Link to='/' className="flex">
                    <span className='iconify lucide--arrow-left m-6'></span>
                </Link>
                <>View Document Details</>
                <Menu onSelect={ onMenuSelect }/>
            </h2>
            <div className='overflow-y-auto'>
                <section className='m-2'>
                    <h3 className='text-lg font-bold text-gray-300'>Tags</h3>
                    <div className='flex gap-1 m-2 flex-wrap pb-2'>
                        { props.document.tags.map(tag =>
                            <Tag keyword={ tag.keyword } key={ tag.id }/>
                        )}
                    </div>
                </section>
                <section className='m-2'>
                    <h3 className='text-lg font-bold text-gray-300'>Pages</h3>
                    <div className='flex flex-col gap-3 m-2'>
                        { props.document.pages.map(pageUrl =>
                            <img key={ pageUrl } src={ pageUrl }/>
                        ) }
                    </div>
                </section>
            </div>
            { deleteMutation.isPending &&
                <div className='absolute inset-0 bg-[#01010174] text-2xl flex flex-col items-center justify-center gap-3'>
                    <span className='iconify lucide--loader-circle animate-spin text-5xl'/>
                    Deleting...
                </div>
            }
        </div>
    );
};

export default DetailView;