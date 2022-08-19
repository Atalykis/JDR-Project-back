import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Db, MongoClient } from "mongodb";

export class MongoDbClient implements OnModuleDestroy{
  private client: MongoClient
  private db: Db

   async init( port: string, dbName: string){
    this.client = new MongoClient('mongodb://localhost:' + port)
    await this.client.connect()
    this.db = this.client.db(dbName)
  }

   getCollection(collection: string){
    return this.db.collection(collection)
  }

   close(){
    this.client.close()
  }

  onModuleDestroy() {
    this.close()
  }
}