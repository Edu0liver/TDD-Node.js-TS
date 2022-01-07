import 'reflect-metadata'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate a User", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  })

  it("Should be able to authenticate a user", async ()=>{
    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    expect(
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password
      })
    ).toHaveProperty("token");
  });

  it("Should not be able to authenticate a user with a nonexistent email", async ()=>{
    await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "zamaliz@erfugis.tk",
        password: "12345"
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user with a incorrect password", async ()=>{
    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "12345"
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

});
