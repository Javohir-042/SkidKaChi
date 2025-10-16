import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Car } from '../models/car.model';
import { CarService } from './car.service';

@Module({
    imports: [SequelizeModule.forFeature([Car])],
    providers: [CarService],
    exports: [CarService],
})
export class CarModule { }