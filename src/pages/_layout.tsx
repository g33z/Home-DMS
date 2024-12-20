import type { FC, PropsWithChildren } from 'react';
import '../styles.css'
import QueryProvider from '../components/QueryProvider';

const App: FC<PropsWithChildren> = (props) => {
    
    return (
        <QueryProvider>
            { props.children }
        </QueryProvider>
    )
};

export default App;

export const getConfig = async () => {
    return {
        render: 'static',
    };
};