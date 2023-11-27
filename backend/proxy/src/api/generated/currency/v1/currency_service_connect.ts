// @generated by protoc-gen-connect-es v0.11.0 with parameter "target=ts"
// @generated from file currency/v1/currency_service.proto (package code.currency.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { GetAllRatesRequest, GetAllRatesResponse, GetExchangeRateHistoryRequest, GetExchangeRateHistoryResponse } from "./currency_service_pb";
import { MethodKind } from "@bufbuild/protobuf";

/**
 * @generated from service code.currency.v1.Currency
 */
export const Currency = {
  typeName: "code.currency.v1.Currency",
  methods: {
    /**
     * GetRate returns the exchange rates for Kin against all available currencies.
     *
     * @generated from rpc code.currency.v1.Currency.GetAllRates
     */
    getAllRates: {
      name: "GetAllRates",
      I: GetAllRatesRequest,
      O: GetAllRatesResponse,
      kind: MethodKind.Unary,
    },
    /**
     * GetExchangeRateHistory returns the exchange rate for Kin given a time
     * range, bucketing interval, and currency.
     *
     * @generated from rpc code.currency.v1.Currency.GetExchangeRateHistory
     */
    getExchangeRateHistory: {
      name: "GetExchangeRateHistory",
      I: GetExchangeRateHistoryRequest,
      O: GetExchangeRateHistoryResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

