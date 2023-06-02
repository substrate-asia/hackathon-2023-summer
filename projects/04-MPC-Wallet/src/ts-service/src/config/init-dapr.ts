import { DaprServer,DaprClient } from '@dapr/dapr';
import IServerInvoker from '@dapr/dapr/interfaces/Server/IServerInvoker';
import { config } from './config';

/**
 * dapr 配置服务
 * @returns 
 */
export const initDapr = async (): Promise<InitDaprResult> => {
	const client = new DaprClient(config.dapr.host, config.dapr.port);
	// const clientSidecar = new DaprClient(config.dapr.host, config.dapr.port, CommunicationProtocolEnum.GRPC);
	// Create a Proxy that allows us to use our gRPC code
	// const client = await clientSidecar.proxy.create<GreeterClient>(GreeterClient);
	const server = new DaprServer(config.server.host, config.server.port, config.dapr.host, config.dapr.port);
	const invoker = server.invoker
	return new InitDaprResult(client,server, invoker);
};

export class InitDaprResult {
	constructor(readonly client: DaprClient, readonly server: DaprServer, readonly invoker: IServerInvoker) { }
}
