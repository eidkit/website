---
id: ios-api
title: iOS API Reference
sidebar_position: 6
---

# iOS API Reference

The full iOS API reference is generated from source using [DocC](https://www.swift.org/documentation/docc/) and published automatically when a new SDK version is tagged.

:::info Coming soon
The API reference HTML will appear here once the first SDK release is tagged and the docs sync workflow has run.

In the meantime, the source is fully documented — browse it directly on GitHub:
[eidkit/eidkit-ios — Sources/EidKit](https://github.com/eidkit/eidkit-ios/tree/main/Sources/EidKit)
:::

## Key types

| Type | Description |
|------|-------------|
| [`EidKit`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/EidKit.swift) | Main entry point — configure SDK, obtain builders |
| [`CeiReader`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/CeiReader.swift) | Builder for KYC read sessions |
| [`CeiSigner`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/CeiSigner.swift) | Builder for document signing sessions |
| [`EidKitConfig`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/Config/EidKitConfig.swift) | SDK configuration |
| [`ReadResult`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/Model/ReadResult.swift) | Result of a read session |
| [`SignResult`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/Model/SignResult.swift) | Result of a signing session |
| [`CeiError`](https://github.com/eidkit/eidkit-ios/blob/main/Sources/EidKit/Error/CeiError.swift) | Error types thrown by the SDK |
