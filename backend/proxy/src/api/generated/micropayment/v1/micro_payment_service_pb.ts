// @generated by protoc-gen-es v1.3.0 with parameter "target=ts"
// @generated from file micropayment/v1/micro_payment_service.proto (package code.micropayment.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Signature, SolanaAccountId } from "../../common/v1/model_pb";

/**
 * @generated from message code.micropayment.v1.CodifyRequest
 */
export class CodifyRequest extends Message<CodifyRequest> {
  /**
   * The URL to codify
   *
   * @generated from field: string url = 1;
   */
  url = "";

  /**
   * ISO 4217 alpha-3 currency code the payment should be made in
   *
   * @generated from field: string currency = 2;
   */
  currency = "";

  /**
   * The amount that should be paid in the native currency
   *
   * @generated from field: double native_amount = 3;
   */
  nativeAmount = 0;

  /**
   * The verified owner account public key
   *
   * @generated from field: code.common.v1.SolanaAccountId owner_account = 4;
   */
  ownerAccount?: SolanaAccountId;

  /**
   * The primary account public key where payment will be sent
   *
   * @generated from field: code.common.v1.SolanaAccountId primary_account = 5;
   */
  primaryAccount?: SolanaAccountId;

  /**
   * The signature is of serialize(CodifyRequest) without this field set using the
   * private key of the owner account. This provides an authentication mechanism
   * to the RPC and can be used to validate payment details.
   *
   * @generated from field: code.common.v1.Signature signature = 6;
   */
  signature?: Signature;

  constructor(data?: PartialMessage<CodifyRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.micropayment.v1.CodifyRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "currency", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "native_amount", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 4, name: "owner_account", kind: "message", T: SolanaAccountId },
    { no: 5, name: "primary_account", kind: "message", T: SolanaAccountId },
    { no: 6, name: "signature", kind: "message", T: Signature },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CodifyRequest {
    return new CodifyRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CodifyRequest {
    return new CodifyRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CodifyRequest {
    return new CodifyRequest().fromJsonString(jsonString, options);
  }

  static equals(a: CodifyRequest | PlainMessage<CodifyRequest> | undefined, b: CodifyRequest | PlainMessage<CodifyRequest> | undefined): boolean {
    return proto3.util.equals(CodifyRequest, a, b);
  }
}

/**
 * @generated from message code.micropayment.v1.CodifyResponse
 */
export class CodifyResponse extends Message<CodifyResponse> {
  /**
   * @generated from field: code.micropayment.v1.CodifyResponse.Result result = 1;
   */
  result = CodifyResponse_Result.OK;

  /**
   * @generated from field: string codified_url = 2;
   */
  codifiedUrl = "";

  constructor(data?: PartialMessage<CodifyResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.micropayment.v1.CodifyResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(CodifyResponse_Result) },
    { no: 2, name: "codified_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): CodifyResponse {
    return new CodifyResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): CodifyResponse {
    return new CodifyResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): CodifyResponse {
    return new CodifyResponse().fromJsonString(jsonString, options);
  }

  static equals(a: CodifyResponse | PlainMessage<CodifyResponse> | undefined, b: CodifyResponse | PlainMessage<CodifyResponse> | undefined): boolean {
    return proto3.util.equals(CodifyResponse, a, b);
  }
}

/**
 * @generated from enum code.micropayment.v1.CodifyResponse.Result
 */
export enum CodifyResponse_Result {
  /**
   * @generated from enum value: OK = 0;
   */
  OK = 0,

  /**
   * @generated from enum value: INVALID_URL = 1;
   */
  INVALID_URL = 1,

  /**
   * @generated from enum value: INVALID_ACCOUNT = 2;
   */
  INVALID_ACCOUNT = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(CodifyResponse_Result)
proto3.util.setEnumType(CodifyResponse_Result, "code.micropayment.v1.CodifyResponse.Result", [
  { no: 0, name: "OK" },
  { no: 1, name: "INVALID_URL" },
  { no: 2, name: "INVALID_ACCOUNT" },
]);

/**
 * @generated from message code.micropayment.v1.GetPathMetadataRequest
 */
export class GetPathMetadataRequest extends Message<GetPathMetadataRequest> {
  /**
   * @generated from field: string path = 1;
   */
  path = "";

  constructor(data?: PartialMessage<GetPathMetadataRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.micropayment.v1.GetPathMetadataRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "path", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetPathMetadataRequest {
    return new GetPathMetadataRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetPathMetadataRequest {
    return new GetPathMetadataRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetPathMetadataRequest {
    return new GetPathMetadataRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetPathMetadataRequest | PlainMessage<GetPathMetadataRequest> | undefined, b: GetPathMetadataRequest | PlainMessage<GetPathMetadataRequest> | undefined): boolean {
    return proto3.util.equals(GetPathMetadataRequest, a, b);
  }
}

/**
 * @generated from message code.micropayment.v1.GetPathMetadataResponse
 */
export class GetPathMetadataResponse extends Message<GetPathMetadataResponse> {
  /**
   * @generated from field: code.micropayment.v1.GetPathMetadataResponse.Result result = 1;
   */
  result = GetPathMetadataResponse_Result.OK;

  /**
   * The account where the payment should be sent to
   *
   * @generated from field: code.common.v1.SolanaAccountId destination = 2;
   */
  destination?: SolanaAccountId;

  /**
   * ISO 4217 alpha-3 currency code the payment should be made in
   *
   * @generated from field: string currency = 3;
   */
  currency = "";

  /**
   * The amount that should be paid in the native currency
   *
   * @generated from field: double native_amount = 4;
   */
  nativeAmount = 0;

  /**
   * The URL to redirect upon successful payment
   *
   * @generated from field: string redirct_url = 5;
   */
  redirctUrl = "";

  constructor(data?: PartialMessage<GetPathMetadataResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.micropayment.v1.GetPathMetadataResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(GetPathMetadataResponse_Result) },
    { no: 2, name: "destination", kind: "message", T: SolanaAccountId },
    { no: 3, name: "currency", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "native_amount", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 5, name: "redirct_url", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetPathMetadataResponse {
    return new GetPathMetadataResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetPathMetadataResponse {
    return new GetPathMetadataResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetPathMetadataResponse {
    return new GetPathMetadataResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetPathMetadataResponse | PlainMessage<GetPathMetadataResponse> | undefined, b: GetPathMetadataResponse | PlainMessage<GetPathMetadataResponse> | undefined): boolean {
    return proto3.util.equals(GetPathMetadataResponse, a, b);
  }
}

/**
 * @generated from enum code.micropayment.v1.GetPathMetadataResponse.Result
 */
export enum GetPathMetadataResponse_Result {
  /**
   * @generated from enum value: OK = 0;
   */
  OK = 0,

  /**
   * @generated from enum value: NOT_FOUND = 1;
   */
  NOT_FOUND = 1,
}
// Retrieve enum metadata with: proto3.getEnumType(GetPathMetadataResponse_Result)
proto3.util.setEnumType(GetPathMetadataResponse_Result, "code.micropayment.v1.GetPathMetadataResponse.Result", [
  { no: 0, name: "OK" },
  { no: 1, name: "NOT_FOUND" },
]);

