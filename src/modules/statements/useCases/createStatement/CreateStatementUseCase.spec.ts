import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Create Statement", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
  })

  it("Should be able to create a statement depositing some money", async ()=>{
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

    expect(statement).toHaveProperty("id")
  });

  it("Should not be able to create a statement with a nonexisting user", async ()=>{
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    await expect(
      createStatementUseCase.execute({
        user_id: "1213342",
        amount: 100,
        description: "Conta da água",
        type: OperationType.DEPOSIT,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  });

  it("Should be able to create a statement withdrawing some money", async ()=>{
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
      description: "Conta de luz",
      type: OperationType.DEPOSIT,
    });

    expect(
      await createStatementUseCase.execute({
        user_id: String(user.id),
        amount: 100,
        description: "Conta da água",
        type: OperationType.WITHDRAW,
      })
    ).toHaveProperty("id");
  });

  it("Should not be able to create a statement with a lower amount than available", async ()=>{
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
      description: "Conta de luz",
      type: OperationType.DEPOSIT,
    });

    await expect(
      createStatementUseCase.execute({
        user_id: String(user.id),
        amount: 150,
        description: "Conta da água",
        type: OperationType.WITHDRAW,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
