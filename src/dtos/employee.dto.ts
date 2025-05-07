import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmployeeDTO {
@IsNotEmpty({ message: 'Name should not be empty' })
@IsString({ message: 'Name must be a string' })
@MaxLength(100, { message: 'Name must not exceed 100 characters' })
name!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email!: string;
}

export class UpdateEmployeeDTO {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    @MaxLength(100, { message: 'Name must not exceed 100 characters' })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;
}

export class EmployeeDTO {
  id!: string;
  name!: string;
  email!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
