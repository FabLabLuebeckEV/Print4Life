export interface ModelService {
    getAll(limit?: string, skip?: string);
    create(params: object);
    get(id: string);
    deleteById(id: string);
    update(id: string, obj: object);
    count(query?: object);
}

export default ModelService;
