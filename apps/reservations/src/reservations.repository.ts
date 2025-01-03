import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { ReservationsDocument } from './models/reservation.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateReservationDto } from '../../../libs/common/src/dto/create-reservation.dto';

@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationsDocument> {
  protected readonly logger = new Logger(ReservationsRepository.name);
  constructor(
    @InjectModel(ReservationsDocument.name)
    reservationModel: Model<ReservationsDocument>,
  ) {
    super(reservationModel);
  }

  //   createReservation = async(createReservationsDto: CreateReservationDto) => {
  //     const newReservation =
  // }
}
