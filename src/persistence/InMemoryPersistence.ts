// tslint:disable: no-var-requires
import { injectable } from 'inversify';
import { Persistence } from './Persistence';
const httpErrors = require('http-errors');

const db = { vote: [], election: [] };

@injectable()
export class InMemoryPersistence implements Persistence {
    public update<Record>(
        collectionName: string,
        id: string,
        record: Record,
    ): void {
        const position = db[collectionName].findIndex(x => x.id === id);
        db[collectionName][position] = record;
    }

    public save<Record>(collectionName: string, record: Record): void {
        db[collectionName].push(record);
    }

    public getAll<Record>(collectionName: string): Record[] {
        return db[collectionName];
    }

    public getOne<Record>(collectionName: string, id: string): Record {
        const one = db[collectionName].find(x => x.id === id);

        if (one === undefined) {
            // todo this throw really should not depend on http
            throw new httpErrors.NotFound();
        }

        return one;
    }

    public getFiltered<Record>(collectionName: string, filter: any): Record[] {
        return db[collectionName].filter(x => {
            for (const prop in filter) {
                if (x[prop] !== filter[prop]) {
                    return false;
                }
            }
            return true;
        });
    }
}
