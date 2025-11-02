import { AvailableServiceSeed } from "src/features/available-service/available-service.seed";
import { data_source } from "./database.config";
import { Logger } from "@nestjs/common";

const logger = new Logger("SeedRunner");

const RunSeeds = async (): Promise<void> => {
    try {
        await data_source.initialize();
        logger.log("Connected to the database!");

        await AvailableServiceSeed(data_source);

        await data_source.destroy();
        logger.log("SEED: All seeds finalized successfully!");
        logger.warn("Database connection closed.");
    } catch (error) {
        return;
    }
};

RunSeeds();