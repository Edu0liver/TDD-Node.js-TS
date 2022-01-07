import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Show the Balance with Statement", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  })

  it("Should be able to show the balance whit statement",async ()=>{
    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    const balanceStatement = await getBalanceUseCase.execute({ user_id: String(user.id) });

    expect(balanceStatement).toHaveProperty("balance" || "statement");
  });

  it("Should not be able to show the balance whit statement if there's not a user",async ()=>{
    expect(async()=>{
      await getBalanceUseCase.execute({ user_id: "12345" })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})
