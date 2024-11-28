import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// * TODO: Change PartialType from mapped-types to swagger-ui
export class UpdateUserDto extends PartialType(CreateUserDto) {}
