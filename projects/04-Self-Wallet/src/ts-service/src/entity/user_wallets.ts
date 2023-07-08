import { Entity, PrimaryGeneratedColumn, Column, Timestamp,CreateDateColumn,UpdateDateColumn, DeleteDateColumn} from "typeorm"

@Entity('user_wallets')
export class UserWallets {

    @PrimaryGeneratedColumn("increment")
    id!: BigInt

    @Column({ name: 'user_id', type: 'int',default: '0',comment:'用户的ID'})
    UserId!: number

    @Column({ name: 'ipfs_address', type: 'varchar', default: '',comment:'ipfs的地址'})
    IpfsAddress!: string

    @Column({ name: 'wallet_address', type: 'varchar', default: '',comment:'wallet的地址'})
    WalletAddress!: string

    // transformer: new LocalDateTimeValueTransformer()
    @CreateDateColumn( { name: 'created_at',type:'timestamp',nullable: true ,comment:'创建时间'})
    CreatedAt!: Timestamp

    @UpdateDateColumn( { name: 'updated_at',type:'timestamp',nullable: true,comment:'更新时间'})
    UpdatedAt!: Timestamp

    @DeleteDateColumn({ name: 'delete_at',type:'timestamp',nullable: true,comment:'删除时间'})
    DeleteAt!: Timestamp
}
