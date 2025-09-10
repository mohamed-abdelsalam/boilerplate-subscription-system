import { Test, TestingModule } from "@nestjs/testing";
import { PasswordHash } from "./password-hash";

describe('PasswordHash', () => {
  let passwordHashMiddleware;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: []
    }).compile();

    passwordHashMiddleware = module.get<PasswordHash>(PasswordHash)
  });

  describe('should hash password', () => {
    it('happy path', async () => {
      const req = {
        body: {
          password: 'plain password',
        }
      }
      passwordHashMiddleware.use(req, null, () => {});

      expect(req.body['password']).not.toEqual('plain password');

    });
  });
});