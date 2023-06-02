import "reflect-metadata"
import { DataSource, DataSourceOptions } from "typeorm"
import { config } from './config';
import { User_address } from "../entity"
/**
 * typeorm 配置
 * @returns 
 */
export const initTypeOrm = async (): Promise<InitTypeOrmResult> => {
	console.log(config);
	const dbSource = config.orm as DataSourceOptions;
	// console.log(dbSource);
	const AppDataSource = new DataSource(dbSource);
	AppDataSource.initialize().then(async () => {
		console.log("Inserting a new user into the database...")
	}).catch(error => console.log(error))
	return new InitTypeOrmResult(AppDataSource);
};

export class InitTypeOrmResult {
	constructor(readonly orm: DataSource) { }
}