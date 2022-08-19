import { MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

export function useMongooseStore<T extends new (...args: any[]) => any>(Store: T, model: any, schema: any) {
  let module: TestingModule;
  let store: InstanceType<T>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [MongooseModule.forRoot("mongodb://localhost:27017/test"), MongooseModule.forFeature([{ name: model.name, schema }])],
      providers: [{ provide: "TestedStore", useClass: Store }],
    }).compile();

    store = module.get("TestedStore");
    await module.init();
  });

  afterAll(() => module.close());

  return () => store;
}