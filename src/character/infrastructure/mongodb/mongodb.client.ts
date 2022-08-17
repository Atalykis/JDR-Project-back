import { Db, MongoClient } from "mongodb";

export class MongoDbClient {
  private static client: MongoClient
  private static db: Db

  static async init( port: string, dbName: string){
    this.client = new MongoClient('mongodb://localhost:' + port)
    await this.client.connect()
    this.db = this.client.db(dbName)
  }

  static getCollection(collection: string){
    return this.db.collection(collection)
  }

  static close(){
    this.client.close()
  }
}