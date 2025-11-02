import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/route.entity';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(
    @InjectRepository(Route)
    private readonly repo: Repository<Route>,
  ) {}

    async create(dto: CreateRouteDto) {
        if (
            dto.seats_available !== undefined &&
            dto.seats_total !== undefined &&
            dto.seats_available > dto.seats_total
        ) {
            throw new BadRequestException('seats_available cannot exceed seats_total');
        }

        const routeData = {
            ...dto,
            company_id: dto.company_id.toString(),
            departure_id: dto.departure_id.toString(),
            arrival_id: dto.arrival_id.toString(),
        } as any;

        return await this.repo.save(routeData);
    }

    async update(id: number, dto: UpdateRouteDto) {
    const route = await this.findOne(id);
    if (
        dto.seats_available !== undefined &&
        (dto.seats_total !== undefined
        ? dto.seats_available > dto.seats_total
        : route.seats_total !== undefined && dto.seats_available > route.seats_total)
    ) {
        throw new BadRequestException('seats_available cannot exceed seats_total');
    }
    Object.assign(route, dto);
    return await this.repo.save(route);
    }

  async findAll() {
    return await this.repo.find({ relations: ['company', 'departure', 'arrival'] });
  }

  async findOne(id: number) {
    const route = await this.repo.findOne({
      where: { id: id.toString() },
      relations: ['company', 'departure', 'arrival'],
    });
    if (!route) throw new NotFoundException(`Route #${id} not found`);
    return route;
  }


  async remove(id: number) {
    const route = await this.findOne(id);
    await this.repo.remove(route);
    return { deleted: true };
  }
}
