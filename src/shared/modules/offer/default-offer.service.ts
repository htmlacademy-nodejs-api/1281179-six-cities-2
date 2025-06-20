import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const newOffer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${newOffer.name}`);
    return newOffer;
  }

  findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

}
