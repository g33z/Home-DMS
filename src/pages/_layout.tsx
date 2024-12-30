import type { FC, PropsWithChildren } from 'react';
import '../styles.css'
import QueryProvider from '../components/QueryProvider';

const App: FC<PropsWithChildren> = (props) => {
    
    return (<>
        <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content"/>
        <QueryProvider>
            { props.children }
        </QueryProvider>
    </>)
};

export default App;

export const getConfig = async () => {
    return {
        render: 'static',
    };
};