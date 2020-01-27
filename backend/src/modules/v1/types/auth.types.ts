import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UserLoginRequest {
  @IsString()
  @IsOptional()
  username: string

  @IsString()
  @IsEmail()
  @IsOptional()
  emailAddress: string

  @IsString()
  @MinLength(8)
  password: string
}

export class UserLoginResponse {
  @IsString()
  jwtToken: string
}
