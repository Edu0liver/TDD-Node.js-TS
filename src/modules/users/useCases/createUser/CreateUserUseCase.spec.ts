import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create a User", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to create a new user", async ()=>{
    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    })

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a new user with the same email", async ()=>{
    const user = await createUserUseCase.execute({
      name: "Keith Singleton",
      email: "ha@lifoz.sa",
      password: "1234",
    });

    await expect(
      createUserUseCase.execute({
        name: "Keith Singleton",
        email: user.email,
        password: "1234",
      })
    ).rejects.toBeInstanceOf(CreateUserError);

  });

});
