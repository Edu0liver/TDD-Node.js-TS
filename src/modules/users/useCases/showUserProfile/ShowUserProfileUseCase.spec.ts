import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", ()=>{
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("Should be able to show the user profile", async ()=>{
    const user = await createUserUseCase.execute({
      name: "Alan Glover",
      email: "isoiviuwu@baejenoj.pg",
      password: "1234",
    });

    const showUser = await showUserProfileUseCase.execute(String(user.id))

    expect(showUser).toEqual(user);
  });

  it("Should not be able to show the user profile when there's not user", async ()=>{
    await expect(
      showUserProfileUseCase.execute("12345")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  })
})
