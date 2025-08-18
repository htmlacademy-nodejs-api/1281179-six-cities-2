import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { DocumentExist } from '../../types/document-exist.interface.js';

export interface OfferService extends DocumentExist {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findByCityId(cityId: string): Promise<DocumentType<OfferEntity>[]>;
  findAllOffers(): Promise<DocumentType<OfferEntity>[]>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<number>;
  exists(offerId: string): Promise<boolean>;
  incrementCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null>;
}
