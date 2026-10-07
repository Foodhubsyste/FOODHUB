# FOODHUB Database ERD

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : appears_in
    ORDERS ||--o| SALES : generates

    CUSTOMERS {
        varchar id PK
        varchar full_name
        varchar contact_number UK
        varchar address
        int total_orders
    }

    MENU_ITEMS {
        varchar id PK
        varchar name
        varchar category
        decimal price
        int stock_quantity
        varchar status
    }

    ORDERS {
        varchar id PK
        varchar order_number UK
        varchar customer_id FK
        decimal total_amount
        varchar fulfillment_type
        datetime scheduled_datetime
        varchar payment_status
        varchar order_status
    }

    ORDER_ITEMS {
        bigint id PK
        varchar order_id FK
        varchar menu_id FK
        varchar item_name_snapshot
        int quantity
        decimal unit_price
        decimal subtotal
    }

    SALES {
        varchar id PK
        varchar order_id FK UK
        date transaction_date
        decimal total_received
        varchar payment_method
    }
```

## How to explain it

"The customer is the parent of orders. Each order can have many order items. Each order item points to a menu item, while keeping an item-name snapshot for order history. A completed order can generate one sales record."

## Integrity rules
- Customer deletion is restricted when order history exists.
- Menu deletion is restricted when the item is referenced by an order.
- An order item cannot exist without its order and menu item.
- A sale references one order and is unique per order.