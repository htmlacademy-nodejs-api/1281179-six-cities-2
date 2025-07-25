import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { inject, injectable } from 'inversify';
import { Components } from '../../types/components.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Components.Logger)
    private readonly logger: Logger,
    @inject(Components.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
  ) {}

  findByCityId(cityId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city: cityId })
      .populate(['city', 'author'])
      .exec();
  }

  findAllOffers(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .populate(['city', 'author'])
      .exec();
  }

  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['city', 'author'])
      .exec();
  }

  deleteById(offerId: string): Promise<number> {
    return this.offerModel
      .deleteOne({ _id: offerId })
      .countDocuments()
      .exec();
  }

  exists(offerId: string): Promise<boolean> {
    return this.offerModel
      .exists({ _id: offerId })
      .exec()
      .then((result) => result !== null);
  }

  incrementCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, { $inc: { commentCount: 1 } }, { new: true })
      .populate(['city', 'author'])
      .exec();
  }

  async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const newOffer = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${newOffer.name}`);
    return newOffer;
  }

  async findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['city', 'author'])
      .exec();
  }

  async updateRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).populate(['city', 'author']);
    if (!offer) {
      return null;
    }
    const currentRating = offer.rating ?? 0;
    offer.ratingCount++;
    offer.rating = (currentRating + rating) / (offer.ratingCount);
    return offer.save();
  }
}
