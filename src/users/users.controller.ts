import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../iam/authorization/guards/roles.guard';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller({
  version: '1',
  path: '/users',
})
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(AuthType.Bearer)
  @Roles(Role.ADMIN)
  async checkForAuthorization() {
    return {
      // Only allow if user has admin role:
      message: 'Authorized',
    };
  }
}
