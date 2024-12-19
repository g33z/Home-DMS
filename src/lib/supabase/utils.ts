type DataOrError<D, E> = {
    data: D;
    error: null;
} | {
    data: null;
    error: E;
}

export function throwOnError<D, E>(result: DataOrError<D, E>){
    if(result.data === null){
        throw result.error;
    }
    return result.data;
}