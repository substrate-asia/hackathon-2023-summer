import { Entity, PrimaryGeneratedColumn, Column, Timestamp,CreateDateColumn,UpdateDateColumn, DeleteDateColumn} from "typeorm"

@Entity('users_address')
export class User_address {

    @PrimaryGeneratedColumn("increment")
    id!: BigInt

    @Column({ name: 'account_owner_address', type: 'varchar',length: 50, default: '',comment:'主账号用户地址'})
    AccountOwnerAddress!: string

    @Column({ name: 'account_child_address', type: 'varchar', default: '',comment:'子账号用户地址'})
    AccountChildAddress!: string

    // transformer: new LocalDateTimeValueTransformer()
    @CreateDateColumn( { name: 'created_at',type:'timestamp',nullable: true ,comment:'创建时间'})
    CreatedAt!: Timestamp

    @UpdateDateColumn( { name: 'updated_at',type:'timestamp',nullable: true,comment:'更新时间'})
    UpdatedAt!: Timestamp

    @DeleteDateColumn({ name: 'delete_at',type:'timestamp',nullable: true,comment:'删除时间'})
    DeleteAt!: Timestamp
}
