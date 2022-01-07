import 'reflect-metadata'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationError } from './GetStatementOperationError';

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Show the Balance with Statement", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })

  it("Should be able to show th statement operation", async ()=>{
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 100,
      description: "Conta da água",
      type: OperationType.DEPOSIT,
    });

    expect(
      await getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: String(statement.id)
      })
    ).toHaveProperty("id");
  });

  it("Should not be able to show th statement operation with a nonexisting user", async ()=>{
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 100,
      description: "Conta da água",
      type: OperationType.DEPOSIT,
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: "1234",
        statement_id: String(statement.id)
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to show th statement operation if there's not statement", async ()=>{
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    await createStatementUseCase.execute({
      user_id: String(user.id),
      amount: 100,
      description: "Conta da água",
      type: OperationType.DEPOSIT,
    });

    await expect(
      getStatementOperationUseCase.execute({
        user_id: String(user.id),
        statement_id: "1234"
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})
