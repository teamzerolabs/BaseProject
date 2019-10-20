import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRoleEnum } from '../../auth/types/user-role.enum'

@Entity()
export class User {
  @Column('int', {
    primary: true,
    generated: 'increment',
    select: false,
  })
  id: number

  @Column('string', {
    generated: 'uuid',
  })
  uuid: number

  @Column('nvarchar', {
    nullable: true,
    length: 50,
  })
  username: string | null

  @Column('varchar', {
    nullable: true,
    length: 100,
  })
  emailAddress: string | null

  @Column('boolean', {
    default: false,
    select: false,
  })
  emailConfirmed: boolean

  @Column('nvarchar', {
    nullable: true,
    length: 100,
    select: false,
  })
  password: string | null

  @Column('nvarchar', {
    nullable: true,
    length: 100,
  })
  fullName: string | null

  @Column('nvarchar', {
    nullable: false,
    length: 100,
    select: false,
  })
  role: UserRoleEnum

  @Column('boolean', {
    default: false,
    select: false,
  })
  deleted: boolean

  @CreateDateColumn()
  dateCreated: Date

  @UpdateDateColumn()
  dateModified: Date
}
