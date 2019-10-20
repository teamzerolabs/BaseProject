import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import { UserRoleEnum } from '../../auth/types/user-role.enum'

export class UserCreationRequest {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string

  @IsString()
  @MinLength(8)
  password: string

  @IsString()
  @IsNotEmpty()
  fullName: string

  @IsEnum(UserRoleEnum)
  @IsNotEmpty()
  role: UserRoleEnum
}

export class UserResponse {
  id: number

  @IsOptional()
  username: string | null

  @IsOptional()
  emailAddress: string | null

  @IsOptional()
  fullName: string | null

  @IsOptional()
  deleted: boolean | null

  @IsOptional()
  dateModified: Date | null

  @IsOptional()
  dateCreated: Date | null

  role: UserRoleEnum
}
