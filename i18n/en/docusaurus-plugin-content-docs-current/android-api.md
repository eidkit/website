---
id: android-api
title: Android API Reference
sidebar_position: 5
---

# Android API Reference

The full Android API reference is generated from source using [Dokka](https://kotlinlang.org/docs/dokka-introduction.html) and published automatically when a new SDK version is tagged.

:::info Coming soon
The API reference HTML will appear here once the first SDK release is tagged and the docs sync workflow has run.

In the meantime, the source is fully documented — browse it directly on GitHub:
[eidkit/eidkit-android — sdk/src/main/kotlin](https://github.com/eidkit/eidkit-android/tree/main/sdk/src/main/kotlin/ro/eidkit/sdk)
:::

## Key classes

| Class | Description |
|-------|-------------|
| [`EidKit`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/EidKit.kt) | Main entry point — configure SDK, obtain builders |
| [`CeiReader`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/CeiReader.kt) | Builder for KYC read sessions |
| [`CeiSigner`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/CeiSigner.kt) | Builder for document signing sessions |
| [`EidKitConfig`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/config/EidKitConfig.kt) | SDK configuration DSL |
| [`ReadResult`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/model/ReadResult.kt) | Result of a read session |
| [`SignResult`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/model/SignResult.kt) | Result of a signing session |
| [`CeiError`](https://github.com/eidkit/eidkit-android/blob/main/sdk/src/main/kotlin/ro/eidkit/sdk/error/CeiError.kt) | Error types thrown by the SDK |
