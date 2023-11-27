import { 
  AnyMessage,
  MethodInfo, 
} from "@bufbuild/protobuf";

import * as proto from './api';
import { AsyncQueue } from './utils/queue/AsyncQueue';

interface ServiceType<S extends {
  [localName: string]: MethodInfo<AnyMessage, AnyMessage> 
}> {
  readonly typeName: string;
  readonly methods: S;
}

type Request<S extends ServiceType<any>, K extends keyof S['methods']> = InstanceType<S['methods'][K]['I']>;
type Response<S extends ServiceType<any>, K extends keyof S['methods']> = InstanceType<S['methods'][K]['O']>;

type Options = {
  onError?: (err: Event) => void;
  onClose?: () => void;
}

class RpcStream<S extends ServiceType<any>, M extends keyof S['methods']> {
  service: S;
  method: S['methods'][M];
  options: Options;
  ws: WebSocket;
  responseQueue: AsyncQueue<Response<S, M> | Error>;
  decode: (buffer: Uint8Array) => Response<S, M>;
  encode: (req: Request<S, M>) => Uint8Array;

  constructor(
    service: S,
    methodName: M,
    url: string,
    options?: Options,
  ) {
    this.service = service;
    this.method = service.methods[methodName];
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";
    this.responseQueue = new AsyncQueue<Response<S, M> | Error>();
    this.options = options || {};

    this.decode = RpcStream.getDecoder(this.method);
    this.encode = RpcStream.getEncoder(this.method);
  }

  async connect() {
    // Wait for the WebSocket connection to be established
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });

    // Setup the WebSocket event listeners
    this.ws.addEventListener("message", (event: MessageEvent) => {
      const buffer = new Uint8Array(event.data);
      const res = proto.Common.Response.fromBinary(buffer);

      if (res.result === proto.Common.Response_Result.OK) {
        this.responseQueue.enqueue(this.decode(res.body));
      } else {
        this.responseQueue.enqueue(new Error(res.message));
      }
    });

    this.ws.addEventListener("error", (err: Event) => {
      if (this.options.onError) {
        this.options.onError(err);
      }
    });

    this.ws.addEventListener("close", () => {
      if (this.options.onClose) {
        this.options.onClose();
      }
    });
  }

  write(request: Request<S, M>) {
    const service = this.service.typeName.split(".").pop() as string;
    const method = this.method.name.charAt(0).toLowerCase() + this.method.name.slice(1);
    const body = this.encode(request);

    this.ws.send(
      new proto.Common.Request({
        service,
        method,
        body,
      }).toBinary()
    );
  }

  async *read() : AsyncIterable<[Response<S, M> | undefined, Error | undefined]> {
    while (true) {
      let res : Response<S, M> | Error | undefined = await this.responseQueue.dequeue();
      let err : Error | undefined = undefined;

      if (res instanceof Error) {
        err = res;
        res = undefined;
      }

      yield [res, err] as [Response<S, M> | undefined, Error | undefined];
    }
  }

  close() {
    this.ws.close();
  }

  static getDecoder<T extends MethodInfo>(method: T) {
    return (data: Uint8Array): InstanceType<T["O"]> => {
      return method.O.fromBinary(data) as InstanceType<T["O"]>;
    };
  }

  static getEncoder<T extends MethodInfo>(_: T) {
    return (data: InstanceType<T["I"]>): Uint8Array => {
      return data.toBinary();
    };
  }

  static async create<S extends ServiceType<any>, K extends keyof S['methods']>(
    service: S,
    methodName: K,
    url: string = "ws://your-websocket-url",
    options?: Options,
  ) {
    const stream = new RpcStream<S, K>(service, methodName, url, options);
    await stream.connect();
    return stream;
  }

  static async createUnaryMethod<S extends ServiceType<any>, M extends keyof S['methods']>(
    service: S,
    methodName: M,
    url: string = "ws://your-websocket-url"
  ) {
    // Pass the service and method name to the RpcStream constructor
    const stream = new RpcStream<S, M>(service, methodName, url);
    await stream.connect();

    const iterator = stream.read()[Symbol.asyncIterator]();
    return async (request: Request<S, M>): Promise<Response<S, M>> => {
      stream.write(request);
      const [res, err] = (await iterator.next()).value;
      stream.close();

      if (err) { throw err; }
      return res;
    };
  }
}

export {
  RpcStream,
}