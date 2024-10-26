# Conventions

## Symbols

- `X` is the main entity of the use case (e.g., `Order`).
- `Y` is a related entity of `X` that has a one-to-many relationship with `X` (e.g., `OrderItem`).
- `Z` is a related entity of `X` that has a many-to-many relationship with `X` (e.g., `Tag`).
- `XZ` is the association entity between `X` and `Z` (e.g., `OrderTag` linking `Order` to `Tag`).
- `S` is a related entity of `X` that has a one-to-one relationship with `X` (e.g., `ShippingAddress`).
- `U` is an actor or owner that can perform actions on entities defined above (e.g., `User`).

## Function Signatures

### `getX`

```ts
getX: (id: ID, ...) => Promise<X | null>
```

- Retrieves a single item by its ID.
- Returns `null` if the item does not exist.

**Example:** Fetching an `Order` by its ID to display its details.

### `getXs`

```ts
getXs: (filter: Filter, ...) => Promise<Paginated<X>>
```

- Retrieves a collection of items based on a filter.
- Paginates results by default with a hard limit if pagination is not requested.

**Example:** Retrieving a list of orders for a customer filtered by order status, with pagination.

### `createX`

```ts
createX: (data: X) => Promise<string>;
```

- Creates a new item and returns the ID of the new item upon success.

**Example:** Creating a new `Order` and receiving the newly created order ID.

### `updateX`

```ts
updateX: (id: ID, data: X) => Promise<void>;
```

- Updates an existing item by its ID.
- Throws a `NotFoundError` if the item does not exist.

**Example:** Updating an `Order`'s delivery date if the order is found.

### `deleteX`

```ts
deleteX: (id: ID) => Promise<void>;
```

- Deletes an existing item by its ID.
- Throws a `NotFoundError` if the item does not exist.

**Example:** Deleting an `Order` that was created by mistake.

### `actionX`

```ts
actionX: (id: ID, ...) => Promise<void>
```

- Performs an action on an existing item by its ID.
- Throws `NotFoundError` if the item does not exist.
- Throws `ActionNotAllowedError` if the action violates business logic.

**Example:** Marking an `Order` as "Shipped" but throwing an error if the order is already canceled.

### `addYToX`

```ts
addYToX: (id: ID, yData: Y) => Promise<void>;
```

- Adds a related entity `Y` to the main entity `X`.
- Throws `NotFoundError` if `X` does not exist.

**Example:** Adding an `OrderItem` to an existing `Order`.

### `removeYFromX`

```ts
removeYFromX: (xId: ID, yId: ID) => Promise<void>;
```

- Removes a related entity `Y` from the main entity `X`.
- Throws `NotFoundError` if `X` or `Y` does not exist.

**Example:** Removing an `OrderItem` from an `Order`.

### `addZToX`

```ts
addZToX: (xId: ID, zId: ID) => Promise<void>;
```

- Links an existing related entity `Z` to the main entity `X`.
- Throws `NotFoundError` if `X` or `Z` does not exist.

**Example:** Tagging an `Order` with an existing `Tag` such as "Priority".

### `removeZFromX`

```ts
removeZFromX: (xId: ID, zId: ID) => Promise<void>;
```

- Unlinks an existing related entity `Z` from the main entity `X`.
- Throws `NotFoundError` if `X` or `Z` does not exist.

**Example:** Removing the "Priority" `Tag` from an `Order`.

### `getXZs`

```ts
getXZs: (xId: ID, filter: Filter) => Promise<Paginated<Z>>;
```

- Retrieves a paginated collection of association entities (`XZ`).
- Returns an empty collection if `X` does not exist.

**Example:** Fetching all `Tags` associated with an `Order`.

### `updateS`

```ts
updateS: (xId: ID, data: S) => Promise<void>;
```

- Updates or creates a related `S` entity for the main entity `X`.
- Throws `NotFoundError` if `X` does not exist.

**Example:** Updating an `Order`'s `ShippingAddress` or creating a new one if not yet present.

## Actor Pattern

`X` (the main entity) often has an associated actor, such as a `Post` having an `Author`. We can include the actor as a parameter in the function signature to ensure that actions are performed by authorized individuals.

```ts
createX: (actor: Actor, data: X) => Promise<string>;
```

The `actor` parameter can be used to validate whether the actor has the necessary permissions to execute the action. This approach allows us to incorporate role-based or ownership-based access control into the business logic.

### Example Scenarios

1. **Ownership-Based Permission**:  
   Only the author of a post (`Actor`) can update or delete the post. In this case, the function checks whether the actor is the post's author before proceeding.

   ```ts
   updateX: (actor: Actor, id: ID, data: X) => Promise<void>;
   ```

   **Use Case:** An author can edit their own post, but other users cannot.

2. **Role-Based Permission**:  
   Some actions may be allowed based on the actor's role rather than ownership. For instance, a public post can be updated by anyone, or an admin can override ownership rules.

   ```ts
   updateX: (actor: Actor, id: ID, data: X) => Promise<void>;
   ```

   **Use Case:** A moderator can update any post regardless of who authored it, while regular users can only update their own posts.

Incorporating the actor in function signatures allows the system to make dynamic, actor-specific authorization decisions based on role, ownership, or other conditions relevant to the action.

## Errors

### `NotFoundError`

- Thrown when an entity (`X`, `Y`, `Z`, etc.) is not found in the system.

**Example:** Trying to fetch an `Order` that doesn’t exist.

### `ValidationError`

- Thrown when the data provided does not meet validation requirements.

**Example:** Creating an `Order` with an invalid delivery date format.

### `UnauthorizedError`

- Thrown when the user is not authenticated or lacks valid credentials.

**Example:** Attempting to create an `Order` without being logged in.

### `ForbiddenError`

- Thrown when the user does not have permission to perform the action.

**Example:** Trying to update an `Order` without the right permissions.

### `ConstraintViolationError`

- Thrown when database constraints (e.g., foreign key, unique constraints) are violated.

**Example:** Attempting to create an `Order` with a non-existent `CustomerID`.

### `ActionNotAllowedError`

- Thrown when business logic constraints prevent an action from being performed.

**Example:** Trying to cancel an `Order` that has already been shipped.
