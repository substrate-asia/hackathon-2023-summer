import { Entity, PrimaryGeneratedColumn, Column, Timestamp,CreateDateColumn,UpdateDateColumn, DeleteDateColumn} from "typeorm"

@Entity('test_users')
export class User {

    @PrimaryGeneratedColumn("increment")
    id!: BigInt

    @Column({ name: 'user_name', type: 'varchar',length: 50, default: '',comment:'用户名'})
    UserName!: string

    @Column({ name: 'password', type: 'varchar', default: '',comment:'密码'})
    Password!: string

    @Column({ name: 'age', type: 'varchar', default: '',comment:'年龄'})
    Age!: number

    // transformer: new LocalDateTimeValueTransformer()
    @CreateDateColumn( { name: 'created_at',type:'timestamp',nullable: true ,comment:'创建时间'})
    CreatedAt!: Timestamp

    @UpdateDateColumn( { name: 'updated_at',type:'timestamp',nullable: true,comment:'更新时间'})
    UpdatedAt!: Timestamp

    @DeleteDateColumn({ name: 'delete_at',type:'timestamp',nullable: true,comment:'删除时间'})
    DeleteAt!: Timestamp
}
