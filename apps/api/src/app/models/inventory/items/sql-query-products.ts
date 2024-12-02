export const SQL_QUERY_PRODUCTS =
`
SELECT
    a.id,
    a.created_at AS "createdAt",
    a.updated_at AS "updatedAt",
    a.type,
    a.status,
    a.publish,
    a.code,
    a.unspsc,
    a.barcode,
    a.stock,
    a.stock_min AS "stockMin",
    a.name,
    a.brand,
    a.model,
    JSON_BUILD_OBJECT(
        'baseCost', a.cost,
        'otherCosts', JSON_BUILD_OBJECT(
            'total', a.other_cost_value,
            'details', a.other_cost_details
        ), 
        'total', a.cost + a.other_cost_value
    ) AS "cost",
    (COALESCE(NULLIF(a.offer_price, 0), a.price, a.offer_price))::float AS price,
    CASE WHEN a.offer_percentage > 0 THEN
        JSON_BUILD_OBJECT(
            'basePrice', a.price,
            'percentage', a.offer_percentage,
            'exp', a.offer_exp
        )
    ELSE
        NULL
    END AS offer,
    a.order_index as "orderIndex",
    a.slug,
    a.flags,
    a.tags,
    a.filters,
    a.categories,
    a.seo,
    a.details,
    a.gallery,
    a.open_graph_images AS "openGraphImages",
    a.description
FROM vi_inventory_items a
`;