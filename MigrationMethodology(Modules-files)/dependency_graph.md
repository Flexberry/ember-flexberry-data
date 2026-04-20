# Граф зависимостей проекта ember-flexberry-data5

## Статистика
- Количество модулей: 17
- Количество файлов: 139
- Количество зависимостей между модулями: 21

---

```mermaid
graph TB
    %% Стили для модулей
    style models fill:#e1f5ff,stroke:#333,stroke-width:1px
    style serializers fill:#e1f5ff,stroke:#333,stroke-width:1px
    style adapters fill:#e1f5ff,stroke:#333,stroke-width:1px
    style stores fill:#e1f5ff,stroke:#333,stroke-width:1px
    style mixins fill:#e1f5ff,stroke:#333,stroke-width:1px
    style transforms fill:#e1f5ff,stroke:#333,stroke-width:1px
    style services fill:#e1f5ff,stroke:#333,stroke-width:1px
    style initializers fill:#e1f5ff,stroke:#333,stroke-width:1px
    style instance-initializers fill:#e1f5ff,stroke:#333,stroke-width:1px
    style query-builder fill:#e1f5ff,stroke:#333,stroke-width:1px
    style utils fill:#e1f5ff,stroke:#333,stroke-width:1px
    style enums fill:#e1f5ff,stroke:#333,stroke-width:1px
    style offline-globals-initializer fill:#e1f5ff,stroke:#333,stroke-width:1px
    style.local-store-initializer fill:#e1f5ff,stroke:#333,stroke-width:1px
    style flexberry-enum-initializer fill:#e1f5ff,stroke:#333,stroke-width:1px

    %% Субграф для модуля models [model]
    subgraph "models [model]"
        direction TB
        models_model_file["model.js (file)"]
        models_offline_model_file["offline-model.js (file)"]
        models_model_without_validation_file["model-without-validation.js (file)"]
        models_audit_entity_file["audit-entity.js (file)"]
        models_audit_field_file["audit-field.js (file)"]
        models_object_type_file["object-type.js (file)"]
        models_agent_file["agent.js (file)"]
        models_link_group_file["link-group.js (file)"]
        models_session_file["session.js (file)"]
    end

    %% Субграф для модуля serializers [serializer]
    subgraph "serializers [serializer]"
        direction TB
        serializers_base_file["base.js (file)"]
        serializers_odata_file["odata.js (file)"]
        serializers_offline_file["offline.js (file)"]
        serializers_audit_entity_file["audit-entity.js (file)"]
        serializers_audit_entity_offline_file["audit-entity-offline.js (file)"]
        serializers_audit_field_file["audit-field.js (file)"]
        serializers_audit_field_offline_file["audit-field-offline.js (file)"]
        serializers_object_type_file["object-type.js (file)"]
        serializers_object_type_offline_file["object-type-offline.js (file)"]
        serializers_agent_file["agent.js (file)"]
        serializers_agent_offline_file["agent-offline.js (file)"]
        serializers_link_group_file["link-group.js (file)"]
        serializers_session_file["session.js (file)"]
    end

    %% Субграф для модуля adapters [adapter]
    subgraph "adapters [adapter]"
        direction TB
        adapters_odata_file["odata.js (file)"]
        adapters_offline_file["offline.js (file)"]
    end

    %% Субграф для модуля mixins [mixin]
    subgraph "mixins [mixin]"
        direction TB
        mixins_adapter_file["adapter.js (file)"]
        mixins_store_file["store.js (file)"]
        mixins_audit_model_file["audit-model.js (file)"]
        mixins_copyable_file["copyable.js (file)"]
        mixins_offline_model_file["offline-model.js (file)"]
        mixins_reg_audit_entity_file["audit-entity.js (file)"]
        mixins_reg_audit_field_file["audit-field.js (file)"]
        mixins_reg_object_type_file["object-type.js (file)"]
        mixins_reg_agent_file["agent.js (file)"]
        mixins_reg_link_group_file["link-group.js (file)"]
        mixins_reg_session_file["session.js (file)"]
    end

    %% Субграф для модуля transforms [transform]
    subgraph "transforms [transform]"
        direction TB
        transforms_decimal_file["decimal.js (file)"]
        transforms_file_file["file.js (file)"]
        transforms_flexberry_enum_file["flexberry-enum.js (file)"]
        transforms_guid_file["guid.js (file)"]
        transforms_execution_variant_file["t-execution-variant.js (file)"]
        transforms_type_of_audit_operation_file["t-type-of-audit-operation.js (file)"]
    end

    %% Субграф для модуля services [service]
    subgraph "services [service]"
        direction TB
        services_user_file["user.js (file)"]
        services_syncer_file["syncer.js (file)"]
        services_dexie_file["dexie.js (file)"]
        services_offline_globals_file["offline-globals.js (file)"]
    end

    %% Субграф для модуля initializers [initializer]
    subgraph "initializers [initializer]"
        direction TB
        initializers_offline_globals_file["offline-globals.js (file)"]
        initializers_local_store_file["local-store.js (file)"]
        initializers_flexberry_enum_file["flexberry-enum.js (file)"]
    end

    %% Субграф для модуля instance-initializers [instance-initializer]
    subgraph "instance-initializers [instance-initializer]"
        direction TB
        instance_initializers_set_singletons_file["set-singletons.js (file)"]
    end

    %% Субграф для модуля query-builder [builder]
    subgraph "query-builder [builder]"
        direction TB
        query_builder_base_adapter_file["base-adapter.js (file)"]
        query_builder_base_builder_file["base-builder.js (file)"]
        query_builder_builder_file["builder.js (file)"]
        query_builder_condition_file["condition.js (file)"]
        query_builder_filter_operator_file["filter-operator.js (file)"]
        query_builder_indexeddb_adapter_file["indexeddb-adapter.js (file)"]
        query_builder_js_adapter_file["js-adapter.js (file)"]
        query_builder_odata_adapter_file["odata-adapter.js (file)"]
        query_builder_order_by_clause_file["order-by-clause.js (file)"]
        query_builder_parameter_file["parameter.js (file)"]
        query_builder_predicate_file["predicate.js (file)"]
        query_builder_query_object_file["query-object.js (file)"]
    end

    %% Субграф для модуля stores [store]
    subgraph "stores [store]"
        direction TB
        stores_base_store_file["base-store.js (file)"]
        stores_local_store_file["local-store.js (file)"]
        stores_online_store_file["online-store.js (file)"]
        stores_decorate_adapter_file["decorate-adapter.js (file)"]
        stores_decorate_api_call_file["decorate-api-call.js (file)"]
    end

    %% Субграф для модуля utils [utils]
    subgraph "utils [utils]"
        direction TB
        utils_attributes_file["attributes.js (file)"]
        utils_backup_file["backup.js (file)"]
        utils_batch_queries_file["batch-queries.js (file)"]
        utils_create_file["create.js (file)"]
        utils_enum_functions_file["enum-functions.js (file)"]
        utils_first_load_offline_objects_file["first-load-offline-objects.js (file)"]
        utils_generate_unique_id_file["generate-unique-id.js (file)"]
        utils_get_serialized_date_value_file["get-serialized-date-value.js (file)"]
        utils_information_file["information.js (file)"]
        utils_is_async_file["is-async.js (file)"]
        utils_is_embedded_file["is-embedded.js (file)"]
        utils_is_model_instance_file["is-model-instance.js (file)"]
        utils_is_object_file["is-object.js (file)"]
        utils_is_uuid_file["is-uuid.js (file)"]
        utils_model_functions_file["model-functions.js (file)"]
        utils_queue_file["queue.js (file)"]
        utils_reload_local_records_file["reload-local-records.js (file)"]
        utils_snapshot_transform_file["snapshot-transform.js (file)"]
        utils_string_functions_file["string-functions.js (file)"]
    end

    %% Субграф для модуля enums [enum]
    subgraph "enums [enum]"
        direction TB
        enums_execution_variant_file["t-execution-variant.js (file)"]
        enums_type_of_audit_operation_file["t-type-of-audit-operation.js (file)"]
    end

    %% Субграф для модуля regenerated-serializers [serializer]
    subgraph "regenerated-serializers [serializer]"
        direction TB
        regenerated_serializers_audit_entity_file["audit-entity.js (file)"]
        regenerated_serializers_audit_field_file["audit-field.js (file)"]
        regenerated_serializers_object_type_file["object-type.js (file)"]
        regenerated_serializers_agent_file["agent.js (file)"]
        regenerated_serializers_link_group_file["link-group.js (file)"]
        regenerated_serializers_session_file["session.js (file)"]
    end

    %% Субграф для модуля offline-globals-initializer [initializer]
    subgraph "offline-globals-initializer [initializer]"
        direction TB
        offline_globals_initializer_offline_globals_file["offline-globals.js (file)"]
        offline_globals_initializer_offline_globals_service["offline-globals.js (file)"]
    end

    %% Субграф для модуля local-store-initializer [initializer]
    subgraph "local-store-initializer [initializer]"
        direction TB
        local_store_initializer_local_store_file["local-store.js (file)"]
    end

    %% Субграф для модуля flexberry-enum-initializer [initializer]
    subgraph "flexberry-enum-initializer [initializer]"
        direction TB
        flexberry_enum_initializer_flexberry_enum_file["flexberry-enum.js (file)"]
        flexberry_enum_initializer_flexberry_enum_transform["flexberry-enum.js (file)"]
    end

    %% Зависимости между модулями
    serializers -->|imports| models
    serializers -->|imports| mixins
    serializers -->|imports| utils
    models -->|imports| transforms
    models -->|imports| utils
    mixins -->|inherits| models
    mixins -->|imports| utils
    services -->|imports| stores
    services -->|imports| utils
    offline-globals-initializer -->|imports| services
    local-store-initializer -->|imports| stores
    flexberry-enum-initializer -->|imports| transforms
    instance-initializers -->|imports| services
    query-builder -->|imports| serializers
    query-builder -->|imports| utils
    stores -->|imports| adapters
    stores -->|imports| serializers
    stores -->|imports| mixins
    stores -->|imports| query-builder
    adapters -->|imports| query-builder
    adapters -->|imports| serializers
    adapters -->|imports| utils
    utils -->|uses| create
    utils -->|uses| information
    enum-functions -->|uses| utils

    %% Связи между файлами на основе имен
    models_offline_model_file -->|depends on| models_model_file
    models_audit_entity_file -->|inherits from| models_model_file
    models_audit_field_file -->|inherits from| models_model_file
    models_object_type_file -->|inherits from| models_model_file
    models_agent_file -->|inherits from| models_model_file
    models_link_group_file -->|inherits from| models_model_file
    models_session_file -->|inherits from| models_model_file
    models_audit_entity_file -->|depends on| mixins_audit_model_file
    models_audit_field_file -->|depends on| mixins_audit_model_file
    models_object_type_file -->|depends on| mixins_audit_model_file
    models_agent_file -->|depends on| mixins_audit_model_file
    models_link_group_file -->|depends on| mixins_audit_model_file
    models_session_file -->|depends on| mixins_audit_model_file
    models_audit_entity_file -->|has serializer| serializers_audit_entity_file
    models_audit_field_file -->|has serializer| serializers_audit_field_file
    models_object_type_file -->|has serializer| serializers_object_type_file
    models_agent_file -->|has serializer| serializers_agent_file
    models_link_group_file -->|has serializer| serializers_link_group_file
    models_session_file -->|has serializer| serializers_session_file
    serializers_audit_entity_file -->|has offline version| serializers_audit_entity_offline_file
    serializers_audit_field_file -->|has offline version| serializers_audit_field_offline_file
    serializers_object_type_file -->|has offline version| serializers_object_type_offline_file
    serializers_agent_file -->|has offline version| serializers_agent_offline_file
    serializers_link_group_file -->|has offline version| serializers_link_group_offline_file
    serializers_session_file -->|has offline version| serializers_session_offline_file
    mixins_offline_model_file -->|inherits from| models_offline_model_file
    adapters_offline_file -->|uses| mixins_offline_model_file
    serializers_offline_file -->|uses| mixins_offline_model_file
    stores_local_store_file -->|uses| mixins_offline_model_file
    query_builder_indexeddb_adapter_file -->|uses| mixins_offline_model_file
    stores_base_store_file -->|has decorator| stores_decorate_adapter_file
    stores_base_store_file -->|has decorator| stores_decorate_api_call_file
    utils_string_functions_file -->|used by| utils_information_file
    utils_batch_queries_file -->|uses| utils_information_file
    enum_functions -->|uses| utils_string_functions_file
```

---

**Примечания:**
- Связи между модулями показывают типы зависимостей: `imports`, `inherits`, `uses`
- Внутри модулей файлы с зависимостями друг от друга соединены пунктирными линиями с пометкой `depends on`, `inherits from`, `has serializer`, `has offline version`
- Серые узлы обозначают файлы, синие — модули
- Базовые модели (model, offline-model) несут большую нагрузку в графе зависимостей
- Много зависимостей через mixins (audit-model, offline-model)
