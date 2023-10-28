import { getConnection } from 'typeorm';

export class Helper {
    constructor() { }

    /**
     * Clear the testing database after every test suit
     */
    public async clearDB() {
        const entities = getConnection().entityMetadatas;
        for (const entity of entities) {
            const repository = getConnection().getRepository(entity.name);
            await repository.query(
                `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
            );
        }
    }

}