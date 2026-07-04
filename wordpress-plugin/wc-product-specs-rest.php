<?php
/**
 * Plugin Name: WC Product Specs REST API
 * Description: Exposes WooCommerce product attributes, SKU, and price via WP REST API
 * Version: 1.0
 */

// Register custom REST fields for product post type
add_action('rest_api_init', function () {
    // Product attributes (pa_* taxonomies + global attributes)
    register_rest_field('product', 'wc_attributes', [
        'get_callback' => function ($product) {
            $product_obj = wc_get_product($product['id']);
            if (!$product_obj) return [];

            $attributes = [];
            foreach ($product_obj->get_attributes() as $attr_name => $attribute) {
                $attributes[] = [
                    'name'  => wc_attribute_label($attr_name),
                    'slug'  => $attr_name,
                    'value' => $attribute->is_taxonomy()
                        ? implode(', ', wc_get_product_terms($product['id'], $attr_name, ['fields' => 'names']))
                        : $attribute->get_data()['value'],
                ];
            }
            return $attributes;
        },
        'schema' => [
            'type' => 'array',
            'items' => ['type' => 'object'],
        ],
    ]);

    // SKU
    register_rest_field('product', 'wc_sku', [
        'get_callback' => fn($p) => get_post_meta($p['id'], '_sku', true) ?: '',
        'schema' => ['type' => 'string'],
    ]);

    // Price
    register_rest_field('product', 'wc_price', [
        'get_callback' => fn($p) => get_post_meta($p['id'], '_price', true) ?: '',
        'schema' => ['type' => 'string'],
    ]);

    // Stock status
    register_rest_field('product', 'wc_stock', [
        'get_callback' => fn($p) => get_post_meta($p['id'], '_stock_status', true) ?: 'instock',
        'schema' => ['type' => 'string'],
    ]);

    // Gallery images
    register_rest_field('product', 'wc_gallery', [
        'get_callback' => function ($product) {
            $ids = get_post_meta($product['id'], '_product_image_gallery', true);
            if (!$ids) return [];
            return array_map(function ($id) {
                $src = wp_get_attachment_image_url($id, 'full');
                $alt = get_post_meta($id, '_wp_attachment_image_alt', true);
                return ['id' => (int)$id, 'src' => $src, 'alt' => $alt];
            }, explode(',', $ids));
        },
        'schema' => ['type' => 'array', 'items' => ['type' => 'object']],
    ]);
});
