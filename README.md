<img width="1280" alt="Code Cash Links" src="https://github.com/code-payments/code-cash-links/assets/623790/bc695312-6bb6-4615-83aa-102b55392a72">

# Code Cash Links
![license][license-image]
![version][version-image]

[version-image]: https://img.shields.io/badge/version-0.1.0-blue.svg?style=flat
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat

This repository contains the frontend and backend for the Code Cash Links project. To learn more about the project, please visit [getcode.com](https://getcode.com).

## Development
The codebase is split into the following packages:

* `backend` - A proxy server that allows bidi GRPC streams over WebSockets on HTTP/1. This is used to proxy GRPC requests from the frontend to the GRPC server on the Code Sequencer (L2).
* `frontend` - A Vue codebase for rendering the Cash Links. The codebase includes all logic necessary to generate a send intent against the Code Sequencer. Including things like the mnemonic keyphrase, the KikCode, and the send intent.
* `kikcode` - A C++ library for rendering KikCodes. This library is compiled to WASM and wrapped in a JS library for use in the frontend.

This project predates the [code-sdk](https://github.com/code-wallet/code-sdk).


## Quick Start
Each package has its own `Makefile`, which can be used to build and run the package. Additionally, you can run each package in a Docker container. Use `npm run dev` to run the local development environment both the frontend and backend.

<img width="50%" src="https://github.com/code-wallet/code-cashlinks/assets/623790/e63f464d-3047-42cc-84ef-efe401616c78">


## Getting Help

If you have any questions or need help integrating Code into your website or application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp) or [Twitter](https://twitter.com/getcode).

##  Contributing

For now the best way to contribute is to share feedback on [Discord](https://discord.gg/T8Tpj8DBFp). This will evolve as we continue to build out the platform and open up more ways to contribute. 
