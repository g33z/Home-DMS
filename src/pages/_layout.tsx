import type { FC, PropsWithChildren } from 'react';
import '../styles.css'
import QueryProvider from '../components/QueryProvider';
import Icon from '../images/Icon.svg'

const App: FC<PropsWithChildren> = (props) => {
    
    return (<>
        <meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content"/>
        <link rel="icon" type="image/svg+xml" sizes="any" href={ Icon }></link>
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