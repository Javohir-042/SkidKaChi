import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IUserCreationAttr{
    id?:number;
    name:string;
    phone: string;
    email: string;
    password: string;
    tg_link: string;
    location?: string;
    // regionId: number;
    // districtId: number;
}

@Table({tableName: "user"})
export class User extends Model<User, IUserCreationAttr>{
    @ApiProperty({
        example: 1,
        description: 'Foydalanuvchi id'
    })
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    declare id: number;


    @Column({
        type: DataType.STRING(50),
        allowNull: true,
        unique: true,
    })
    declare name: string;


    @Column({
        type: DataType.STRING(50),
        allowNull: true,
        unique: true
    })
    declare phone: string;

    @ApiProperty({
        example: 'user1@mail.uz',
        description: 'Foydalanuvchi email'
    })
    @Column({
        type: DataType.STRING(50),
        unique: true,
    })
    declare email: string;


    @Column({
        type: DataType.STRING,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        unique: true
    })
    declare tg_link: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare is_active: boolean;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare is_owner: boolean;


    @Column({
        type: DataType.STRING(50),
    })
    declare location: string;

    @Column({
        type: DataType.STRING(2000),
    })
    declare refresh_token: string;


    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare activation_link: string;
}
