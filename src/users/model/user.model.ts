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


    @ApiProperty({
        example: "Javohir",
        description: 'Foydalanuvchi ismi'
    })
    @Column({
        type: DataType.STRING(50),
        allowNull: true,
        unique: true,
    })
    declare name: string;

    @ApiProperty({
        example: "+998976006787",
        description: 'Foydalanuvchi phon number'
    })
    @Column({
        type: DataType.STRING(50),
        allowNull: true,
        unique: true
    })
    declare phone: string;

    @ApiProperty({
        example: 'javohirquromboyev933@gmail.com',
        description: 'Foydalanuvchi email'
    })
    @Column({
        type: DataType.STRING(50),
        unique: true,
    })
    declare email: string;


    @ApiProperty({
    example: "Javohir_Quromboyev123!",
        description: 'Foydalanuvchi password'
    })
    @Column({
        type: DataType.STRING,
    })
    declare password: string;

    @ApiProperty({
        example: "https://t.me/javohir_042",
        description: 'Foydalanuvchi tg_link'
    })
    @Column({
        type: DataType.STRING,
        unique: true
    })
    declare tg_link: string;


    @ApiProperty({
        example: false,
        description: 'Foydalanuvchi is_active'
    })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare is_active: boolean;

    @ApiProperty({
        example: false,
        description: 'Foydalanuvchi is_owner'
    })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
    })
    declare is_owner: boolean;

    @ApiProperty({
        example: "Tashkent, Uzbekistan",
        description: 'Foydalanuvchi location'
    })
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
