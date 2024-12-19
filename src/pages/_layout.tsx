import type { FC, PropsWithChildren } from 'react';
import '../styles.css'

const App: FC<PropsWithChildren> = (props) => {
    
    return props.children
};

export default App;

export const getConfig = async () => {
    return {
        render: 'static',
    };
};