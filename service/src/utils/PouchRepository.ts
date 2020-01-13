import PouchDb from 'pouchdb';
import shortId from 'shortid';

export class PouchRepository<T extends Entity> {
  db: PouchDB.Database<T>;
  constructor(documentName: string) {
    this.db = new PouchDb<T>(documentName);
  }

  findAll = async (options?: FindAllOptions): Promise<T[]> => {
    const allDocs = await this.db.allDocs({
      ['include_docs']: true,
      limit: options?.limit,
      skip: options?.skip,
    });

    return allDocs.rows.map<T>(
      row =>
        row.doc as PouchDB.Core.ExistingDocument<T & PouchDB.Core.AllDocsMeta>,
    );
  };

  findById = async (id: string): Promise<T> => await this.db.get(id);

  save = async (data: Omit<T, '_id'>): Promise<T> => {
    const entity = { _id: shortId(), ...data };

    await this.db.put(entity as T);

    return entity as T;
  };
}

interface Entity {
  _id: string;
}

interface FindAllOptions {
  limit?: number;
  skip?: number;
}
