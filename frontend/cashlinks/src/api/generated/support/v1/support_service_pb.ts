// @generated by protoc-gen-es v1.3.0 with parameter "target=ts"
// @generated from file support/v1/support_service.proto (package code.support.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import { Locale } from "../../common/v1/model_pb";

/**
 * @generated from message code.support.v1.GetFAQsRequest
 */
export class GetFAQsRequest extends Message<GetFAQsRequest> {
  /**
   * The locale of the user requesting the FAQs.
   *
   * If a translation specific to the locale's region is available, it will be returned,
   * otherwise the service will fall back to a translation in the locale's language.
   *
   * @generated from field: code.common.v1.Locale locale = 1;
   */
  locale?: Locale;

  constructor(data?: PartialMessage<GetFAQsRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.support.v1.GetFAQsRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "locale", kind: "message", T: Locale },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetFAQsRequest {
    return new GetFAQsRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetFAQsRequest {
    return new GetFAQsRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetFAQsRequest {
    return new GetFAQsRequest().fromJsonString(jsonString, options);
  }

  static equals(a: GetFAQsRequest | PlainMessage<GetFAQsRequest> | undefined, b: GetFAQsRequest | PlainMessage<GetFAQsRequest> | undefined): boolean {
    return proto3.util.equals(GetFAQsRequest, a, b);
  }
}

/**
 * @generated from message code.support.v1.GetFAQsResponse
 */
export class GetFAQsResponse extends Message<GetFAQsResponse> {
  /**
   * @generated from field: code.support.v1.GetFAQsResponse.Result result = 1;
   */
  result = GetFAQsResponse_Result.OK;

  /**
   * If result == Result::OK, the returned FAQs are in the requested locale's language.
   * If result == Result::LANG_UNAVAILABLE, the returned FAQs are in English.
   *
   * @generated from field: repeated code.support.v1.FAQ faqs = 2;
   */
  faqs: FAQ[] = [];

  constructor(data?: PartialMessage<GetFAQsResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.support.v1.GetFAQsResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "enum", T: proto3.getEnumType(GetFAQsResponse_Result) },
    { no: 2, name: "faqs", kind: "message", T: FAQ, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GetFAQsResponse {
    return new GetFAQsResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GetFAQsResponse {
    return new GetFAQsResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GetFAQsResponse {
    return new GetFAQsResponse().fromJsonString(jsonString, options);
  }

  static equals(a: GetFAQsResponse | PlainMessage<GetFAQsResponse> | undefined, b: GetFAQsResponse | PlainMessage<GetFAQsResponse> | undefined): boolean {
    return proto3.util.equals(GetFAQsResponse, a, b);
  }
}

/**
 * @generated from enum code.support.v1.GetFAQsResponse.Result
 */
export enum GetFAQsResponse_Result {
  /**
   * @generated from enum value: OK = 0;
   */
  OK = 0,

  /**
   * FAQs for the requested language are currently unavailable.
   *
   * @generated from enum value: LANG_UNAVAILABLE = 1;
   */
  LANG_UNAVAILABLE = 1,
}
// Retrieve enum metadata with: proto3.getEnumType(GetFAQsResponse_Result)
proto3.util.setEnumType(GetFAQsResponse_Result, "code.support.v1.GetFAQsResponse.Result", [
  { no: 0, name: "OK" },
  { no: 1, name: "LANG_UNAVAILABLE" },
]);

/**
 * @generated from message code.support.v1.FAQ
 */
export class FAQ extends Message<FAQ> {
  /**
   * @generated from field: string question = 1;
   */
  question = "";

  /**
   * @generated from field: string answer = 2;
   */
  answer = "";

  constructor(data?: PartialMessage<FAQ>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "code.support.v1.FAQ";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "question", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "answer", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): FAQ {
    return new FAQ().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): FAQ {
    return new FAQ().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): FAQ {
    return new FAQ().fromJsonString(jsonString, options);
  }

  static equals(a: FAQ | PlainMessage<FAQ> | undefined, b: FAQ | PlainMessage<FAQ> | undefined): boolean {
    return proto3.util.equals(FAQ, a, b);
  }
}
