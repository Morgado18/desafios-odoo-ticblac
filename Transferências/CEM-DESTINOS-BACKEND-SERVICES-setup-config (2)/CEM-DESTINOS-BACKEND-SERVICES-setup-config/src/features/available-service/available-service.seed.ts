import { Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { AvailableServiceEntity } from "./entities/available-service.entity";

export const AvailableServiceSeed = async (data_source: DataSource): Promise<void> => {
    const logger = new Logger("AvailableServiceSeed");
    const available_service_repository = data_source.getRepository(AvailableServiceEntity);

    const available_services: Partial<AvailableServiceEntity>[] = [
        { name: "Service 1", description: "Description 1" },
        { name: "Service 2", description: "Description 2" },
        { name: "Service 3", description: "Description 3" },
    ];

    await available_service_repository.save(available_services);
    logger.log(`AvailableServices Seeded`);
}