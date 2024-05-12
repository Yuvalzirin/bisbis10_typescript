CREATE TABLE restaurant(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avgrating DECIMAL(2, 1) NOT NULL,
    isKosher BOOLEAN NOT NULL,
    cuisines VARCHAR(255)[] NOT NULL,
    UNIQUE(name)
    );

CREATE TABLE dishes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(5, 2) NOT NULL,
    description TEXT NOT NULL,
    restaurant_id INT NOT NULL REFERENCES restaurant(id),
    UNIQUE(name, restaurant_id)
    );

CREATE TABLE rating(
    id SERIAL PRIMARY KEY,
    restaurantId INT NOT NULL REFERENCES restaurant(id),
    rating DECIMAL(2, 1) NOT NULL
    );

CREATE TABLE orders(
    id SERIAL PRIMARY KEY,
    restaurantId INT NOT NULL REFERENCES restaurant(id),
    orderItems JSONB NOT NULL
    );






