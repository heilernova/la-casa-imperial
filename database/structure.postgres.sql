-- Autor: Heiler Nova
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
CREATE EXTENSION pgcrypto;
CREATE EXTENSION unaccent;

CREATE DOMAIN cellphone AS VARCHAR CHECK (value ~* '^\+\d+ \d{3} \d{3} \d{4}$');
CREATE DOMAIN email AS VARCHAR(100) CHECK (value ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$');
CREATE DOMAIN hex_short_id AS CHAR(8) CHECK (value ~* '[0-9a-fA-F]{8}');

CREATE TYPE device AS ENUM('mobile', 'desktop', 'tablet');
CREATE TYPE taxpayer_type AS ENUM('natural', 'legal');
CREATE TYPE sex AS ENUM('M', 'F');

CREATE TYPE user_role AS ENUM('admin', 'collaborator', 'user');
CREATE TYPE user_status AS ENUM('active', 'lock');

---------------------------------------------------------------------------------------------------------------------------
-- Generar un id hexadecimal de 8 caracteres
CREATE FUNCTION gen_random_hex_short_id()
RETURNS hex_short_id LANGUAGE plpgsql AS $$
BEGIN
    RETURN encode(gen_random_bytes(4), 'hex');
END;$$;


CREATE TABLE users
(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),                --> ID del usuario
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),                  --> Fecha de creación del usuario
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),                  --> Fecha de actualización
    "role" user_role NOT NULL DEFAULT 'collaborator',               --> Rol del usuario
    "status" user_status NOT NULL DEFAULT 'active',                 --> Estado del usuario
    "username" VARCHAR(20) NOT NULL UNIQUE,                         --> Nombre de usuario
    "email" VARCHAR(100) NOT NULL UNIQUE,                           --> Correo electrónico
    "name" VARCHAR(20) NOT NULL,                                    --> Nombre
    "last_name" VARCHAR(20) NOT NULL,                               --> Apellido
    "sex" sex,                                                      --> M | F
    "cellphone" cellphone NOT NULL,                                 --> Teléfono celular
    "pin" TEXT,                                                     --> PIN de acceso
    "password" TEXT NOT NULL,                                       --> Contraseña
    "permissions" TEXT[] NOT NULL DEFAULT array[]::TEXT[]           --> Permisos
);

CREATE TABLE users_tokens
(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),                --> ID
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),                  --> Fecha de creación del token
    "user_id" UUID NOT NULL,                                        --> ID del usuario
    "exp" TIMESTAMP,                                                --> Fecha de expiración
    "ip" VARCHAR(40) NOT NULL,                                      --> IP de la conexión
    "platform" VARCHAR(40) NOT NULL,                                --> Plataforma / sistema operativo
    "device" VARCHAR(40) NOT NULL                                   --> Dispositivo
);

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
-- Configuraciones
---------------------------------------------------------------------------------------------------------------------------

CREATE TABLE app_settings
(
    "key" VARCHAR(50) PRIMARY KEY,
    "value" JSON
);

---------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------------------------------------------
-- Inventario
---------------------------------------------------------------------------------------------------------------------------
CREATE TYPE inventory_item_type AS ENUM('product', 'service');
CREATE TYPE inventory_item_status AS ENUM('active', 'stopped');

CREATE TABLE inventory_categories
(
    "id" hex_short_id PRIMARY KEY DEFAULT gen_random_hex_short_id(),
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200),
    "parent_id" hex_short_id,
    FOREIGN KEY (parent_id) REFERENCES inventory_categories("id") ON DELETE CASCADE,
    UNIQUE ("parent_id", "slug")
);

-- Función para extraer la categorías padres
CREATE FUNCTION app_inv_category_get_children(id_cate hex_short_id)
RETURNS TABLE(id hex_short_id, name VARCHAR, description VARCHAR, slug VARCHAR, parent_id hex_short_id) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE cte AS (
        SELECT a.id, a.name, a.description, a.slug, a.parent_id
        FROM inventory_categories a
        WHERE a.id = id_cate

        UNION ALL

        SELECT c.id, c.name, c.description, c.slug, c.parent_id
        FROM inventory_categories c
        INNER JOIN cte ON c.id = cte.parent_id
    )
    SELECT cte.id, cte.name, cte.description, cte.slug, cte.parent_id
    FROM cte;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE inventory_items
(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    "type" inventory_item_type NOT NULL,
    "status" inventory_item_status NOT NULL DEFAULT 'active',
    "publish" BOOLEAN NOT NULL DEFAULT false,
    "category_id" hex_short_id NOT NULL,
    "code" CHAR(4) NOT NULL,
    "unspsc" CHAR(8),
    "barcode" VARCHAR(40),
    "stock" INT NOT NULL DEFAULT 0,
    "stock_min" INT NOT NULL DEFAULT 0,
    "name" VARCHAR(200) NOT NULL,
    "brand" VARCHAR(30),
    "model" VARCHAR(30),
    "cost" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "other_cost_value" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "other_cost_details" JSON[] NOT NULL DEFAULT array[]::JSON[],
    "profit" NUMERIC(4, 4) NOT NULL DEFAULT 0,
    "price" NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "order_index" INT NOT NULL DEFAULT 0,
    "slug" VARCHAR(200) NOT NULL,
    "flags" JSON[] NOT NULL DEFAULT array[]::JSON[],
    "tags" TEXT[] NOT NULL DEFAULT array[]::TEXT[],
    "filters" JSON NOT NULL DEFAULT '{}'::JSON,
    "seo_title" VARCHAR(100),
    "seo_description" VARCHAR(200),
    "seo_keywords" TEXT[] NOT NULL DEFAULT array[]::TEXT[],
    "details" JSON[]  NOT NULL DEFAULT array[]::JSON[],
    "gallery" TEXT[] NOT NULL DEFAULT array[]::TEXT[],
    "open_graph_images" JSON[] NOT NULL DEFAULT array[]::JSON[],
    "description" TEXT
);

CREATE TABLE inventory_items_offers
(
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "item_id" UUID NOT NULL,
    "percentage" NUMERIC(4, 4) NOT NULL,
    "date_start" TIMESTAMP DEFAULT NULL,
    "date_end" TIMESTAMP DEFAULT NULL
);

DROP VIEW IF EXISTS vi_inventory_items;
CREATE VIEW vi_inventory_items AS
SELECT
a.id,
a.created_at,
a.updated_at,
a.type,
a.status,
a.publish,
a.code,
a.unspsc,
a.barcode,
a.stock,
a.stock_min,
a.name,
a.brand,
a.model,
a.cost,
a.other_cost_value,
a.other_cost_details,
a.price AS "price",
CASE
    WHEN coalesce(SUM(b.percentage), 0) = 0 THEN 0
    ELSE (a.price * (1 - coalesce(SUM(b.percentage), 0)))::NUMERIC(15, 2)
END AS "offer_price",
coalesce(SUM(b.percentage), 0) AS "offer_percentage",
MAX(b.date_end) AS "offer_exp",
a.order_index,
a.slug,
a.flags,
a.tags,
a.filters,
json_build_object(
    'title', a.seo_title,
    'description', a.seo_description,
    'keywords', a.seo_keywords
) AS "seo",
(SELECT json_agg(json_build_object('id', cte.id, 'name', cte.name, 'slug', cte.slug )) FROM app_inv_category_get_children(a.category_id) cte ) AS categories,
a.details,
a.gallery,
a.open_graph_images,
a.description
FROM inventory_items a
LEFT JOIN
    inventory_items_offers b ON b.item_id = a.id
GROUP BY
    a.id;

