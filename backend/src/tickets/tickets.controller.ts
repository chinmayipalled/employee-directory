import { Controller, Get, Query } from '@nestjs/common'
import { TicketsService } from './tickets.service'

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.ticketsService.findAll(status, priority)
  }
}
