export type CreateRecord<T extends Record<string, unknown>> = Omit<T, 'id'> & { id?: string }
export type Expanded<
    T extends Record<string, unknown>, 
    ExpandedRelations extends { [recordName in keyof T]?: unknown }
> = T & { expand: ExpandedRelations }