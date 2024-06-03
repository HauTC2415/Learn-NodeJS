# Index

- Giúp quá trình query nhanh hơn nhưng lai tốn bộ nhớ
- Khi index thì chọn field có ít sự trung lặp nhất

# Compound Index

- Create index từ nhiều thuộc tính cùng lúc

# Index Asc & Desc

- Sort by index, fast than sort properties

# After Compound index, do we need to index each field or not?

- Need

# Index with MongoSH

1. use db_name
2. db.table_name.getIndexes
3. ADD: db.table_name.createIndex({field_name: -1})
4. REMOVE: db.table_name.dropIndex({field_name: -1})
5. MODIFY: remove -> add

# Advantages and disavantages

### Advatages:

- Increase performance for data query, with less time returning result.

### Disavantages:

- Increase storage memory
- Increase time for CRUD data. When CRUD the data in the field has been indexed. MongoDB will have to update the relevant index again. This process will take more time and resources than not using index

# Index's Limit

- A collection can have a maximum of 64 indexes
- A collection has only 1 "index text"

# Some popular index types
